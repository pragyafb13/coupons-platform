import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-300 mb-4">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <Link
            href="/coupons"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-900 px-6 py-3 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition"
          >
            <Search className="h-5 w-5" />
            Browse Coupons
          </Link>
        </div>
      </div>
    </div>
  );
}
