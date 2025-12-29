import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config.js';
import { User } from '../../models/index.js';

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

        const user = await User.findOne({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Identifiants invalides');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Identifiants invalides');
        }

        if (!user.isActive) {
          throw new Error('Compte désactivé');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
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
      }
      // Rafraîchir l'image depuis la base de données si la session est mise à jour
      if (trigger === 'update' && token.id) {
        const dbUser = await User.findByPk(token.id, {
          attributes: ['image', 'role', 'name'],
        });
        if (dbUser) {
          token.image = dbUser.image;
          token.role = dbUser.role;
          token.name = dbUser.name;
        }
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
