import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { User } from '../../models';

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
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error('Identifiants invalides');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
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
        token.role = (user as any).role;
        token.image = user.image;
      }
      // Rafraîchir l'image depuis la base de données si la session est mise à jour
      if (trigger === 'update' && token.id) {
        const dbUser = await User.findByPk(token.id as string, {
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

// Types étendus pour TypeScript
declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    image?: string | null;
  }
}
