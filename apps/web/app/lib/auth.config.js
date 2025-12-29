// Configuration NextAuth pour le Edge Runtime (middleware)
// Ne contient PAS d'accès à la base de données (Sequelize)

/** @type {import('next-auth').NextAuthConfig} */
export const authConfig = {
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
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
      }
      return session;
    },
  },
  providers: [], // Les providers sont ajoutés dans auth.js
};
