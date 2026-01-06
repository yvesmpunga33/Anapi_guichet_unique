import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import {
  BusinessBarrier,
  MediationCase,
  StakeholderDialogue,
  LegalProposal,
  InternationalTreaty,
  sequelize,
} from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET /api/business-climate/statistics - Get dashboard statistics
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const yearFilter = {
      createdAt: {
        [Op.gte]: startOfYear,
        [Op.lt]: endOfYear,
      },
    };

    // Parallel queries for statistics
    const [
      barrierStats,
      mediationStats,
      dialogueStats,
      proposalStats,
      treatyStats,
      barriersByCategory,
      barriersByStatus,
      mediationsByType,
      recentBarriers,
      upcomingDialogues,
    ] = await Promise.all([
      // Barrier statistics
      BusinessBarrier.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'RESOLVED' THEN 1 END")), 'resolved'],
          [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'IN_PROGRESS' THEN 1 END")), 'inProgress'],
          [sequelize.fn('COUNT', sequelize.literal("CASE WHEN severity = 'CRITICAL' THEN 1 END")), 'critical'],
        ],
        where: yearFilter,
        raw: true,
      }),

      // Mediation statistics
      MediationCase.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'AGREEMENT_REACHED' OR status = 'CLOSED' THEN 1 END")), 'settled'],
          [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'IN_MEDIATION' OR status = 'SCHEDULED' THEN 1 END")), 'ongoing'],
          [sequelize.fn('SUM', sequelize.col('disputedAmount')), 'totalClaimAmount'],
          [sequelize.fn('SUM', sequelize.col('disputedAmount')), 'totalSettlementAmount'],
        ],
        where: yearFilter,
        raw: true,
      }),

      // Dialogue statistics
      StakeholderDialogue.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'COMPLETED' THEN 1 END")), 'completed'],
          [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status IN ('PLANNED', 'CONFIRMED') THEN 1 END")), 'upcoming'],
          [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('"expectedParticipants"')), 0), 'totalParticipants'],
        ],
        where: yearFilter,
        raw: true,
      }),

      // Proposal statistics
      LegalProposal.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'ADOPTED' THEN 1 END")), 'adopted'],
          [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'UNDER_REVIEW' THEN 1 END")), 'underReview'],
        ],
        where: yearFilter,
        raw: true,
      }),

      // Treaty statistics (all time)
      InternationalTreaty.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('COUNT', sequelize.literal("CASE WHEN status = 'IN_FORCE' THEN 1 END")), 'inForce'],
        ],
        raw: true,
      }),

      // Barriers by category
      BusinessBarrier.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        where: yearFilter,
        group: ['category'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        raw: true,
      }),

      // Barriers by status
      BusinessBarrier.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        where: yearFilter,
        group: ['status'],
        raw: true,
      }),

      // Mediations by dispute type
      MediationCase.findAll({
        attributes: [
          'disputeType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        where: yearFilter,
        group: ['disputeType'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        raw: true,
      }),

      // Recent barriers
      BusinessBarrier.findAll({
        where: { status: { [Op.ne]: 'RESOLVED' } },
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'reference', 'title', 'category', 'severity', 'status', 'createdAt'],
        raw: true,
      }),

      // Upcoming dialogues
      StakeholderDialogue.findAll({
        where: {
          scheduledDate: { [Op.gte]: new Date() },
          status: { [Op.in]: ['PLANNED', 'CONFIRMED'] },
        },
        order: [['scheduledDate', 'ASC']],
        limit: 5,
        attributes: ['id', 'reference', 'title', 'eventType', 'scheduledDate', 'venue'],
        raw: true,
      }),
    ]);

    // Calculate resolution rate
    const totalBarriers = parseInt(barrierStats[0]?.total) || 0;
    const resolvedBarriers = parseInt(barrierStats[0]?.resolved) || 0;
    const resolutionRate = totalBarriers > 0 ? Math.round((resolvedBarriers / totalBarriers) * 100) : 0;

    // Calculate mediation success rate
    const totalMediations = parseInt(mediationStats[0]?.total) || 0;
    const settledMediations = parseInt(mediationStats[0]?.settled) || 0;
    const mediationSuccessRate = totalMediations > 0 ? Math.round((settledMediations / totalMediations) * 100) : 0;

    return NextResponse.json({
      year,
      barriers: {
        total: totalBarriers,
        resolved: resolvedBarriers,
        inProgress: parseInt(barrierStats[0]?.inProgress) || 0,
        critical: parseInt(barrierStats[0]?.critical) || 0,
        resolutionRate,
        byCategory: barriersByCategory,
        byStatus: barriersByStatus,
        recent: recentBarriers,
      },
      mediations: {
        total: totalMediations,
        settled: settledMediations,
        ongoing: parseInt(mediationStats[0]?.ongoing) || 0,
        successRate: mediationSuccessRate,
        totalClaimAmount: parseFloat(mediationStats[0]?.totalClaimAmount) || 0,
        totalSettlementAmount: parseFloat(mediationStats[0]?.totalSettlementAmount) || 0,
        byType: mediationsByType,
      },
      dialogues: {
        total: parseInt(dialogueStats[0]?.total) || 0,
        completed: parseInt(dialogueStats[0]?.completed) || 0,
        upcoming: parseInt(dialogueStats[0]?.upcoming) || 0,
        totalParticipants: parseInt(dialogueStats[0]?.totalParticipants) || 0,
        upcomingEvents: upcomingDialogues,
      },
      proposals: {
        total: parseInt(proposalStats[0]?.total) || 0,
        adopted: parseInt(proposalStats[0]?.adopted) || 0,
        underReview: parseInt(proposalStats[0]?.underReview) || 0,
      },
      treaties: {
        total: parseInt(treatyStats[0]?.total) || 0,
        inForce: parseInt(treatyStats[0]?.inForce) || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques', details: error.message },
      { status: 500 }
    );
  }
}
