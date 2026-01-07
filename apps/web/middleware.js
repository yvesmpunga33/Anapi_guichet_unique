import NextAuth from 'next-auth';
import { authConfig } from './app/lib/auth.config.js';

// Créer auth pour le Edge Runtime (sans accès DB)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Routes publiques (incluant la landing page et la page investir)
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/investir'];
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || (route !== '/' && pathname.startsWith(route))
  );

  // Routes d'authentification (login/register)
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // La page d'accueil (landing page) est publique - ne pas rediriger
  if (pathname === '/') {
    return; // Laisser la landing page s'afficher
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
     * - images (images publiques)
     * - data (GeoJSON and static data files)
     * - api (toutes les routes API - gérées par leur propre auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images|data|api).*)',
  ],
};
