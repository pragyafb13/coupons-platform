import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use the PrismaAdapter from the same NextAuth package for compatibility
  // See: https://next-auth.js.org/adapters/prisma
  adapter: PrismaAdapter(prisma) as any, // `as any` is a workaround for type mismatch issues

  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  
  trustHost: true, // Required for Vercel deployments

  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = (user as any).role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow all GitHub users to sign in
      // You can add role assignment logic here if needed
      return true;
    },
  },
});
