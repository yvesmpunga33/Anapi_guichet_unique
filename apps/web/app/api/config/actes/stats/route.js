import { NextResponse } from 'next/server';
import { ActeAdministratif, PieceRequise, Ministry, Sector } from '../../../../../models/index.js';
import { Op, fn, col } from 'sequelize';

// GET - Statistiques des actes administratifs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // Statistiques globales
    const totalActes = await ActeAdministratif.count();
    const totalActifs = await ActeAdministratif.count({ where: { isActive: true } });
    const totalInactifs = totalActes - totalActifs;

    // Par categorie
    const byCategory = await ActeAdministratif.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('id')), 'count'],
        [fn('AVG', col('legalDelayDays')), 'avgDelay'],
        [fn('AVG', col('cost')), 'avgCost'],
      ],
      where: { isActive: true },
      group: ['category'],
      raw: true,
    });

    // Par ministere (top 10)
    const byMinistry = await ActeAdministratif.findAll({
      attributes: [
        'ministryId',
        [fn('COUNT', col('ActeAdministratif.id')), 'count'],
      ],
      include: [
        {
          model: Ministry,
          as: 'ministry',
          attributes: ['id', 'name', 'shortName'],
        },
      ],
      where: { isActive: true, ministryId: { [Op.not]: null } },
      group: ['ministryId', 'ministry.id', 'ministry.name', 'ministry.shortName'],
      order: [[fn('COUNT', col('ActeAdministratif.id')), 'DESC']],
      limit: 10,
      raw: false,
    });

    // Par secteur (top 10)
    const bySector = await ActeAdministratif.findAll({
      attributes: [
        'sectorId',
        [fn('COUNT', col('ActeAdministratif.id')), 'count'],
      ],
      include: [
        {
          model: Sector,
          as: 'sector',
          attributes: ['id', 'name', 'code'],
        },
      ],
      where: { isActive: true, sectorId: { [Op.not]: null } },
      group: ['sectorId', 'sector.id', 'sector.name', 'sector.code'],
      order: [[fn('COUNT', col('ActeAdministratif.id')), 'DESC']],
      limit: 10,
      raw: false,
    });

    // Statistiques sur les delais
    const delayStats = await ActeAdministratif.findAll({
      attributes: [
        [fn('MIN', col('legalDelayDays')), 'minDelay'],
        [fn('MAX', col('legalDelayDays')), 'maxDelay'],
        [fn('AVG', col('legalDelayDays')), 'avgDelay'],
      ],
      where: { isActive: true },
      raw: true,
    });

    // Statistiques sur les couts
    const costStats = await ActeAdministratif.findAll({
      attributes: [
        [fn('MIN', col('cost')), 'minCost'],
        [fn('MAX', col('cost')), 'maxCost'],
        [fn('AVG', col('cost')), 'avgCost'],
        [fn('SUM', col('cost')), 'totalCost'],
      ],
      where: { isActive: true },
      raw: true,
    });

    // Actes renouvelables vs non renouvelables
    const renewableStats = await ActeAdministratif.findAll({
      attributes: [
        'isRenewable',
        [fn('COUNT', col('id')), 'count'],
      ],
      where: { isActive: true },
      group: ['isRenewable'],
      raw: true,
    });

    // Nombre total de pieces requises
    const totalPieces = await PieceRequise.count({ where: { isActive: true } });
    const piecesObligatoires = await PieceRequise.count({ where: { isActive: true, isRequired: true } });

    // Moyenne de pieces par acte
    const avgPiecesPerActe = totalActifs > 0 ? (totalPieces / totalActifs).toFixed(1) : 0;

    // Pieces par categorie
    const piecesByCategory = await PieceRequise.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('id')), 'count'],
      ],
      where: { isActive: true },
      group: ['category'],
      raw: true,
    });

    return NextResponse.json({
      global: {
        totalActes,
        totalActifs,
        totalInactifs,
        totalPieces,
        piecesObligatoires,
        avgPiecesPerActe,
      },
      byCategory: byCategory.map(c => ({
        category: c.category,
        count: parseInt(c.count),
        avgDelay: parseFloat(c.avgDelay || 0).toFixed(1),
        avgCost: parseFloat(c.avgCost || 0).toFixed(2),
      })),
      byMinistry: byMinistry.map(m => ({
        ministryId: m.ministryId,
        ministry: m.ministry,
        count: parseInt(m.dataValues?.count || m.count),
      })),
      bySector: bySector.map(s => ({
        sectorId: s.sectorId,
        sector: s.sector,
        count: parseInt(s.dataValues?.count || s.count),
      })),
      delayStats: {
        min: parseInt(delayStats[0]?.minDelay || 0),
        max: parseInt(delayStats[0]?.maxDelay || 0),
        avg: parseFloat(delayStats[0]?.avgDelay || 0).toFixed(1),
      },
      costStats: {
        min: parseFloat(costStats[0]?.minCost || 0).toFixed(2),
        max: parseFloat(costStats[0]?.maxCost || 0).toFixed(2),
        avg: parseFloat(costStats[0]?.avgCost || 0).toFixed(2),
        total: parseFloat(costStats[0]?.totalCost || 0).toFixed(2),
      },
      renewableStats: {
        renewable: parseInt(renewableStats.find(r => r.isRenewable)?.count || 0),
        nonRenewable: parseInt(renewableStats.find(r => !r.isRenewable)?.count || 0),
      },
      piecesByCategory,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des statistiques', details: error.message },
      { status: 500 }
    );
  }
}
