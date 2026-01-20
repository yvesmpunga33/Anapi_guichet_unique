import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Connect to backend API to get real stats
    // For now, return empty stats to prevent errors
    const stats = {
      totalInvestments: 0,
      totalInvestors: 0,
      totalProjects: 0,
      activeProjects: 0,
      pendingApprovals: 0,
      totalValue: {
        USD: 0,
        EUR: 0,
        CDF: 0
      },
      recentProjects: [],
      recentInvestors: [],
      sectorDistribution: [],
      monthlyInvestments: [],
      topRisks: []
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
