import { prisma } from '@/app/lib/prisma';
import axios from 'axios';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  //definer at prisma blir brukt som adapter
  adapter: PrismaAdapter(prisma),

  // henter inn secret for nextauth
  secret: process.env.SECRET,

  //endring av login side til å være selvlagd og ikke nextauth sinn innebygde
  pages: {
    signIn: '/login',
  },

  // definer at session skal bruke JWT token som strategy
  session: {
    strategy: 'jwt',
  },

  // definering av prover for login
  providers: [
    // google prover med client id og secret hentet inn fra .env fil
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? 'google client id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? 'google client secret',
    }),
  ],

  // definer callbacks til next auth og ka de gjør
  callbacks: {
    // callback når det blir sport for session data
    async session({ session }) {
      // henting av bruker data fra databasen
      const userData = await prisma.user.findFirst({
        where: {
          email: session.user?.email,
        },
      });

      // lag ny oppdatert session med data fra databasen
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          whitelisted: userData?.whitelisted,
          id: userData?.id,
        },
      };
      // retirnering av session
      return updatedSession;
    },

    // callback for når det blir spurt om token
    async jwt({ token, user, account, profile, isNewUser }) {
      // henta bruker data
      const userData = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      // lager en ny oppdatert token med mer data
      const updatedToken = {
        ...token,
        user: {
          whitelisted: userData?.whitelisted,
          id: userData?.id,
        },
      };
      //returnerer token
      return updatedToken;
    },
  },
};
export default authOptions;
