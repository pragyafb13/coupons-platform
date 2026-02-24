export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { Heart, Clock, Tag, Zap } from "lucide-react";

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
              Start saving coupons you like! Click the heart icon on any coupon to add it here.
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
            {saved.map((item) => {
              const discountMatch = item.coupon.title.match(/\d+%/);
              const discount = discountMatch ? discountMatch[0] : null;

              return (
                <Link
                  key={item.id}
                  href={`/coupons/${item.coupon.id}`}
                  className="group bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                >
                  {discount && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-extrabold px-4 py-2 rounded-xl shadow-lg z-10 flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      {discount} OFF
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4 pr-20">
                    {item.coupon.store?.logo ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 p-2 flex-shrink-0">
                        <Image
                          src={item.coupon.store.logo}
                          alt={item.coupon.store.name}
                          width={64}
                          height={64}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="font-extrabold text-gray-800 text-lg">
                          {item.coupon.store?.name?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                    <h4 className="font-bold text-gray-900 text-sm">{item.coupon.store?.name || "Unknown"}</h4>
                  </div>

                  <h3 className="text-lg font-extrabold mb-4 group-hover:text-red-600 transition line-clamp-2 text-gray-900 leading-tight">
                    {item.coupon.title}
                  </h3>

                  {item.coupon.code ? (
                    <div className="border-2 border-dashed border-yellow-500 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl py-3 text-center font-mono text-base mb-4 text-gray-900 font-extrabold tracking-wider">
                      {item.coupon.code}
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-xl py-3 text-center text-sm font-semibold text-gray-600 mb-4">
                      Deal Only
                    </div>
                  )}

                  {item.coupon.expiryDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4" />
                      <span>Expires {new Date(item.coupon.expiryDate).toLocaleDateString("en-US")}</span>
                    </div>
                  )}

                  <div className="text-center py-3 rounded-xl font-bold bg-gradient-to-r from-gray-900 to-black text-white group-hover:from-red-500 group-hover:to-red-600 transition">
                    View Deal →
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
