import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/v1/referentiels/countries`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Return fallback data
      return NextResponse.json({
        countries: [
          { id: 1, code: 'CD', name: 'RD Congo' },
          { id: 2, code: 'CG', name: 'Congo Brazzaville' },
          { id: 3, code: 'AO', name: 'Angola' },
          { id: 4, code: 'ZM', name: 'Zambie' },
          { id: 5, code: 'TZ', name: 'Tanzanie' },
          { id: 6, code: 'UG', name: 'Ouganda' },
          { id: 7, code: 'RW', name: 'Rwanda' },
          { id: 8, code: 'BI', name: 'Burundi' },
          { id: 9, code: 'CF', name: 'Centrafrique' },
          { id: 10, code: 'SS', name: 'Soudan du Sud' },
        ]
      });
    }

    const data = await response.json();
    return NextResponse.json({
      countries: data.data?.countries || data.countries || data.data || []
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json({
      countries: [
        { id: 1, code: 'CD', name: 'RD Congo' },
        { id: 2, code: 'CG', name: 'Congo Brazzaville' },
        { id: 3, code: 'AO', name: 'Angola' },
      ]
    });
  }
}
