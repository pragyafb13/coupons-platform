import { NextResponse } from "next/server";

export async function GET() {
  // Check environment variables (without exposing secrets)
  const envCheck = {
    hasAUTH_SECRET: !!process.env.AUTH_SECRET,
    hasNEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    hasGITHUB_ID: !!process.env.GITHUB_ID,
    hasGITHUB_SECRET: !!process.env.GITHUB_SECRET,
    hasNEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    hasDATABASE_URL: !!process.env.DATABASE_URL,
    GITHUB_ID_value: process.env.GITHUB_ID ? `${process.env.GITHUB_ID.substring(0, 10)}...` : "NOT SET",
    AUTH_SECRET_length: (process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "").length,
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json(envCheck, { status: 200 });
}
