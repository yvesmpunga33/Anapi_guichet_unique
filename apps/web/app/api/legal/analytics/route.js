import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Contract, JuridicalText, LegalAlert, ContractType, LegalDomain } from '../../../../models/index.js';
import { Op, fn, col, literal } from 'sequelize';
import sequelize from '../../../lib/sequelize.js';

// GET - Obtenir les analytics pour le dashboard juridique
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '12months'; // 3months, 6months, 12months, all

    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case '3months':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(today.getMonth() - 6);
        break;
      case '12months':
        startDate.setMonth(today.getMonth() - 12);
        break;
      case 'all':
        startDate = new Date('2000-01-01');
        break;
    }

    // ===== STATISTIQUES GENERALES =====
    const [
      totalContracts,
      activeContracts,
      totalTexts,
      activeTexts,
      pendingAlerts,
      resolvedAlerts,
    ] = await Promise.all([
      Contract.count(),
      Contract.count({ where: { status: 'ACTIVE' } }),
      JuridicalText.count(),
      JuridicalText.count({ where: { status: 'IN_FORCE' } }),
      LegalAlert.count({ where: { status: 'PENDING' } }),
      LegalAlert.count({ where: { status: 'RESOLVED' } }),
    ]);

    // ===== VALEUR TOTALE DES CONTRATS =====
    const contractValues = await Contract.findAll({
      where: { status: 'ACTIVE' },
      attributes: ['value', 'currency'],
    });

    const totalValueByCurrency = {};
    contractValues.forEach(c => {
      const currency = c.currency || 'USD';
      totalValueByCurrency[currency] = (totalValueByCurrency[currency] || 0) + (parseFloat(c.value) || 0);
    });

    // ===== CONTRATS PAR STATUT =====
    const contractsByStatus = await Contract.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['status'],
    });

    // ===== CONTRATS PAR TYPE =====
    const contractsByType = await Contract.findAll({
      attributes: [
        'typeId',
        [fn('COUNT', col('Contract.id')), 'count'],
      ],
      include: [{
        model: ContractType,
        as: 'type',
        attributes: ['name'],
      }],
      group: ['typeId', 'type.id', 'type.name'],
    });

    // ===== CONTRATS EXPIRANT (30, 60, 90 jours) =====
    const thirtyDays = new Date(today);
    thirtyDays.setDate(today.getDate() + 30);
    const sixtyDays = new Date(today);
    sixtyDays.setDate(today.getDate() + 60);
    const ninetyDays = new Date(today);
    ninetyDays.setDate(today.getDate() + 90);

    const [expiring30, expiring60, expiring90] = await Promise.all([
      Contract.count({
        where: {
          status: 'ACTIVE',
          endDate: { [Op.between]: [today, thirtyDays] },
        },
      }),
      Contract.count({
        where: {
          status: 'ACTIVE',
          endDate: { [Op.between]: [thirtyDays, sixtyDays] },
        },
      }),
      Contract.count({
        where: {
          status: 'ACTIVE',
          endDate: { [Op.between]: [sixtyDays, ninetyDays] },
        },
      }),
    ]);

    // ===== EVOLUTION DES CONTRATS (par mois) =====
    const contractsOverTime = await Contract.findAll({
      where: {
        createdAt: { [Op.gte]: startDate },
      },
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
        [fn('COUNT', col('id')), 'count'],
      ],
      group: [fn('DATE_TRUNC', 'month', col('createdAt'))],
      order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']],
      raw: true,
    });

    // ===== ALERTES PAR PRIORITE =====
    const alertsByPriority = await LegalAlert.findAll({
      attributes: [
        'priority',
        [fn('COUNT', col('id')), 'count'],
      ],
      where: { status: 'PENDING' },
      group: ['priority'],
    });

    // ===== ALERTES PAR TYPE =====
    const alertsByType = await LegalAlert.findAll({
      attributes: [
        'type',
        [fn('COUNT', col('id')), 'count'],
      ],
      where: { status: 'PENDING' },
      group: ['type'],
    });

    // ===== TEXTES PAR DOMAINE =====
    const textsByDomain = await JuridicalText.findAll({
      attributes: [
        'domainId',
        [fn('COUNT', col('JuridicalText.id')), 'count'],
      ],
      include: [{
        model: LegalDomain,
        as: 'domain',
        attributes: ['name'],
      }],
      group: ['domainId', 'domain.id', 'domain.name'],
    });

    // ===== TEXTES PAR STATUT =====
    const textsByStatus = await JuridicalText.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['status'],
    });

    // ===== CONTRATS RECEMMENT CREES =====
    const recentContracts = await Contract.findAll({
      where: {
        createdAt: { [Op.gte]: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) },
      },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'status', 'value', 'currency', 'createdAt'],
    });

    // ===== VALEUR DES CONTRATS PAR MOIS =====
    const contractValueOverTime = await Contract.findAll({
      where: {
        createdAt: { [Op.gte]: startDate },
        value: { [Op.not]: null },
      },
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
        [fn('SUM', col('value')), 'totalValue'],
        [fn('COUNT', col('id')), 'count'],
      ],
      group: [fn('DATE_TRUNC', 'month', col('createdAt'))],
      order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']],
      raw: true,
    });

    // ===== TAUX DE RESOLUTION DES ALERTES =====
    const totalAlertsCreated = await LegalAlert.count({
      where: { createdAt: { [Op.gte]: startDate } },
    });
    const alertsResolved = await LegalAlert.count({
      where: {
        createdAt: { [Op.gte]: startDate },
        status: 'RESOLVED',
      },
    });
    const resolutionRate = totalAlertsCreated > 0
      ? Math.round((alertsResolved / totalAlertsCreated) * 100)
      : 0;

    // ===== TOP TYPES DE CONTRATS PAR VALEUR =====
    const topContractTypesByValue = await Contract.findAll({
      where: { value: { [Op.not]: null } },
      attributes: [
        'typeId',
        [fn('SUM', col('value')), 'totalValue'],
        [fn('COUNT', col('Contract.id')), 'count'],
      ],
      include: [{
        model: ContractType,
        as: 'type',
        attributes: ['name'],
      }],
      group: ['typeId', 'type.id', 'type.name'],
      order: [[fn('SUM', col('value')), 'DESC']],
      limit: 5,
    });

    return NextResponse.json({
      period,
      generatedAt: new Date().toISOString(),

      // Statistiques principales
      summary: {
        totalContracts,
        activeContracts,
        totalTexts,
        activeTexts,
        pendingAlerts,
        resolvedAlerts,
        alertResolutionRate: resolutionRate,
      },

      // Valeurs financieres
      financial: {
        totalValueByCurrency,
        topContractTypesByValue: topContractTypesByValue.map(t => ({
          type: t.type?.name || 'Non categorise',
          totalValue: parseFloat(t.dataValues.totalValue) || 0,
          count: parseInt(t.dataValues.count) || 0,
        })),
      },

      // Distribution des contrats
      contracts: {
        byStatus: contractsByStatus.map(c => ({
          status: c.status,
          count: parseInt(c.dataValues.count),
        })),
        byType: contractsByType.map(c => ({
          type: c.type?.name || 'Non categorise',
          count: parseInt(c.dataValues.count),
        })),
        expiring: {
          next30Days: expiring30,
          next60Days: expiring60,
          next90Days: expiring90,
        },
        overTime: contractsOverTime.map(c => ({
          month: c.month,
          count: parseInt(c.count),
        })),
        valueOverTime: contractValueOverTime.map(c => ({
          month: c.month,
          totalValue: parseFloat(c.totalValue) || 0,
          count: parseInt(c.count),
        })),
        recent: recentContracts.map(c => c.toJSON()),
      },

      // Distribution des alertes
      alerts: {
        byPriority: alertsByPriority.map(a => ({
          priority: a.priority,
          count: parseInt(a.dataValues.count),
        })),
        byType: alertsByType.map(a => ({
          type: a.type,
          count: parseInt(a.dataValues.count),
        })),
      },

      // Distribution des textes
      texts: {
        byDomain: textsByDomain.map(t => ({
          domain: t.domain?.name || 'Non categorise',
          count: parseInt(t.dataValues.count),
        })),
        byStatus: textsByStatus.map(t => ({
          status: t.status,
          count: parseInt(t.dataValues.count),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching legal analytics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des analytics' },
      { status: 500 }
    );
  }
}
