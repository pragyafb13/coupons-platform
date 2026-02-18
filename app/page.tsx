export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Flame, Sparkles, Shield, TrendingUp, Star, CheckCircle2, Zap } from "lucide-react";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function HomePage() {
  // Fetch banners with error handling in case Banner table doesn't exist
  let banners: any[] = [];
  try {
    banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
      take: 4,
    });
  } catch (error) {
    // If Banner table doesn't exist or there's an error, use empty array
    console.error("Error fetching banners:", error);
    banners = [];
  }

  let categories: any[] = [];
  let featuredCoupons: any[] = [];
  let featuredStores: any[] = [];
  let totalCoupons = 0;
  let totalStores = 0;

  try {
    // Fetch all data in parallel with Promise.all for better performance
    const [totalCouponsResult, totalStoresResult, categoriesResult, featuredCouponsResult, featuredStoresResult] = await Promise.all([
      prisma.coupon.count().catch(() => 0),
      prisma.store.count().catch(() => 0),
      prisma.category.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      }).catch(() => []),
      prisma.coupon.findMany({
        where: {
          status: "ACTIVE",
        },
        include: { store: true },
        orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
        take: 8,
      }).catch(() => []),
      prisma.store.findMany({
        take: 12,
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      }).catch(() => []),
    ]);
    
    categories = categoriesResult;
    featuredCoupons = featuredCouponsResult;
    featuredStores = featuredStoresResult;
    totalCoupons = totalCouponsResult;
    totalStores = totalStoresResult;
    
  } catch (error) {
    console.error("❌ Error fetching homepage data:", error);
    // Use default values if queries fail
    categories = [];
    featuredCoupons = [];
    featuredStores = [];
    totalCoupons = 0;
    totalStores = 0;
  }

  const mainBanner = banners[0];
  const promoBanners = banners.slice(1, 4);

  return (
    <div className="bg-white text-gray-900">
      {/* ================= PREMIUM HERO SECTION ================= */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-red-500/10 to-orange-500/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDItMiA0LTQgNHMtNC0yLTQtNCAyLTQgNC00IDQgMiA0IDR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz48L2c+PC9zdmc+')] opacity-20" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center w-full">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Premium Coupon Platform</span>
            <Shield className="h-4 w-4 text-yellow-400" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight animate-fade-in-up">
            Save Big With
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 mt-2">
              Verified Coupons
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-2">
              & Promo Codes
            </span>
          </h1>

          <p className="text-gray-200 text-lg sm:text-xl max-w-3xl mx-auto mb-10 px-4 leading-relaxed animate-fade-in-up">
            {totalCoupons}+ active deals from {totalStores}+ premium stores.
            <span className="block mt-2 text-yellow-400 font-semibold">
              Updated daily. 100% verified offers. Trusted by millions.
            </span>
          </p>

          {/* Premium Search Bar */}
          <form action="/search" method="GET" className="max-w-3xl mx-auto px-4 mb-8 animate-fade-in-up">
            <div className="relative">
              <input
                name="q"
                placeholder="Search Amazon, Flipkart, Myntra, Nike, Adidas..."
                className="w-full h-16 sm:h-20 rounded-2xl px-8 pr-40 text-lg sm:text-xl text-gray-900 shadow-2xl outline-none focus:ring-4 focus:ring-yellow-400/30 transition-all border-2 border-transparent focus:border-yellow-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-bold hover:from-yellow-300 hover:to-orange-400 transition text-base sm:text-lg shadow-lg hover:shadow-xl"
              >
                Search Deals
              </button>
            </div>
          </form>

          {/* Premium Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 max-w-4xl mx-auto px-4 animate-fade-in-up">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition shadow-lg">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />
                {totalCoupons}+
              </div>
              <div className="text-gray-300 text-sm sm:text-base font-medium">Verified Coupons</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition shadow-lg">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-2">
                <Star className="h-6 w-6 sm:h-8 sm:w-8" />
                {totalStores}+
              </div>
              <div className="text-gray-300 text-sm sm:text-base font-medium">Premium Stores</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition shadow-lg">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8" />
                100%
              </div>
              <div className="text-gray-300 text-sm sm:text-base font-medium">Working Deals</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 hover:bg-white/15 transition shadow-lg">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-2">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8" />
                24/7
              </div>
              <div className="text-gray-300 text-sm sm:text-base font-medium">Updated Daily</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MEGA MAIN BANNER ================= */}
      {mainBanner && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Link
            href={mainBanner.linkUrl}
            className="relative block rounded-3xl overflow-hidden group shadow-premium-xl hover:shadow-premium-xl transition-all duration-500"
          >
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
              {mainBanner.imageUrl ? (
                <Image
                  src={mainBanner.imageUrl}
                  alt={mainBanner.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-semibold">Featured Banner</p>
                  </div>
                </div>
              )}
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
              
              {/* Animated Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            <div className="absolute bottom-8 sm:bottom-16 left-8 sm:left-16 text-white max-w-2xl pr-4 z-10">
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-4 py-2 mb-4">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">Featured Deal</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
                {mainBanner.title}
              </h2>
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition shadow-xl hover:shadow-2xl">
                Explore Now
                <span className="text-2xl">→</span>
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* ================= PREMIUM CATEGORIES SECTION ================= */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-600">Browse by Category</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-gray-900">
              Popular Categories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover amazing deals across all your favorite categories
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat: { id: Key | null | undefined; slug: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group bg-white p-6 sm:p-8 rounded-2xl text-center shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-yellow-600 transition">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PREMIUM PROMO BANNERS GRID ================= */}
      {promoBanners?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {promoBanners.map((banner: { id: React.Key, linkUrl: string, imageUrl: string, title: string }) => (
              <Link
                key={banner.id}
                href={banner.linkUrl}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden group shadow-premium hover:shadow-premium-lg transition-all duration-500"
              >
                <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                  {banner.imageUrl ? (
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-semibold">Promo Banner</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white pr-4 z-10">
                  <h3 className="font-extrabold text-xl sm:text-2xl lg:text-3xl mb-3 leading-tight">
                    {banner.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-yellow-300 font-bold text-base sm:text-lg group-hover:text-yellow-200 transition">
                    Shop Now
                    <span className="text-xl">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= PREMIUM TRENDING COUPONS ================= */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 sm:mb-16 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-4">
                <Flame className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold text-red-600">Hot Deals</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold flex items-center gap-3 text-gray-900">
                <Flame className="text-red-500 h-8 w-8 sm:h-10 sm:w-10" />
                <span>Trending Coupons</span>
              </h2>
              <p className="text-gray-600 text-lg mt-2">Most popular deals right now</p>
            </div>
            <Link 
              href="/coupons" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-orange-600 transition shadow-lg hover:shadow-xl"
            >
              View all
              <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredCoupons.map((coupon) => {
              const discountMatch = coupon.title.match(/\d+%/);
              const discount = discountMatch ? discountMatch[0] : null;
              const hasCode = !!coupon.code;

              return (
                <Link
                  key={coupon.id}
                  href={`/coupons/${coupon.id}`}
                  className="group bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300 relative"
                >
                  {/* Premium Discount Badge */}
                  {discount && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-extrabold px-4 py-2 rounded-xl shadow-lg z-10 flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      {discount} OFF
                    </div>
                  )}

                  {/* Verified Badge */}
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 z-10">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </div>

                  {/* Store Image/Logo Section */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {coupon.store.logo ? (
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="relative w-full h-full max-w-[200px] max-h-[120px]">
                          <Image
                            src={coupon.store.logo}
                            alt={coupon.store.name}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 200px"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="font-extrabold text-white text-4xl">
                            {coupon.store.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="p-6 sm:p-8">
                    {/* Store Name */}
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        {coupon.store.name}
                      </p>
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

                    {/* Dynamic Button */}
                    <div className={`text-center py-4 rounded-xl font-bold text-base sm:text-lg transition shadow-lg ${
                      hasCode
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white group-hover:from-yellow-400 group-hover:to-orange-400"
                        : "bg-gradient-to-r from-gray-900 to-black text-white group-hover:from-red-500 group-hover:to-red-600"
                    }`}>
                      {hasCode ? "Show Coupon →" : "Show Deal →"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PREMIUM FEATURED STORES ================= */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
              <Star className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Trusted Partners</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-gray-900">
              Top Brands & Stores
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Shop from the world's most trusted retailers and brands
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {featuredStores.map((store) => (
              <Link
                key={store.id}
                href={`/stores/${store.slug}`}
                className="group bg-white p-6 sm:p-8 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 flex items-center justify-center min-h-[140px] border-2 border-gray-100 hover:border-yellow-400 relative overflow-hidden"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  {store.logo ? (
                    <Image
                      src={store.logo}
                      alt={store.name}
                      width={120}
                      height={60}
                      className="object-contain max-h-16 sm:max-h-20 opacity-80 group-hover:opacity-100 transition w-full"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:from-yellow-200 group-hover:to-orange-200 transition">
                        <span className="font-extrabold text-gray-700 text-xl">
                          {store.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-bold text-sm sm:text-base text-gray-700 group-hover:text-yellow-600 transition">
                        {store.name}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PREMIUM TRUST SECTION ================= */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Why Choose DealStack?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Join millions of smart shoppers saving money every day
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Verified</h3>
              <p className="text-gray-300 text-sm">All coupons tested and verified daily</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Updated Daily</h3>
              <p className="text-gray-300 text-sm">Fresh deals added every single day</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Free Forever</h3>
              <p className="text-gray-300 text-sm">No hidden fees, completely free</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Stores</h3>
              <p className="text-gray-300 text-sm">Top brands and retailers worldwide</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
