import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const url = `${API_URL}/api/v1/referentiels/sectors${isActive ? `?isActive=${isActive}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Return fallback data if backend fails
      return NextResponse.json({
        sectors: [
          { id: 1, name: 'Agriculture et elevage' },
          { id: 2, name: 'Mines et extraction' },
          { id: 3, name: 'Industries manufacturieres' },
          { id: 4, name: 'BTP et construction' },
          { id: 5, name: 'Commerce et distribution' },
          { id: 6, name: 'Transport et logistique' },
          { id: 7, name: 'Technologies de l\'information' },
          { id: 8, name: 'Tourisme et hotellerie' },
          { id: 9, name: 'Services financiers' },
          { id: 10, name: 'Energie et utilities' },
          { id: 11, name: 'Sante et pharmacie' },
          { id: 12, name: 'Education et formation' },
        ]
      });
    }

    const data = await response.json();
    return NextResponse.json({
      sectors: data.data?.sectors || data.sectors || data.data || []
    });
  } catch (error) {
    console.error('Error fetching sectors:', error);
    // Return fallback data on error
    return NextResponse.json({
      sectors: [
        { id: 1, name: 'Agriculture et elevage' },
        { id: 2, name: 'Mines et extraction' },
        { id: 3, name: 'Industries manufacturieres' },
        { id: 4, name: 'BTP et construction' },
        { id: 5, name: 'Commerce et distribution' },
        { id: 6, name: 'Transport et logistique' },
        { id: 7, name: 'Technologies de l\'information' },
        { id: 8, name: 'Tourisme et hotellerie' },
      ]
    });
  }
}
