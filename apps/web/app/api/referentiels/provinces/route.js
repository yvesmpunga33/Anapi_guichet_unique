import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('countryId');

    let url = `${API_URL}/api/v1/referentiels/provinces`;
    if (countryId) {
      url += `?countryId=${countryId}`;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Return fallback data for RDC provinces
      return NextResponse.json({
        provinces: [
          { id: 1, name: 'Kinshasa', code: 'KIN' },
          { id: 2, name: 'Kongo Central', code: 'KC' },
          { id: 3, name: 'Kwango', code: 'KWG' },
          { id: 4, name: 'Kwilu', code: 'KWL' },
          { id: 5, name: 'Mai-Ndombe', code: 'MND' },
          { id: 6, name: 'Kasaï', code: 'KAS' },
          { id: 7, name: 'Kasaï Central', code: 'KSC' },
          { id: 8, name: 'Kasaï Oriental', code: 'KSO' },
          { id: 9, name: 'Lomami', code: 'LOM' },
          { id: 10, name: 'Sankuru', code: 'SAN' },
          { id: 11, name: 'Maniema', code: 'MAN' },
          { id: 12, name: 'Sud-Kivu', code: 'SK' },
          { id: 13, name: 'Nord-Kivu', code: 'NK' },
          { id: 14, name: 'Ituri', code: 'ITU' },
          { id: 15, name: 'Haut-Uele', code: 'HUE' },
          { id: 16, name: 'Tshopo', code: 'TSH' },
          { id: 17, name: 'Bas-Uele', code: 'BUE' },
          { id: 18, name: 'Nord-Ubangi', code: 'NUB' },
          { id: 19, name: 'Mongala', code: 'MON' },
          { id: 20, name: 'Sud-Ubangi', code: 'SUB' },
          { id: 21, name: 'Équateur', code: 'EQU' },
          { id: 22, name: 'Tshuapa', code: 'TSP' },
          { id: 23, name: 'Tanganyika', code: 'TAN' },
          { id: 24, name: 'Haut-Lomami', code: 'HLO' },
          { id: 25, name: 'Lualaba', code: 'LUA' },
          { id: 26, name: 'Haut-Katanga', code: 'HKA' },
        ]
      });
    }

    const data = await response.json();
    return NextResponse.json({
      provinces: data.data?.provinces || data.provinces || data.data || []
    });
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return NextResponse.json({
      provinces: [
        { id: 1, name: 'Kinshasa', code: 'KIN' },
        { id: 2, name: 'Kongo Central', code: 'KC' },
        { id: 13, name: 'Nord-Kivu', code: 'NK' },
        { id: 12, name: 'Sud-Kivu', code: 'SK' },
        { id: 26, name: 'Haut-Katanga', code: 'HKA' },
      ]
    });
  }
}
