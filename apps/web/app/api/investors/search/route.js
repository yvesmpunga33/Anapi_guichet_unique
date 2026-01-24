import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const limit = searchParams.get('limit') || '50';

    // Get auth token from request headers or cookies
    const authHeader = request.headers.get('authorization');
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('authToken')?.value;
    const token = authHeader || (tokenFromCookie ? `Bearer ${tokenFromCookie}` : '');

    // Use the existing /investors endpoint with search parameter
    let url = `${API_URL}/api/v1/investors?limit=${limit}`;
    if (query) {
      url += `&search=${encodeURIComponent(query)}`;
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Investor search failed:', response.status, await response.text());
      // Return empty array if no results or API not available
      return NextResponse.json({
        investors: []
      });
    }

    const data = await response.json();
    return NextResponse.json({
      investors: data.data?.investors || data.investors || data.data || []
    });
  } catch (error) {
    console.error('Error searching investors:', error);
    return NextResponse.json({
      investors: []
    });
  }
}
