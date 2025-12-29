import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Investor, Investment, ApprovalRequest, LegalDocument, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET /api/dashboard/stats - Statistiques du tableau de bord
export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Get current date range (this month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Parallel queries for performance
    const [
      totalInvestors,
      activeInvestors,
      lastMonthInvestors,
      totalInvestments,
      lastMonthInvestments,
      investmentStats,
      lastMonthInvestmentStats,
      pendingApprovals,
      approvedThisMonth,
      documentStats,
      recentInvestments,
    ] = await Promise.all([
      // Total investors
      Investor.count(),

      // Active investors (InvestorStatus enum uses ACTIVE, not APPROVED)
      Investor.count({ where: { status: 'ACTIVE' } }),

      // Last month investors
      Investor.count({
        where: {
          createdAt: {
            [Op.between]: [startOfLastMonth, endOfLastMonth],
          },
        },
      }),

      // Total investments
      Investment.count(),

      // Last month investments
      Investment.count({
        where: {
          createdAt: {
            [Op.between]: [startOfLastMonth, endOfLastMonth],
          },
        },
      }),

      // Investment stats (total amount and jobs)
      Investment.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
          [sequelize.fn('SUM', sequelize.col('jobsCreated')), 'totalJobs'],
        ],
        raw: true,
      }),

      // Last month investment stats
      Investment.findOne({
        where: {
          createdAt: {
            [Op.between]: [startOfLastMonth, endOfLastMonth],
          },
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
          [sequelize.fn('SUM', sequelize.col('jobsCreated')), 'totalJobs'],
        ],
        raw: true,
      }),

      // Pending approvals (ApprovalStatus uses SUBMITTED or UNDER_REVIEW for pending)
      ApprovalRequest.count({
        where: {
          status: {
            [Op.in]: ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_DOCUMENTS']
          }
        },
      }),

      // Approved this month (using decisionDate)
      ApprovalRequest.count({
        where: {
          status: 'APPROVED',
          decisionDate: {
            [Op.gte]: startOfMonth,
          },
        },
      }),

      // Document stats by status
      LegalDocument.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        group: ['status'],
        raw: true,
      }),

      // Recent investments (last 5)
      Investment.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Investor,
            as: 'investor',
            attributes: ['name'],
          },
        ],
      }),
    ]);

    // Cast stats results
    const currentStats = investmentStats;
    const lastMonthStats = lastMonthInvestmentStats;

    // Calculate growth percentages
    const investorGrowth = lastMonthInvestors > 0
      ? ((totalInvestors - lastMonthInvestors) / lastMonthInvestors * 100)
      : 0;

    const investmentGrowth = lastMonthInvestments > 0
      ? ((totalInvestments - lastMonthInvestments) / lastMonthInvestments * 100)
      : 0;

    const currentAmount = currentStats?.totalAmount || 0;
    const lastMonthAmount = lastMonthStats?.totalAmount || 0;
    const amountGrowth = lastMonthAmount > 0
      ? ((currentAmount - lastMonthAmount) / lastMonthAmount * 100)
      : 0;

    return NextResponse.json({
      summary: {
        totalInvestors,
        activeInvestors,
        investorGrowth: Math.round(investorGrowth * 10) / 10,

        totalInvestments,
        investmentGrowth: Math.round(investmentGrowth * 10) / 10,

        totalAmount: currentAmount,
        amountGrowth: Math.round(amountGrowth * 10) / 10,

        totalJobs: currentStats?.totalJobs || 0,

        pendingApprovals,
        approvedThisMonth,
      },
      documents: documentStats.reduce((acc, s) => {
        acc[s.status] = parseInt(s.count);
        return acc;
      }, {}),
      recentInvestments: recentInvestments.map(inv => {
        const invJson = inv.toJSON();
        return {
          id: invJson.id,
          projectCode: invJson.projectCode,
          name: invJson.projectName,
          amount: invJson.amount,
          status: invJson.status,
          investor: invJson.investor?.name,
          createdAt: invJson.createdAt,
        };
      }),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
