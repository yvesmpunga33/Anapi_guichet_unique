import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

export async function GET(request, { params }) {
  try {
    const { cityId } = await params;

    const response = await fetch(`${API_URL}/api/v1/referentiels/cities/${cityId}/communes`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Return fallback communes for Kinshasa
      return NextResponse.json({
        communes: [
          { id: 1, name: 'Gombe', cityId: 1 },
          { id: 2, name: 'Lingwala', cityId: 1 },
          { id: 3, name: 'Barumbu', cityId: 1 },
          { id: 4, name: 'Kinshasa', cityId: 1 },
          { id: 5, name: 'Kintambo', cityId: 1 },
          { id: 6, name: 'Ngaliema', cityId: 1 },
          { id: 7, name: 'Mont Ngafula', cityId: 1 },
          { id: 8, name: 'Selembao', cityId: 1 },
          { id: 9, name: 'Bumbu', cityId: 1 },
          { id: 10, name: 'Makala', cityId: 1 },
          { id: 11, name: 'Ngiri-Ngiri', cityId: 1 },
          { id: 12, name: 'Kalamu', cityId: 1 },
          { id: 13, name: 'Bandalungwa', cityId: 1 },
          { id: 14, name: 'Kasa-Vubu', cityId: 1 },
          { id: 15, name: 'Ngaba', cityId: 1 },
          { id: 16, name: 'Lemba', cityId: 1 },
          { id: 17, name: 'Limete', cityId: 1 },
          { id: 18, name: 'Matete', cityId: 1 },
          { id: 19, name: 'Ndjili', cityId: 1 },
          { id: 20, name: 'Kimbanseke', cityId: 1 },
          { id: 21, name: 'Masina', cityId: 1 },
          { id: 22, name: 'Nsele', cityId: 1 },
          { id: 23, name: 'Maluku', cityId: 1 },
          { id: 24, name: 'Kisenso', cityId: 1 },
        ]
      });
    }

    const data = await response.json();
    return NextResponse.json({
      communes: data.data?.communes || data.communes || data.data || []
    });
  } catch (error) {
    console.error('Error fetching communes:', error);
    return NextResponse.json({
      communes: [
        { id: 1, name: 'Gombe', cityId: 1 },
        { id: 2, name: 'Lingwala', cityId: 1 },
        { id: 3, name: 'Barumbu', cityId: 1 },
      ]
    });
  }
}
