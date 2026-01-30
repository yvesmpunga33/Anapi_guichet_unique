import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id: ministryId } = await params;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

    // Proxy to backend dashboard endpoint
    const response = await fetch(`${apiUrl}/api/v1/referentiels/ministries/${ministryId}/dashboard`, {
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { success: false, message: errorData.message || 'Failed to fetch dashboard data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching ministry dashboard:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors du chargement du dashboard' },
      { status: 500 }
    );
  }
}
