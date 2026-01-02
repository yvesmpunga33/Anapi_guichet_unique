import { NextResponse } from 'next/server';
import { JuridicalText, Contract, LegalAlert, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Statistiques du module juridique
export async function GET() {
  try {
    // Compter les textes par statut
    const textsStats = await JuridicalText.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { isCurrentVersion: true },
      group: ['status'],
      raw: true,
    });

    const textsTotal = textsStats.reduce((acc, s) => acc + parseInt(s.count), 0);
    const textsActive = textsStats.find(s => s.status === 'ACTIVE')?.count || 0;

    // Compter les contrats par statut
    const contractsStats = await Contract.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true,
    });

    const contractsTotal = contractsStats.reduce((acc, s) => acc + parseInt(s.count), 0);
    const contractsActive = contractsStats.find(s => s.status === 'ACTIVE')?.count || 0;

    // Contrats expirant dans 30 jours
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const contractsExpiring = await Contract.count({
      where: {
        status: 'ACTIVE',
        endDate: {
          [Op.between]: [new Date(), thirtyDaysFromNow]
        }
      }
    });

    // Alertes par statut
    const alertsStats = await LegalAlert.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true,
    });

    const alertsPending = alertsStats.find(s => s.status === 'PENDING')?.count || 0;
    const alertsInProgress = alertsStats.find(s => s.status === 'IN_PROGRESS')?.count || 0;

    // Alertes urgentes (priority HIGH ou CRITICAL, non résolues)
    const alertsUrgent = await LegalAlert.count({
      where: {
        priority: { [Op.in]: ['HIGH', 'CRITICAL'] },
        status: { [Op.notIn]: ['RESOLVED', 'DISMISSED'] }
      }
    });

    // Derniers textes ajoutés
    const recentTexts = await JuridicalText.findAll({
      where: { isCurrentVersion: true },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'documentNumber', 'title', 'status', 'createdAt'],
    });

    // Derniers contrats ajoutés
    const recentContracts = await Contract.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'contractNumber', 'title', 'status', 'endDate', 'createdAt'],
    });

    return NextResponse.json({
      stats: {
        texts: {
          total: textsTotal,
          active: parseInt(textsActive),
        },
        contracts: {
          total: contractsTotal,
          active: parseInt(contractsActive),
          expiringSoon: contractsExpiring,
        },
        alerts: {
          pending: parseInt(alertsPending),
          inProgress: parseInt(alertsInProgress),
          urgent: alertsUrgent,
        },
      },
      recent: {
        texts: recentTexts,
        contracts: recentContracts,
      },
    });
  } catch (error) {
    console.error('Error fetching legal stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des statistiques' },
      { status: 500 }
    );
  }
}
