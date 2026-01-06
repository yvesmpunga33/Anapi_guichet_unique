import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Investor, Investment, ApprovalRequest, LegalDocument, ProjectImpact, ProjectRisk, ProjectMilestone, sequelize } from '../../../../models/index.js';
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
      impactStats,
      risksByLevel,
      risksByCategory,
      criticalRisks,
      milestonesByStatus,
      delayedMilestones,
      milestoneProgress,
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

      // Impact stats - emplois créés réels
      ProjectImpact.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('direct_jobs_created')), 'totalDirectJobs'],
          [sequelize.fn('SUM', sequelize.col('indirect_jobs_created')), 'totalIndirectJobs'],
          [sequelize.fn('SUM', sequelize.col('permanent_jobs')), 'totalPermanentJobs'],
          [sequelize.fn('SUM', sequelize.col('temporary_jobs')), 'totalTemporaryJobs'],
          [sequelize.fn('SUM', sequelize.col('female_jobs')), 'totalFemaleJobs'],
          [sequelize.fn('SUM', sequelize.col('youth_jobs')), 'totalYouthJobs'],
          [sequelize.fn('SUM', sequelize.col('local_jobs')), 'totalLocalJobs'],
          [sequelize.fn('SUM', sequelize.col('actual_revenue')), 'totalRevenue'],
          [sequelize.fn('SUM', sequelize.col('taxes_paid')), 'totalTaxes'],
          [sequelize.fn('SUM', sequelize.col('export_revenue')), 'totalExports'],
          [sequelize.fn('SUM', sequelize.col('local_purchases')), 'totalLocalPurchases'],
          [sequelize.fn('SUM', sequelize.col('community_investment')), 'totalCommunityInvestment'],
          [sequelize.fn('SUM', sequelize.col('trained_employees')), 'totalTrainedEmployees'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalReports'],
        ],
        raw: true,
      }),

      // Risks stats
      ProjectRisk.findAll({
        attributes: [
          'riskLevel',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        where: {
          status: { [Op.notIn]: ['RESOLVED', 'ACCEPTED'] }
        },
        group: ['riskLevel'],
        raw: true,
      }),

      // Risks by category
      ProjectRisk.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        where: {
          status: { [Op.notIn]: ['RESOLVED', 'ACCEPTED'] }
        },
        group: ['category'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 5,
        raw: true,
      }),

      // Critical risks list
      ProjectRisk.findAll({
        where: {
          riskLevel: { [Op.in]: ['HIGH', 'CRITICAL'] },
          status: { [Op.notIn]: ['RESOLVED', 'ACCEPTED'] }
        },
        include: [{
          model: Investment,
          as: 'project',
          attributes: ['id', 'projectName', 'projectCode'],
        }],
        order: [['riskScore', 'DESC']],
        limit: 5,
      }),

      // Milestones stats
      ProjectMilestone.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        group: ['status'],
        raw: true,
      }),

      // Delayed milestones (planned end date passed but not completed)
      ProjectMilestone.findAll({
        where: {
          status: { [Op.notIn]: ['COMPLETED', 'CANCELLED'] },
          plannedEndDate: { [Op.lt]: new Date() }
        },
        include: [{
          model: Investment,
          as: 'project',
          attributes: ['id', 'projectName', 'projectCode'],
        }],
        order: [['plannedEndDate', 'ASC']],
        limit: 5,
      }),

      // Total milestones progress
      ProjectMilestone.findOne({
        attributes: [
          [sequelize.fn('AVG', sequelize.col('progress')), 'avgProgress'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        ],
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

    // Format impact stats
    const impacts = {
      totalDirectJobs: parseInt(impactStats?.totalDirectJobs) || 0,
      totalIndirectJobs: parseInt(impactStats?.totalIndirectJobs) || 0,
      totalPermanentJobs: parseInt(impactStats?.totalPermanentJobs) || 0,
      totalTemporaryJobs: parseInt(impactStats?.totalTemporaryJobs) || 0,
      totalFemaleJobs: parseInt(impactStats?.totalFemaleJobs) || 0,
      totalYouthJobs: parseInt(impactStats?.totalYouthJobs) || 0,
      totalLocalJobs: parseInt(impactStats?.totalLocalJobs) || 0,
      totalRevenue: parseFloat(impactStats?.totalRevenue) || 0,
      totalTaxes: parseFloat(impactStats?.totalTaxes) || 0,
      totalExports: parseFloat(impactStats?.totalExports) || 0,
      totalLocalPurchases: parseFloat(impactStats?.totalLocalPurchases) || 0,
      totalCommunityInvestment: parseFloat(impactStats?.totalCommunityInvestment) || 0,
      totalTrainedEmployees: parseInt(impactStats?.totalTrainedEmployees) || 0,
      totalReports: parseInt(impactStats?.totalReports) || 0,
    };

    // Format risks distribution
    const risksDistribution = risksByLevel.map(r => ({
      level: r.riskLevel,
      count: parseInt(r.count),
    }));

    const risksCategoryDistribution = risksByCategory.map(r => ({
      category: r.category,
      count: parseInt(r.count),
    }));

    // Format critical risks
    const formattedCriticalRisks = criticalRisks.map(r => {
      const riskJson = r.toJSON();
      return {
        id: riskJson.id,
        title: riskJson.title,
        category: riskJson.category,
        riskLevel: riskJson.riskLevel,
        riskScore: riskJson.riskScore,
        status: riskJson.status,
        projectId: riskJson.project?.id,
        projectName: riskJson.project?.projectName,
        projectCode: riskJson.project?.projectCode,
      };
    });

    // Format milestones stats
    const milestonesDistribution = milestonesByStatus.map(m => ({
      status: m.status,
      count: parseInt(m.count),
    }));

    // Format delayed milestones
    const formattedDelayedMilestones = delayedMilestones.map(m => {
      const milestoneJson = m.toJSON();
      return {
        id: milestoneJson.id,
        name: milestoneJson.name,
        status: milestoneJson.status,
        progress: milestoneJson.progress,
        plannedEndDate: milestoneJson.plannedEndDate,
        projectId: milestoneJson.project?.id,
        projectName: milestoneJson.project?.projectName,
        projectCode: milestoneJson.project?.projectCode,
      };
    });

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
      // New consolidated impact data
      impacts,
      // Risks data
      risks: {
        distribution: risksDistribution,
        byCategory: risksCategoryDistribution,
        critical: formattedCriticalRisks,
        totalCritical: formattedCriticalRisks.length,
        totalHigh: risksDistribution.find(r => r.level === 'HIGH')?.count || 0,
      },
      // Milestones data
      milestones: {
        distribution: milestonesDistribution,
        delayed: formattedDelayedMilestones,
        avgProgress: Math.round(parseFloat(milestoneProgress?.avgProgress) || 0),
        total: parseInt(milestoneProgress?.total) || 0,
        completed: milestonesDistribution.find(m => m.status === 'COMPLETED')?.count || 0,
        inProgress: milestonesDistribution.find(m => m.status === 'IN_PROGRESS')?.count || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
