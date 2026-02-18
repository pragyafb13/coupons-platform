"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Github, AlertCircle } from "lucide-react";

function LoginForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for error in URL params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(
        errorParam === "Configuration"
          ? "Authentication is not properly configured. Please check environment variables."
          : "An error occurred during login. Please try again."
      );
    }
  }, [searchParams]);

  // Auto redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient opacity-40 blur-3xl" />

      {/* Glow Circles */}
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-[-100px] right-[-100px] w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-30" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 text-center transition-all duration-500 hover:scale-[1.02]">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            Coupons Admin
          </h1>

          <p className="text-gray-300 mb-10 text-sm">
            Secure access to your dashboard
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-red-400 font-semibold text-sm mb-1">Login Error</p>
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              signIn("github", { 
                callbackUrl: "/admin",
                redirect: true,
              });
            }}
            disabled={isLoading}
            className="group w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-2xl transition-all duration-300 hover:bg-gray-200 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Github size={20} />
                Continue with GitHub
              </>
            )}
          </button>

          <p className="text-gray-400 text-xs mt-8">
            Only authorized administrators can log in
          </p>
        </div>
      </div>

      {/* Animation Style */}
      <style jsx global>{`
        @keyframes gradientMove {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .animate-gradient {
          animation: gradientMove 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
