import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Get auth token from request headers or cookies
    const authHeader = request.headers.get('authorization');
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('authToken')?.value;
    const token = authHeader || (tokenFromCookie ? `Bearer ${tokenFromCookie}` : '');

    const headers = {};
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_URL}/api/v1/guichet-unique/dossiers/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      // Format error message properly
      const errorMessage = typeof errorData.error === 'string'
        ? errorData.error
        : errorData.message || 'Erreur lors de la soumission';
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading dossier:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la soumission du dossier' },
      { status: 500 }
    );
  }
}
