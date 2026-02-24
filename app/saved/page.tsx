export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { Heart } from "lucide-react";
import SavedCouponCard from "./SavedCouponCard";

export default async function SavedPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                <Heart className="h-5 w-5" />
                <span className="text-sm font-semibold">Saved Coupons</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Please Login</h1>
              <p className="text-lg text-white/90 max-w-xl mx-auto">
                Sign in to view and manage your saved coupons
              </p>
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-premium border-2 border-gray-200 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your saved coupons.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:from-pink-600 hover:to-rose-700 transition shadow-lg"
            >
              Login
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let saved: Array<{
    id: string;
    coupon: {
      id: string;
      title: string;
      code: string | null;
      expiryDate: Date | null;
      store: { id: string; name: string; logo: string | null } | null;
    };
  }> = [];

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
      saved = await prisma.savedCoupon.findMany({
        where: { userId: user.id },
        include: {
          coupon: {
            include: { store: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (error) {
    console.error("Error fetching saved coupons:", error);
    saved = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-semibold">Your Collection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
              Saved Coupons
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              {saved.length} {saved.length === 1 ? "coupon" : "coupons"} saved for later
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {saved.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-premium border-2 border-gray-200 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Saved Coupons Yet</h2>
            <p className="text-gray-600 mb-6">
              Start saving coupons you like! Click the heart on any coupon to save. Click it again to unsave.
            </p>
            <Link
              href="/coupons"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:from-pink-600 hover:to-rose-700 transition shadow-lg"
            >
              Browse Coupons
              <span className="text-xl">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {saved.map((item) => (
              <SavedCouponCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
