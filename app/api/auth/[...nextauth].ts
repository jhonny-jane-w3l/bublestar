import fs from 'fs';
import path from 'path';
import NextAuth, { NextAuthOptions, User, Account, Profile, Session } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from '@prisma/client';
import { JWT } from 'next-auth/jwt';
import {writeLogToFile} from '@/lib/utils';


// Initialiser Prisma
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Définir un type pour le JWT avec les propriétés ajoutées
type CustomJWT = JWT & {
  userId?: string;
  accessToken?: string;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

// Définir un type pour les sessions personnalisées
type CustomSession = Session & {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken?: string;
};

const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async jwt({ token, user, account }: { token: CustomJWT; user?: User; account?: Account | null }) {
      writeLogToFile(`JWT Callback (before): Token: ${JSON.stringify(token)}, User: ${JSON.stringify(user)}, Account: ${JSON.stringify(account)}`);
      
      // Ajouter les données utilisateur au token JWT
      if (account) {
        token.accessToken = account.access_token;
        token.userId = user?.id;
      }

      // Ajouter les données utilisateur si elles ne sont pas encore dans le toke

      writeLogToFile(`JWT Callback (after): Token: ${JSON.stringify(token)}`);
      return token;
    },

    async session({ session, token }: { session: CustomSession; token: CustomJWT }) {
      writeLogToFile(`Session Callback (before): Session: ${JSON.stringify(session)}, Token: ${JSON.stringify(token)}`);
      
      // S'assurer que le token et les données utilisateur sont présents
      if (token && token.accessToken && token.user) {
        session.accessToken = token.accessToken;
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          image: token.user.image,
        };
      } else {
        writeLogToFile(`Erreur: Token ou données utilisateur manquantes.`);
      }

      writeLogToFile(`Session Callback (after): Session: ${JSON.stringify(session)}`);
      return session;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      const redirectUrl = process.env.NEXTAUTH_URL || baseUrl;
      writeLogToFile(`Redirect Callback: URL: ${url}, Base URL: ${baseUrl}, Redirect URL: ${redirectUrl}`);
      
      // Condition pour éviter la redirection infinie
      if (url === `${baseUrl}/sign/signIn`) {
        return `${baseUrl}/`; // Redirige vers la page d'accueil
      }

      // Si l'URL commence par baseUrl, redirigez vers cette URL
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  }
};

export default NextAuth(options);
