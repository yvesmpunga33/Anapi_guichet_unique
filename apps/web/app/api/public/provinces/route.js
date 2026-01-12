import { NextResponse } from 'next/server';
import sequelize from '../../../lib/sequelize.js';
import { QueryTypes } from 'sequelize';

// GET - Statistiques publiques des opportunites par province
// Utilise l'API backend + requete directe pour les opportunites
export async function GET() {
  try {
    // Determiner l'URL de l'API backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

    // Appeler l'API backend pour obtenir les provinces
    const response = await fetch(`${backendUrl}/api/v1/provinces`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    // Les donnees viennent du backend: { success: true, data: { provinces: [...] } }
    const provinces = data.data?.provinces || data.provinces || data.data || [];

    // Obtenir les stats des province_opportunities directement depuis la base
    let opportunityStats = [];
    try {
      opportunityStats = await sequelize.query(`
        SELECT
          "provinceId"::text as "provinceId",
          COUNT(*) as "opportunitiesCount",
          COALESCE(SUM("minInvestment"), 0) as "totalMinInvestment",
          COALESCE(SUM("expectedJobs"), 0) as "totalExpectedJobs"
        FROM province_opportunities
        WHERE status = 'PUBLISHED'
        GROUP BY "provinceId"
      `, { type: QueryTypes.SELECT });
    } catch (dbError) {
      console.error('Error fetching opportunity stats:', dbError.message);
    }

    // Creer un map pour acces rapide
    const statsMap = {};
    opportunityStats.forEach(stat => {
      statsMap[stat.provinceId] = {
        opportunitiesCount: parseInt(stat.opportunitiesCount) || 0,
        totalMinInvestment: parseFloat(stat.totalMinInvestment) || 0,
        totalExpectedJobs: parseInt(stat.totalExpectedJobs) || 0,
      };
    });

    // Formater la reponse avec les stats des opportunites
    const formattedProvinces = provinces.map(p => {
      const stats = statsMap[p.id] || {};
      return {
        id: p.id,
        code: p.code,
        name: p.name,
        capital: p.capital,
        opportunitiesCount: stats.opportunitiesCount || 0,
        totalMinInvestment: stats.totalMinInvestment || 0,
        totalExpectedJobs: stats.totalExpectedJobs || 0,
      };
    });

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
