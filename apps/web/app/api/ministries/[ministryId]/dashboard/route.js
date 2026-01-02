import { NextResponse } from 'next/server';
import { MinistryRequest, Ministry, MinistryWorkflow } from '../../../../../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../../../../lib/sequelize.js';

// GET - Dashboard statistiques pour un ministère
export async function GET(request, { params }) {
  try {
    const { ministryId } = await params;

    // Vérifier que le ministère existe
    const ministry = await Ministry.findByPk(ministryId);
    if (!ministry) {
      return NextResponse.json(
        { error: 'Ministere non trouve' },
        { status: 404 }
      );
    }

    // Statistiques globales par type de demande
    const statsByType = await MinistryRequest.findAll({
      where: { ministryId },
      attributes: [
        'requestType',
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['requestType', 'status'],
      raw: true,
    });

    // Organiser les stats
    const stats = {
      AUTORISATION: { total: 0, pending: 0, inProgress: 0, approved: 0, rejected: 0 },
      LICENCE: { total: 0, pending: 0, inProgress: 0, approved: 0, rejected: 0 },
      PERMIS: { total: 0, pending: 0, inProgress: 0, approved: 0, rejected: 0 },
    };

    statsByType.forEach(s => {
      const type = s.requestType;
      const count = parseInt(s.count);
      stats[type].total += count;

      if (['SUBMITTED', 'PENDING_DOCUMENTS'].includes(s.status)) {
        stats[type].pending += count;
      } else if (['IN_PROGRESS', 'UNDER_REVIEW'].includes(s.status)) {
        stats[type].inProgress += count;
      } else if (s.status === 'APPROVED') {
        stats[type].approved += count;
      } else if (s.status === 'REJECTED') {
        stats[type].rejected += count;
      }
    });

    // Total général
    const globalStats = {
      total: stats.AUTORISATION.total + stats.LICENCE.total + stats.PERMIS.total,
      pending: stats.AUTORISATION.pending + stats.LICENCE.pending + stats.PERMIS.pending,
      inProgress: stats.AUTORISATION.inProgress + stats.LICENCE.inProgress + stats.PERMIS.inProgress,
      approved: stats.AUTORISATION.approved + stats.LICENCE.approved + stats.PERMIS.approved,
      rejected: stats.AUTORISATION.rejected + stats.LICENCE.rejected + stats.PERMIS.rejected,
    };

    // Demandes récentes
    const recentRequests = await MinistryRequest.findAll({
      where: { ministryId },
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: [
        'id', 'requestNumber', 'requestType', 'applicantName',
        'subject', 'status', 'currentStep', 'totalSteps',
        'priority', 'createdAt', 'submittedAt'
      ],
    });

    // Demandes urgentes ou en retard
    const urgentRequests = await MinistryRequest.findAll({
      where: {
        ministryId,
        status: { [Op.in]: ['SUBMITTED', 'IN_PROGRESS', 'PENDING_DOCUMENTS'] },
        [Op.or]: [
          { priority: 'URGENT' },
          { priority: 'HIGH' },
          {
            dueDate: {
              [Op.lt]: new Date(),
            },
          },
        ],
      },
      order: [['priority', 'DESC'], ['createdAt', 'ASC']],
      limit: 5,
    });

    // Evolution mensuelle (6 derniers mois)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await MinistryRequest.findAll({
      where: {
        ministryId,
        createdAt: { [Op.gte]: sixMonthsAgo },
      },
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        'requestType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'requestType'],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
      raw: true,
    });

    // Taux de traitement moyen
    const completedRequests = await MinistryRequest.findAll({
      where: {
        ministryId,
        status: { [Op.in]: ['APPROVED', 'REJECTED'] },
        submittedAt: { [Op.ne]: null },
        decisionDate: { [Op.ne]: null },
      },
      attributes: ['submittedAt', 'decisionDate'],
      raw: true,
    });

    let avgProcessingDays = 0;
    if (completedRequests.length > 0) {
      const totalDays = completedRequests.reduce((sum, r) => {
        const days = Math.ceil(
          (new Date(r.decisionDate) - new Date(r.submittedAt)) / (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }, 0);
      avgProcessingDays = Math.round(totalDays / completedRequests.length);
    }

    // Workflows configurés
    const workflows = await MinistryWorkflow.findAll({
      where: { ministryId, isActive: true },
      attributes: ['requestType', [sequelize.fn('COUNT', sequelize.col('id')), 'steps']],
      group: ['requestType'],
      raw: true,
    });

    const workflowConfig = {
      AUTORISATION: 0,
      LICENCE: 0,
      PERMIS: 0,
    };
    workflows.forEach(w => {
      workflowConfig[w.requestType] = parseInt(w.steps);
    });

    return NextResponse.json({
      success: true,
      ministry: {
        id: ministry.id,
        name: ministry.name,
        code: ministry.code,
      },
      stats,
      globalStats,
      recentRequests,
      urgentRequests,
      monthlyStats,
      avgProcessingDays,
      workflowConfig,
    });
  } catch (error) {
    console.error('Error fetching ministry dashboard:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du dashboard', details: error.message },
      { status: 500 }
    );
  }
}
