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

// GET - Get dossier documents
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const token = await getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorise' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/api/v1/guichet-unique/dossiers/${id}/documents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erreur lors de la recuperation des documents' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Upload document
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const token = await getAuthToken(request);

    console.log('[Document Upload] Starting upload for dossier:', id);
    console.log('[Document Upload] Token available:', !!token);

    if (!token) {
      console.log('[Document Upload] No token found, returning 401');
      return NextResponse.json(
        { error: 'Non autorise - Token manquant' },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();

    // Log FormData fields for debugging
    const fields = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fields.push(`${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        fields.push(`${key}: ${value}`);
      }
    }
    console.log('[Document Upload] FormData fields:', fields);

    // Forward the form data to the backend
    const backendUrl = `${API_URL}/api/v1/guichet-unique/dossiers/${id}/documents`;
    console.log('[Document Upload] Forwarding to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': token
        // Don't set Content-Type, let fetch set it with boundary for multipart
      },
      body: formData,
    });

    console.log('[Document Upload] Backend response status:', response.status);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log('[Document Upload] Non-JSON response:', text.substring(0, 200));
      data = { message: text || 'Erreur inconnue' };
    }

    if (!response.ok) {
      console.log('[Document Upload] Backend error:', data);
      return NextResponse.json(
        { error: data.message || 'Erreur lors de l\'upload du document' },
        { status: response.status }
      );
    }

    console.log('[Document Upload] Success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Document Upload] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
