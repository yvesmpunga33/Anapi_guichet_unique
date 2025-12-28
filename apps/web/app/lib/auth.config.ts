import type { NextAuthConfig } from 'next-auth';

// Configuration NextAuth pour le Edge Runtime (middleware)
// Ne contient PAS d'accès à la base de données (Sequelize)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnHR = nextUrl.pathname.startsWith('/hr');
      const isOnGuichet = nextUrl.pathname.startsWith('/guichet-unique');
      const isOnMinistry = nextUrl.pathname.startsWith('/ministry-portal');
      const isProtectedRoute = isOnDashboard || isOnHR || isOnGuichet || isOnMinistry;

      const isAuthRoute = nextUrl.pathname === '/login' || nextUrl.pathname === '/register';

      // Rediriger vers dashboard si déjà connecté et sur page auth
      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // Protéger les routes
      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.image = user.image;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  providers: [], // Les providers sont ajoutés dans auth.ts
};
