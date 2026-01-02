import { NextResponse } from 'next/server';
import { Dossier, Ministry, MinistryWorkflow } from '../../../../../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../../../../lib/sequelize.js';

// GET - Dashboard statistiques pour un ministère (basé sur les Dossiers du Guichet Unique)
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

    // Mapper les types de dossier vers les catégories
    const typeMapping = {
      'AUTORISATION': ['AUTORISATION', 'AUTORISATION_ACTIVITE'],
      'LICENCE': ['LICENCE', 'LICENCE_EXPLOITATION'],
      'PERMIS': ['PERMIS', 'PERMIS_CONSTRUCTION'],
    };

    // Statistiques globales par type de dossier
    const statsByType = await Dossier.findAll({
      where: { ministryId },
      attributes: [
        'dossierType',
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['dossierType', 'status'],
      raw: true,
    });

    // Organiser les stats par catégorie
    const stats = {
      AUTORISATION: { total: 0, pending: 0, inProgress: 0, approved: 0, rejected: 0 },
      LICENCE: { total: 0, pending: 0, inProgress: 0, approved: 0, rejected: 0 },
      PERMIS: { total: 0, pending: 0, inProgress: 0, approved: 0, rejected: 0 },
    };

    statsByType.forEach(s => {
      // Déterminer la catégorie basée sur le type de dossier
      let category = null;
      for (const [cat, types] of Object.entries(typeMapping)) {
        if (types.includes(s.dossierType)) {
          category = cat;
          break;
        }
      }
      if (!category) return;

      const count = parseInt(s.count);
      stats[category].total += count;

      if (['SUBMITTED', 'PENDING_DOCUMENTS'].includes(s.status)) {
        stats[category].pending += count;
      } else if (['IN_REVIEW', 'IN_PROGRESS', 'UNDER_REVIEW'].includes(s.status)) {
        stats[category].inProgress += count;
      } else if (s.status === 'APPROVED') {
        stats[category].approved += count;
      } else if (s.status === 'REJECTED') {
        stats[category].rejected += count;
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

    // Dossiers récents
    const recentDossiers = await Dossier.findAll({
      where: { ministryId },
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: [
        'id', 'dossierNumber', 'dossierType', 'investorName',
        'projectName', 'status', 'currentStep',
        'createdAt', 'submittedAt'
      ],
    });

    // Dossiers en attente urgents (plus de 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const urgentDossiers = await Dossier.findAll({
      where: {
        ministryId,
        status: { [Op.in]: ['SUBMITTED', 'IN_REVIEW', 'PENDING_DOCUMENTS'] },
        submittedAt: { [Op.lt]: thirtyDaysAgo },
      },
      order: [['submittedAt', 'ASC']],
      limit: 5,
    });

    // Evolution mensuelle (6 derniers mois)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Dossier.findAll({
      where: {
        ministryId,
        createdAt: { [Op.gte]: sixMonthsAgo },
      },
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        'dossierType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'dossierType'],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']],
      raw: true,
    });

    // Taux de traitement moyen
    const completedDossiers = await Dossier.findAll({
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
    if (completedDossiers.length > 0) {
      const totalDays = completedDossiers.reduce((sum, d) => {
        const days = Math.ceil(
          (new Date(d.decisionDate) - new Date(d.submittedAt)) / (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }, 0);
      avgProcessingDays = Math.round(totalDays / completedDossiers.length);
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
      recentRequests: recentDossiers,
      urgentRequests: urgentDossiers,
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
