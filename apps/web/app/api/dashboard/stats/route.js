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
    const startOfYear = new Date(now.getFullYear(), 0, 1);

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
      investmentsByStatus,
      investmentsBySector,
      investmentsByProvince,
      monthlyInvestments,
      investorsByType,
      investorsByCountry,
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
          [sequelize.fn('SUM', sequelize.col('jobsIndirect')), 'totalJobsIndirect'],
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

      // Investments by status
      Investment.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        ],
        group: ['status'],
        raw: true,
      }),

      // Investments by sector
      Investment.findAll({
        attributes: [
          'sector',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        ],
        where: {
          sector: { [Op.ne]: null }
        },
        group: ['sector'],
        order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
        limit: 6,
        raw: true,
      }),

      // Investments by province
      Investment.findAll({
        attributes: [
          'province',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        ],
        where: {
          province: { [Op.ne]: null }
        },
        group: ['province'],
        order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
        limit: 10,
        raw: true,
      }),

      // Monthly investments for the year (for chart)
      Investment.findAll({
        attributes: [
          [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        ],
        where: {
          createdAt: { [Op.gte]: startOfYear }
        },
        group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
        order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
        raw: true,
      }),

      // Investors by type
      Investor.findAll({
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        where: {
          type: { [Op.ne]: null }
        },
        group: ['type'],
        raw: true,
      }),

      // Investors by country
      Investor.findAll({
        attributes: [
          'country',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        where: {
          country: { [Op.ne]: null }
        },
        group: ['country'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10,
        raw: true,
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

    const currentAmount = parseFloat(currentStats?.totalAmount) || 0;
    const lastMonthAmount = parseFloat(lastMonthStats?.totalAmount) || 0;
    const amountGrowth = lastMonthAmount > 0
      ? ((currentAmount - lastMonthAmount) / lastMonthAmount * 100)
      : 0;

    // Format monthly data for chart
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthlyData = monthNames.map((name, index) => {
      const monthData = monthlyInvestments.find(m => {
        const monthDate = new Date(m.month);
        return monthDate.getMonth() === index;
      });
      return {
        month: name,
        count: parseInt(monthData?.count) || 0,
        amount: parseFloat(monthData?.totalAmount) || 0,
      };
    });

    // Status distribution
    const statusDistribution = investmentsByStatus.map(s => ({
      status: s.status,
      count: parseInt(s.count),
      amount: parseFloat(s.totalAmount) || 0,
    }));

    // Sector distribution
    const sectorDistribution = investmentsBySector.map(s => ({
      sector: s.sector,
      count: parseInt(s.count),
      amount: parseFloat(s.totalAmount) || 0,
    }));

    // Province distribution
    const provinceDistribution = investmentsByProvince.map(p => ({
      province: p.province,
      count: parseInt(p.count),
      amount: parseFloat(p.totalAmount) || 0,
    }));

    // Investor type distribution
    const investorTypeDistribution = investorsByType.map(t => ({
      type: t.type,
      count: parseInt(t.count),
    }));

    // Country distribution
    const countryDistribution = investorsByCountry.map(c => ({
      country: c.country,
      count: parseInt(c.count),
    }));

    return NextResponse.json({
      summary: {
        totalInvestors,
        activeInvestors,
        investorGrowth: Math.round(investorGrowth * 10) / 10,

        totalInvestments,
        investmentGrowth: Math.round(investmentGrowth * 10) / 10,

        totalAmount: currentAmount,
        amountGrowth: Math.round(amountGrowth * 10) / 10,

        totalJobs: parseInt(currentStats?.totalJobs) || 0,
        totalJobsIndirect: parseInt(currentStats?.totalJobsIndirect) || 0,

        pendingApprovals,
        approvedThisMonth,
      },
      charts: {
        monthly: monthlyData,
        statusDistribution,
        sectorDistribution,
        provinceDistribution,
        investorTypeDistribution,
        countryDistribution,
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
          sector: invJson.sector,
          province: invJson.province,
          progress: invJson.progress || 0,
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
