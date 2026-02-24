export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Store as StoreIcon, Star, ArrowLeft, Clock, Zap, CheckCircle2 } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function StoreDetailPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) return notFound();

  let store;
  try {
    store = await prisma.store.findUnique({
      where: { slug },
      include: {
        coupons: {
          where: {
            status: "ACTIVE",
            isActive: true,
          },
          orderBy: [
            { isVerified: "desc" },
            { createdAt: "desc" },
          ],
        },
      },
    });
  } catch (error) {
    console.error("Error fetching store:", error);
    return notFound();
  }

  if (!store) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 font-medium transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Stores
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            {store.logo ? (
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center flex-shrink-0">
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={128}
                  height={128}
                  className="object-contain max-h-full"
                />
              </div>
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0">
                <StoreIcon className="h-16 w-16 sm:h-20 sm:w-20" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {store.isFeatured && (
                  <span className="inline-flex items-center gap-1 bg-yellow-400/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">{store.name}</h1>
              {store.description && (
                <p className="text-white/90 text-lg max-w-2xl mb-4">{store.description}</p>
              )}
              <div className="flex flex-wrap gap-4">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-semibold">
                  {store.coupons.length} {store.coupons.length === 1 ? "Coupon" : "Coupons"}
                </span>
                {store.affiliateUrl && (
                  <a
                    href={store.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-white/90 transition"
                  >
                    Visit Store →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Available Coupons
          </h2>
          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            {store.coupons.length} {store.coupons.length === 1 ? "deal" : "deals"}
          </span>
        </div>

        {store.coupons.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-premium border-2 border-gray-200 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Zap className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Coupons</h3>
            <p className="text-gray-600 mb-6">No active coupons available for this store at the moment.</p>
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg"
            >
              Browse Other Stores
              <span className="text-xl">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {store.coupons.map((coupon) => {
              const discountMatch = coupon.title.match(/\d+%/);
              const discount = discountMatch ? discountMatch[0] : null;

              return (
                <Link
                  key={coupon.id}
                  href={`/coupons/${coupon.id}`}
                  className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                >
                  {discount && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-extrabold px-4 py-2 rounded-xl shadow-lg z-10 flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      {discount} OFF
                    </div>
                  )}
                  {coupon.isVerified && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 z-10">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </div>
                  )}

                  <h3 className="text-lg font-extrabold mb-4 group-hover:text-red-600 transition line-clamp-2 text-gray-900 pr-20">
                    {coupon.title}
                  </h3>

                  {coupon.code && (
                    <div className="border-2 border-dashed border-yellow-500 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl py-3 text-center font-mono text-base mb-4 text-gray-900 font-bold tracking-wider">
                      {coupon.code}
                    </div>
                  )}

                  {coupon.expiryDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4" />
                      <span>Expires {new Date(coupon.expiryDate).toLocaleDateString("en-US")}</span>
                    </div>
                  )}

                  <div className={`text-center py-3 rounded-xl font-bold transition ${
                    coupon.code
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white group-hover:from-yellow-400 group-hover:to-orange-400"
                      : "bg-gradient-to-r from-gray-900 to-black text-white group-hover:from-red-500 group-hover:to-red-600"
                  }`}>
                    {coupon.code ? "Show Coupon →" : "Show Deal →"}
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
