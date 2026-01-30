import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

async function getAuthToken(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    return authHeader;
  }

  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get('authToken')?.value;
  if (tokenFromCookie) {
    return `Bearer ${tokenFromCookie}`;
  }

  // Try to get token from query string (for iframe support)
  const url = new URL(request.url);
  const tokenFromQuery = url.searchParams.get('token');
  if (tokenFromQuery) {
    return `Bearer ${tokenFromQuery}`;
  }

  return null;
}

// GET - View document inline
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const token = await getAuthToken(request);

    // Call the backend endpoint that finds document by ID only
    const fileResponse = await fetch(`${API_URL}/api/v1/guichet-unique/documents/${id}/view`, {
      headers: {
        ...(token && { 'Authorization': token })
      }
    });

    if (!fileResponse.ok) {
      console.error('[Document View] Backend error:', fileResponse.status);
      return NextResponse.json(
        { error: 'Document not found' },
        { status: fileResponse.status }
      );
    }

    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = fileResponse.headers.get('content-disposition');
    const arrayBuffer = await fileResponse.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition || 'inline',
      }
    });
  } catch (error) {
    console.error('[Document View] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
