import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Flame, Clock, CheckCircle2, Zap, Sparkles } from "lucide-react";

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({
    where: { 
      status: "ACTIVE",
      isActive: true,
    },
    include: { 
      store: true,
    },
    orderBy: [
      { isVerified: "desc" },
      { createdAt: "desc" }
    ],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Header Section */}
      <section className="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <Flame className="h-5 w-5" />
              <span className="text-sm font-semibold">Hot Deals</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
              All Active Coupons
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Discover {coupons.length}+ verified coupons and promo codes from top stores
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {coupons.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-premium border-2 border-gray-200 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Flame className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-xl mb-6">No active coupons available at the moment.</p>
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
            >
              Browse stores
              <span className="text-xl">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {coupons.map((coupon) => {
              const discountMatch = coupon.title.match(/\d+%/);
              const discount = discountMatch ? discountMatch[0] : null;

              return (
                <Link
                  key={coupon.id}
                  href={`/coupons/${coupon.id}`}
                  className="group bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Premium Discount Badge */}
                  {discount && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-extrabold px-4 py-2 rounded-xl shadow-lg z-10 flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      {discount} OFF
                    </div>
                  )}

                  {/* Verified Badge */}
                  {coupon.isVerified && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 z-10 shadow-lg">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </div>
                  )}

                  {/* Store Logo/Name */}
                  <div className="flex items-center gap-4 mb-6 pr-24">
                    {coupon.store.logo ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 p-2 flex-shrink-0">
                        <Image
                          src={coupon.store.logo}
                          alt={coupon.store.name}
                          width={80}
                          height={80}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="font-extrabold text-gray-700 text-xl">
                          {coupon.store.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{coupon.store.name}</h4>
                    </div>
                  </div>

                  {/* Coupon Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold mb-4 group-hover:text-red-500 transition line-clamp-2 min-h-[3.5rem] text-gray-900">
                    {coupon.title}
                  </h3>

                  {/* Coupon Code */}
                  {coupon.code && (
                    <div className="border-2 border-dashed border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl py-4 text-center font-mono text-lg sm:text-xl mb-6 text-gray-900 font-extrabold tracking-wider shadow-inner">
                      {coupon.code}
                    </div>
                  )}

                  {/* Expiry Date */}
                  {coupon.expiryDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 bg-gray-50 rounded-lg px-3 py-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Expires {new Date(coupon.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  )}

                  {/* Premium CTA Button */}
                  <div className="bg-gradient-to-r from-gray-900 to-black text-white text-center py-4 rounded-xl font-bold text-base sm:text-lg group-hover:from-red-500 group-hover:to-red-600 transition shadow-lg">
                    Get Deal →
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
