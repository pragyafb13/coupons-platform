export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, CheckCircle2, Zap, Tag } from "lucide-react";

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                <Search className="h-5 w-5" />
                <span className="text-sm font-semibold">Search</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
                Search Coupons & Deals
              </h1>
              <p className="text-lg text-white/90 max-w-xl mx-auto">
                Enter a store name or deal keyword above to find the best coupons
              </p>
            </div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-premium border-2 border-gray-200 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Search Term</h2>
            <p className="text-gray-600 mb-6">Please enter a search term in the search bar to find coupons and deals.</p>
            <Link
              href="/coupons"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg"
            >
              Browse All Coupons
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let results: Array<{
    id: string;
    title: string;
    code: string | null;
    expiryDate: Date | null;
    isVerified: boolean;
    store: {
      id: string;
      name: string;
      logo: string | null;
    };
  }> = [];

  try {
    results = await prisma.coupon.findMany({
      where: {
        status: "ACTIVE",
        isActive: true,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            store: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        store: true,
      },
      orderBy: [
        { isVerified: "desc" },
        { createdAt: "desc" },
      ],
    });
  } catch (error) {
    console.error("Error searching coupons:", error);
    results = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <Search className="h-5 w-5" />
              <span className="text-sm font-semibold">Search Results</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
              Results for &quot;{query}&quot;
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              {results.length} {results.length === 1 ? "coupon" : "coupons"} found
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {results.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-premium border-2 border-gray-200 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Tag className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Coupons Found</h2>
            <p className="text-gray-600 mb-6">
              No active coupons match &quot;{query}&quot;. Try a different search term or browse all coupons.
            </p>
            <Link
              href="/coupons"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg"
            >
              Browse All Coupons
              <span className="text-xl">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {results.map((coupon) => {
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
                        <span className="font-extrabold text-gray-800 text-xl">
                          {coupon.store.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{coupon.store.name}</h4>
                    </div>
                  </div>

                  {/* Coupon Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold mb-4 group-hover:text-red-600 transition line-clamp-2 min-h-[3.5rem] text-gray-900 leading-tight">
                    {coupon.title}
                  </h3>

                  {/* Coupon Code */}
                  {coupon.code && (
                    <div className="border-2 border-dashed border-yellow-500 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl py-4 text-center font-mono text-lg sm:text-xl mb-6 text-gray-900 font-extrabold tracking-wider shadow-inner">
                      {coupon.code}
                    </div>
                  )}

                  {/* Expiry Date */}
                  {coupon.expiryDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-6 bg-gray-100 rounded-lg px-3 py-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold">
                        Expires {new Date(coupon.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  )}

                  {/* Premium CTA Button */}
                  <div
                    className={`text-center py-4 rounded-xl font-bold text-base sm:text-lg transition shadow-lg ${
                      coupon.code
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white group-hover:from-yellow-400 group-hover:to-orange-400"
                        : "bg-gradient-to-r from-gray-900 to-black text-white group-hover:from-red-500 group-hover:to-red-600"
                    }`}
                  >
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
