import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

async function getAuthToken(request) {
  // Try authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    return authHeader;
  }

  // Fallback to cookie
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get('authToken')?.value;
  if (tokenFromCookie) {
    return `Bearer ${tokenFromCookie}`;
  }

  return null;
}

// DELETE - Delete document
export async function DELETE(request, { params }) {
  try {
    const { id, documentId } = await params;
    const token = await getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorise' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/api/v1/guichet-unique/dossiers/${id}/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erreur lors de la suppression du document' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Validate document
export async function POST(request, { params }) {
  try {
    const { id, documentId } = await params;
    const token = await getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorise' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_URL}/api/v1/guichet-unique/dossiers/${id}/documents/${documentId}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erreur lors de la validation du document' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error validating document:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
