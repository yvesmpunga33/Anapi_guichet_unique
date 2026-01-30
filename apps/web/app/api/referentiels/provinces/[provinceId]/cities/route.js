import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

export async function GET(request, { params }) {
  try {
    const { provinceId } = await params;

    const response = await fetch(`${API_URL}/api/v1/referentiels/provinces/${provinceId}/cities`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Return fallback data
      return NextResponse.json({
        cities: [
          { id: 1, name: 'Kinshasa', provinceId: 1 },
          { id: 2, name: 'Lubumbashi', provinceId: 26 },
          { id: 3, name: 'Goma', provinceId: 13 },
          { id: 4, name: 'Bukavu', provinceId: 12 },
          { id: 5, name: 'Matadi', provinceId: 2 },
        ]
      });
    }

    const data = await response.json();
    return NextResponse.json({
      cities: data.data?.cities || data.cities || data.data || []
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({
      cities: [
        { id: 1, name: 'Kinshasa', provinceId: 1 },
        { id: 2, name: 'Lubumbashi', provinceId: 26 },
      ]
    });
  }
}
