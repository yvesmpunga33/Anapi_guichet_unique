import { NextResponse } from 'next/server';
import { ProvinceOpportunity, Province, Sector } from '../../../../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../../../../app/lib/sequelize.js';

// GET - Obtenir les opportunites groupees par province (pour la carte interactive)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectorId = searchParams.get('sectorId');
    const status = searchParams.get('status') || 'PUBLISHED';

    // Get all provinces with their opportunity counts
    const provinces = await Province.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    });

    // Build where clause for opportunities
    const opportunityWhere = { status };
    if (sectorId) {
      opportunityWhere.sectorId = sectorId;
    }

    // Get opportunity counts per province
    const opportunityCounts = await ProvinceOpportunity.findAll({
      attributes: [
        'provinceId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('minInvestment')), 'totalMinInvestment'],
        [sequelize.fn('SUM', sequelize.col('expectedJobs')), 'totalExpectedJobs'],
      ],
      where: opportunityWhere,
      group: ['provinceId'],
      raw: true,
    });

    // Map counts to provinces
    const countsMap = {};
    opportunityCounts.forEach(item => {
      countsMap[item.provinceId] = {
        count: parseInt(item.count) || 0,
        totalMinInvestment: parseFloat(item.totalMinInvestment) || 0,
        totalExpectedJobs: parseInt(item.totalExpectedJobs) || 0,
      };
    });

    // Combine provinces with their counts
    const provincesWithCounts = provinces.map(province => {
      const counts = countsMap[province.id] || { count: 0, totalMinInvestment: 0, totalExpectedJobs: 0 };
      return {
        id: province.id,
        code: province.code,
        name: province.name,
        capital: province.capital,
        population: province.population,
        area: province.area,
        opportunitiesCount: counts.count,
        totalMinInvestment: counts.totalMinInvestment,
        totalExpectedJobs: counts.totalExpectedJobs,
      };
    });

    // Get sectors with opportunity counts for filters
    const sectorCounts = await ProvinceOpportunity.findAll({
      attributes: [
        'sectorId',
        [sequelize.fn('COUNT', sequelize.col('ProvinceOpportunity.id')), 'count'],
      ],
      where: { status },
      include: [
        {
          model: Sector,
          as: 'sector',
          attributes: ['id', 'code', 'name', 'color'],
        },
      ],
      group: ['sectorId', 'sector.id', 'sector.code', 'sector.name', 'sector.color'],
      raw: true,
      nest: true,
    });

    // Get featured opportunities
    const featuredOpportunities = await ProvinceOpportunity.findAll({
      where: {
        status: 'PUBLISHED',
        isFeatured: true,
      },
      include: [
        {
          model: Province,
          as: 'province',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Sector,
          as: 'sector',
          attributes: ['id', 'code', 'name', 'color'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 6,
    });

    // Global stats
    const stats = {
      totalProvinces: provinces.length,
      provincesWithOpportunities: Object.keys(countsMap).length,
      totalOpportunities: await ProvinceOpportunity.count({ where: { status: 'PUBLISHED' } }),
      totalInvestmentNeeded: await ProvinceOpportunity.sum('minInvestment', { where: { status: 'PUBLISHED' } }) || 0,
      totalExpectedJobs: await ProvinceOpportunity.sum('expectedJobs', { where: { status: 'PUBLISHED' } }) || 0,
    };

    return NextResponse.json({
      provinces: provincesWithCounts,
      sectors: sectorCounts,
      featuredOpportunities,
      stats,
    });
  } catch (error) {
    console.error('Error fetching opportunities by province:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des donnees', details: error.message },
      { status: 500 }
    );
  }
}
