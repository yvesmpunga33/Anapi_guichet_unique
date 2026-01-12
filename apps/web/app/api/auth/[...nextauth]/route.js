import { handlers } from '../../../lib/auth.js';
import {
  getClientIP,
  canAttemptLogin,
  recordFailedAttempt,
  resetRateLimit,
} from '../../../lib/rate-limit.js';
import { NextResponse } from 'next/server';

// Wrapper pour le handler POST avec rate limiting
async function rateLimitedPOST(request) {
  const ip = getClientIP(request);

  // Vérifier si c'est une tentative de login (credentials)
  const url = new URL(request.url);
  const isCredentialsCallback =
    url.pathname.includes('callback/credentials') ||
    url.searchParams.get('callbackUrl');

  if (isCredentialsCallback) {
    // Cloner la requête pour lire le body
    const clonedRequest = request.clone();

    try {
      const body = await clonedRequest.json().catch(() => ({}));
      const email = body.email || body.csrfToken ? null : body.email;

      // Vérifier le rate limit
      const loginCheck = canAttemptLogin(ip, email);

      if (!loginCheck.allowed) {
        return NextResponse.json(
          {
            error: 'RateLimitExceeded',
            message: loginCheck.message,
            retryAfter: loginCheck.retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(loginCheck.retryAfter),
            },
          }
        );
      }
    } catch {
      // Si on ne peut pas parser le body, on continue quand même
    }
  }

  // Appeler le handler original
  const response = await handlers.POST(request);

  // Si c'est un login échoué, enregistrer la tentative
  if (isCredentialsCallback && response.status === 401) {
    const clonedRequest = request.clone();
    try {
      const body = await clonedRequest.json().catch(() => ({}));
      recordFailedAttempt(ip, body.email);
    } catch {
      recordFailedAttempt(ip, null);
    }
  }

  // Si login réussi, réinitialiser le compteur
  if (isCredentialsCallback && response.status === 200) {
    resetRateLimit(ip, 'login');
  }

  return response;
}

export const GET = handlers.GET;
export const POST = rateLimitedPOST;
