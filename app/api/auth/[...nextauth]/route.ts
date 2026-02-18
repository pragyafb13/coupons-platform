import { handlers } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// Wrap handlers with error handling to prevent 401 errors when DB is unavailable
async function handleRequest(
  handler: (req: NextRequest) => Promise<Response>,
  req: NextRequest
) {
  try {
    return await handler(req);
  } catch (error: any) {
    // If it's a database connection error, return a 200 with null session
    // This prevents 401 errors on the homepage
    if (
      error?.message?.includes("database") ||
      error?.message?.includes("connection") ||
      error?.code === "P1001" ||
      error?.code === "P1017" ||
      error?.message?.includes("MaxClientsInSessionMode")
    ) {
      console.warn("Database unavailable for auth check, returning null session:", error.message);
      // For session endpoint, return null session instead of error
      if (req.nextUrl.pathname.includes("/session")) {
        return NextResponse.json({ user: null }, { status: 200 });
      }
    }
    // Re-throw other errors
    throw error;
  }
}

export async function GET(req: NextRequest) {
  return handleRequest(handlers.GET, req);
}

export async function POST(req: NextRequest) {
  return handleRequest(handlers.POST, req);
}
