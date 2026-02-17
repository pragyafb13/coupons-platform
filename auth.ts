import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Validate required environment variables
const AUTH_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || process.env.AUTH_URL;

// Log environment variable status for debugging
if (process.env.NODE_ENV === "development") {
  console.log("🔐 Auth Configuration Check:", {
    hasAUTH_SECRET: !!AUTH_SECRET,
    hasNEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    hasGITHUB_ID: !!GITHUB_ID,
    hasGITHUB_SECRET: !!GITHUB_SECRET,
    hasNEXTAUTH_URL: !!NEXTAUTH_URL,
    GITHUB_ID_length: GITHUB_ID?.length || 0,
    AUTH_SECRET_length: AUTH_SECRET?.length || 0,
  });
}

// Validate required variables - throw errors only if truly missing
const missingVars: string[] = [];
if (!AUTH_SECRET) {
  missingVars.push("AUTH_SECRET or NEXTAUTH_SECRET");
}
if (!GITHUB_ID) {
  missingVars.push("GITHUB_ID");
}
if (!GITHUB_SECRET) {
  missingVars.push("GITHUB_SECRET");
}

// Log missing variables but don't throw - let NextAuth handle it
if (missingVars.length > 0) {
  const errorMessage = `❌ Missing required environment variables: ${missingVars.join(", ")}. Please set them in your Vercel environment variables and redeploy.`;
  console.error(errorMessage);
}

// Only initialize NextAuth if we have the minimum required config
// This prevents "Configuration" errors from NextAuth
const hasMinimumConfig = !!(AUTH_SECRET && GITHUB_ID && GITHUB_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use the PrismaAdapter from the same NextAuth package for compatibility
  // See: https://next-auth.js.org/adapters/prisma
  adapter: hasMinimumConfig ? (PrismaAdapter(prisma) as any) : undefined,

  secret: AUTH_SECRET || "temp-secret-change-in-production",
  
  trustHost: true, // Required for Vercel deployments

  providers: hasMinimumConfig ? [
    GitHub({
      clientId: GITHUB_ID!,
      clientSecret: GITHUB_SECRET!,
    }),
  ] : [
    // If config is missing, NextAuth will show a Configuration error
    // This is expected - the user needs to set environment variables in Vercel
    GitHub({
      clientId: GITHUB_ID || "",
      clientSecret: GITHUB_SECRET || "",
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
