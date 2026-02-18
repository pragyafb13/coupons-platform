import { handlers } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// Wrap handlers with timeout and error handling to prevent 401 errors and timeouts
async function handleRequest(
  handler: (req: NextRequest) => Promise<Response>,
  req: NextRequest
) {
  // Add a timeout to prevent hanging (Vercel has 10s timeout for Hobby plan)
  const timeout = 8000; // 8 seconds - leave some buffer
  
  const timeoutPromise = new Promise<Response>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timeout"));
    }, timeout);
  });

  try {
    // Race between the handler and timeout
    const response = await Promise.race([
      handler(req),
      timeoutPromise,
    ]);
    return response;
  } catch (error: any) {
    // If it's a timeout or database connection error, return a 200 with null session
    // This prevents 401 errors on the homepage
    if (
      error?.message?.includes("timeout") ||
      error?.message?.includes("database") ||
      error?.message?.includes("connection") ||
      error?.code === "P1001" ||
      error?.code === "P1017" ||
      error?.message?.includes("MaxClientsInSessionMode")
    ) {
      console.warn("Auth request failed or timed out, returning null session:", error.message);
      // For session endpoint, return null session instead of error
      if (req.nextUrl.pathname.includes("/session")) {
        return NextResponse.json({ user: null }, { status: 200 });
      }
      // For other endpoints, return a 200 OK to prevent 401
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 200 });
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
