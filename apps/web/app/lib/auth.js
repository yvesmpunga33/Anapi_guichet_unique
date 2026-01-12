import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from './auth.config.js';

// Détection dynamique de l'URL de l'API backend
const getApiUrl = () => {
  // Côté serveur: utiliser la variable d'environnement ou détecter
  if (typeof window === 'undefined') {
    // En production sur le serveur
    if (process.env.NODE_ENV === 'production') {
      return 'https://anapibackend.futurissvision.com';
    }
    // En développement local
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502';
  }

  // Côté client: détecter selon l'URL du navigateur
  const hostname = window.location.hostname;
  if (hostname === 'anapi.futurissvision.com') {
    return 'https://anapibackend.futurissvision.com';
  }
  // localhost ou autre
  return 'http://localhost:3502';
};

const API_URL = getApiUrl();

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        try {
          // Appeler l'API backend pour l'authentification
          const response = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message || 'Identifiants invalides');
          }

          const user = data.data.user;

          return {
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`,
            role: user.role,
            image: user.avatar || user.image,
            accessToken: data.data.token,
            refreshToken: data.data.refreshToken,
          };
        } catch (error) {
          if (error.message === 'Account is deactivated') {
            throw new Error('Compte désactivé');
          }
          throw new Error(error.message || 'Identifiants invalides');
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      // Rafraîchir les données utilisateur depuis l'API si la session est mise à jour
      if (trigger === 'update' && token.accessToken) {
        try {
          const response = await fetch(`${API_URL}/api/v1/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token.accessToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.user) {
              token.image = data.data.user.image || data.data.user.avatar;
              token.role = data.data.user.role;
              token.name = data.data.user.name || `${data.data.user.firstName} ${data.data.user.lastName}`;
            }
          }
        } catch {
          // Ignorer les erreurs de rafraîchissement
        }
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
