import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { getConfigFromRequest } from '@/app/lib/config';

// GET - Download a document
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, docId } = await params;
    const { apiUrl } = getConfigFromRequest(request);

    const response = await fetch(`${apiUrl}/api/v1/investments/${id}/documents/${docId}/download`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Failed to download document' },
        { status: response.status }
      );
    }

    // Get the file content and headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('content-disposition') || '';
    const buffer = await response.arrayBuffer();

    // Return the file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
