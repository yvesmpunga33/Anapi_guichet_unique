import { NextResponse } from 'next/server';
import { ProvinceOpportunity, Province } from '../../../../models/index.js';
import { literal } from 'sequelize';

// GET - Statistiques publiques des opportunites par province
export async function GET() {
  try {
    // Get all provinces with opportunity statistics
    const provinces = await Province.findAll({
      attributes: [
        'id',
        'code',
        'name',
        'capital',
        [
          literal(`(
            SELECT COUNT(*) FROM "province_opportunities"
            WHERE "province_opportunities"."provinceId" = "Province"."id"
            AND "province_opportunities"."status" = 'PUBLISHED'
          )`),
          'opportunitiesCount'
        ],
        [
          literal(`(
            SELECT COALESCE(SUM("minInvestment"), 0) FROM "province_opportunities"
            WHERE "province_opportunities"."provinceId" = "Province"."id"
            AND "province_opportunities"."status" = 'PUBLISHED'
          )`),
          'totalMinInvestment'
        ],
        [
          literal(`(
            SELECT COALESCE(SUM("expectedJobs"), 0) FROM "province_opportunities"
            WHERE "province_opportunities"."provinceId" = "Province"."id"
            AND "province_opportunities"."status" = 'PUBLISHED'
          )`),
          'totalExpectedJobs'
        ],
      ],
      order: [['name', 'ASC']],
    });

    // Format response
    const formattedProvinces = provinces.map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,
      capital: p.capital,
      opportunitiesCount: parseInt(p.getDataValue('opportunitiesCount') || 0),
      totalMinInvestment: parseFloat(p.getDataValue('totalMinInvestment') || 0),
      totalExpectedJobs: parseInt(p.getDataValue('totalExpectedJobs') || 0),
    }));

    // Global stats
    const totalOpportunities = formattedProvinces.reduce((sum, p) => sum + p.opportunitiesCount, 0);
    const totalInvestment = formattedProvinces.reduce((sum, p) => sum + p.totalMinInvestment, 0);
    const totalJobs = formattedProvinces.reduce((sum, p) => sum + p.totalExpectedJobs, 0);

    return NextResponse.json({
      provinces: formattedProvinces,
      stats: {
        totalOpportunities,
        totalInvestment,
        totalJobs,
        totalProvinces: formattedProvinces.length,
      },
    });
  } catch (error) {
    console.error('Error fetching province stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des statistiques', details: error.message },
      { status: 500 }
    );
  }
}
