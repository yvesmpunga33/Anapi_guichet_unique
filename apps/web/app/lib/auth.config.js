// Configuration NextAuth pour le Edge Runtime (middleware)
// Ne contient PAS d'accès à la base de données (Sequelize)
// Détection automatique de l'environnement (local vs production)

const isProduction = process.env.NODE_ENV === 'production';

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
  cookies: {
    sessionToken: {
      name: isProduction ? '__Secure-authjs.session-token' : 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnHR = nextUrl.pathname.startsWith('/hr');
      const isOnGuichet = nextUrl.pathname.startsWith('/guichet-unique');
      const isOnMinistry = nextUrl.pathname.startsWith('/ministry-portal');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnInvestments = nextUrl.pathname.startsWith('/investments');
      const isOnJuridique = nextUrl.pathname.startsWith('/juridique');
      const isProtectedRoute = isOnDashboard || isOnHR || isOnGuichet || isOnMinistry || isOnAdmin || isOnInvestments || isOnJuridique;

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
