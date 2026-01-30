import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

// PUT - Update dossier status
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Get auth token
    const authHeader = request.headers.get('authorization');
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('authToken')?.value;
    const token = authHeader || (tokenFromCookie ? `Bearer ${tokenFromCookie}` : '');

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': token })
    };

    const response = await fetch(`${API_URL}/api/v1/guichet-unique/dossiers/${id}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erreur lors de la mise a jour du statut' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating dossier status:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
