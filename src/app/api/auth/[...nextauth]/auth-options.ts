import { prisma } from "@/app/lib/prisma";
import axios from "axios";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "google client id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "google client secret",
    }),
  ],
  callbacks: {
    async session({ session }) {
      const userData = await prisma.user.findFirst({
        where: {
          email: session.user?.email,
        },
      });
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          whitelisted: userData?.whitelisted,
          id: userData?.id,
        },
      };

      return updatedSession;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      const userData = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });
      const updatedToken = {
        ...token,
        user: {
          whitelisted: userData?.whitelisted,
          id: userData?.id,
        },
      };

      return updatedToken;
    },
  },
};
export default authOptions;
