import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Dashboard statistics
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    // Stats des appels d'offres
    const [tenderStats] = await sequelize.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'DRAFT') as draft,
        COUNT(*) FILTER (WHERE status = 'PUBLISHED') as published,
        COUNT(*) FILTER (WHERE status = 'SUBMISSION_CLOSED') as closed,
        COUNT(*) FILTER (WHERE status = 'EVALUATION') as evaluation,
        COUNT(*) FILTER (WHERE status = 'AWARDED') as awarded,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed,
        COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled,
        COALESCE(SUM(estimated_budget), 0) as total_budget,
        COUNT(*) FILTER (WHERE created_at >= :startOfYear AND created_at <= :endOfYear) as this_year
      FROM procurement_tenders
    `, {
      replacements: { startOfYear, endOfYear },
    });

    // Stats des soumissions
    const [bidStats] = await sequelize.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'RECEIVED') as received,
        COUNT(*) FILTER (WHERE status = 'EVALUATED') as evaluated,
        COUNT(*) FILTER (WHERE status = 'AWARDED') as awarded,
        COUNT(*) FILTER (WHERE status = 'REJECTED') as rejected,
        AVG(total_score) as avg_score
      FROM procurement_bids
    `);

    // Stats des soumissionnaires
    const [bidderStats] = await sequelize.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'ACTIVE') as active,
        COUNT(*) FILTER (WHERE status = 'BLACKLISTED') as blacklisted,
        AVG(total_contracts_won) as avg_contracts,
        SUM(total_contracts_value) as total_contracts_value
      FROM procurement_bidders
    `);

    // Stats des contrats
    const [contractStats] = await sequelize.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'DRAFT') as draft,
        COUNT(*) FILTER (WHERE status = 'SIGNED') as signed,
        COUNT(*) FILTER (WHERE status = 'ACTIVE') as active,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed,
        COUNT(*) FILTER (WHERE status = 'TERMINATED') as terminated,
        COALESCE(SUM(contract_value), 0) as total_value,
        COALESCE(SUM(total_paid), 0) as total_paid,
        AVG(progress_percent) as avg_progress
      FROM procurement_contracts
    `);

    // Montants par mois (année en cours)
    const [monthlyData] = await sequelize.query(`
      SELECT
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(*) as count,
        COALESCE(SUM(estimated_budget), 0) as amount
      FROM procurement_tenders
      WHERE EXTRACT(YEAR FROM created_at) = :year
      GROUP BY EXTRACT(MONTH FROM created_at)
      ORDER BY month
    `, {
      replacements: { year },
    });

    // Contrats par mois
    const [contractsMonthly] = await sequelize.query(`
      SELECT
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(*) as count,
        COALESCE(SUM(contract_value), 0) as amount
      FROM procurement_contracts
      WHERE EXTRACT(YEAR FROM created_at) = :year
      GROUP BY EXTRACT(MONTH FROM created_at)
      ORDER BY month
    `, {
      replacements: { year },
    });

    // Top 5 soumissionnaires
    const [topBidders] = await sequelize.query(`
      SELECT
        id, company_name, code, total_contracts_won, total_contracts_value, rating
      FROM procurement_bidders
      WHERE status = 'ACTIVE'
      ORDER BY total_contracts_value DESC NULLS LAST
      LIMIT 5
    `);

    // Appels d'offres recents
    const [recentTenders] = await sequelize.query(`
      SELECT
        id, reference, title, status, estimated_budget, currency,
        submission_deadline, created_at
      FROM procurement_tenders
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Contrats recents
    const [recentContracts] = await sequelize.query(`
      SELECT
        c.id, c.contract_number, c.title, c.status, c.contract_value, c.currency,
        c.progress_percent, b.company_name as contractor_name
      FROM procurement_contracts c
      LEFT JOIN procurement_bidders b ON c.bidder_id = b.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `);

    // Alertes (deadlines proches, contrats a echeance)
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [upcomingDeadlines] = await sequelize.query(`
      SELECT
        id, reference, title, submission_deadline, status
      FROM procurement_tenders
      WHERE submission_deadline IS NOT NULL
        AND submission_deadline >= :now
        AND submission_deadline <= :in7Days
        AND status = 'PUBLISHED'
      ORDER BY submission_deadline ASC
      LIMIT 5
    `, {
      replacements: { now, in7Days },
    });

    const [expiringContracts] = await sequelize.query(`
      SELECT
        id, contract_number, title, end_date, status
      FROM procurement_contracts
      WHERE end_date IS NOT NULL
        AND end_date >= :now
        AND end_date <= :in7Days
        AND status = 'ACTIVE'
      ORDER BY end_date ASC
      LIMIT 5
    `, {
      replacements: { now, in7Days },
    });

    return NextResponse.json({
      success: true,
      data: {
        year,
        tenders: tenderStats[0] || {},
        bids: bidStats[0] || {},
        bidders: bidderStats[0] || {},
        contracts: contractStats[0] || {},
        charts: {
          tendersMonthly: monthlyData,
          contractsMonthly,
        },
        topBidders,
        recentTenders,
        recentContracts,
        alerts: {
          upcomingDeadlines,
          expiringContracts,
        },
      },
    });

  } catch (error) {
    console.error('Error fetching procurement dashboard:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des statistiques', details: error.message },
      { status: 500 }
    );
  }
}
