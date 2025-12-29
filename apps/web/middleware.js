import NextAuth from 'next-auth';
import { authConfig } from './app/lib/auth.config.js';

// Créer auth pour le Edge Runtime (sans accès DB)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Routes publiques
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Routes d'authentification (login/register)
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // Si sur la page d'accueil, rediriger
  if (pathname === '/') {
    if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', req.url));
    } else {
      return Response.redirect(new URL('/login', req.url));
    }
  }

  // Si connecté et sur page auth, rediriger vers dashboard
  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL('/dashboard', req.url));
  }

  // Si route protégée et non connecté, rediriger vers login
  if (!isPublicRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(loginUrl);
  }

  // Continuer normalement
  return;
});

// Configuration des routes à protéger
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api (toutes les routes API - gérées par leur propre auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
