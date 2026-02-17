export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Flame } from "lucide-react";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function HomePage() {
  const [
    categories,
    featuredCoupons,
    featuredStores,
    totalCoupons,
    totalStores,
    banners,
  ] = await Promise.all([
    prisma.category.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.coupon.findMany({
      where: {
        status: "ACTIVE",
        isActive: true,
      },
      include: { store: true },
      orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
      take: 8,
    }),
    prisma.store.findMany({
      where: { isFeatured: true },
      take: 12,
    }),
    prisma.coupon.count({ where: { status: "ACTIVE" } }),
    prisma.store.count(),
    // @ts-ignore (if banner type not generated yet)
    prisma.banner?.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
      take: 4,
    }) ?? [],
  ]);

  const mainBanner = banners?.[0];
  const promoBanners = banners?.slice(1, 4);

  return (
    <div className="bg-white text-gray-900">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-red-500/10 to-orange-500/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDItMiA0LTQgNHMtNC0yLTQtNCAyLTQgNC00IDQgMiA0IDR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz48L2c+PC9zdmc+')] opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Save Big With Verified
            <span className="block text-yellow-400 mt-2">
              Coupons & Promo Codes
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 px-4">
            {totalCoupons}+ active deals from {totalStores}+ stores.
            Updated daily. 100% working offers.
          </p>

          <form action="/search" method="GET" className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <input
                name="q"
                placeholder="Search Amazon, Flipkart, Myntra..."
                className="w-full h-14 sm:h-16 rounded-2xl px-6 pr-32 text-base sm:text-lg text-gray-900 shadow-2xl outline-none focus:ring-4 focus:ring-yellow-400/30 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition text-sm sm:text-base"
              >
                Search
              </button>
            </div>
          </form>

          {/* TRUST STATS */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 text-sm max-w-2xl mx-auto px-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 mb-1">
                {totalCoupons}+
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Verified Coupons</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 mb-1">
                {totalStores}+
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Top Stores</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-400 mb-1">
                100%
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Working Deals</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BIG MAIN BANNER ================= */}
      {mainBanner && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Link
            href={mainBanner.linkUrl}
            className="relative block rounded-2xl sm:rounded-3xl overflow-hidden group shadow-2xl"
          >
            <img
              src={mainBanner.imageUrl}
              alt={mainBanner.title}
              className="w-full h-[280px] sm:h-[360px] lg:h-[420px] object-cover transition duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 text-white max-w-lg pr-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                {mainBanner.title}
              </h2>
              <span className="inline-block bg-yellow-400 text-black px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-yellow-300 transition shadow-lg">
                Explore Now →
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* ================= POPULAR CATEGORIES ================= */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Popular Categories
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Browse deals by category
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat: { id: Key | null | undefined; slug: any; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group"
              >
                <h3 className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-yellow-600 transition">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3 PROMO GRID ================= */}
      {promoBanners?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {promoBanners.map((banner: { id: React.Key, linkUrl: string, imageUrl: string, title: string }) => (
              <Link
                key={banner.id}
                href={banner.linkUrl}
                className="relative rounded-xl sm:rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-56 sm:h-64 lg:h-72 object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white pr-4">
                  <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-2 leading-tight">
                    {banner.title}
                  </h3>
                  <span className="text-sm sm:text-base text-yellow-300 font-medium">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= TRENDING COUPONS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3">
            <Flame className="text-red-500 h-6 w-6 sm:h-7 sm:w-7" />
            <span>Trending Coupons</span>
          </h2>
          <Link 
            href="/coupons" 
            className="text-red-500 font-semibold hover:text-red-600 transition text-sm sm:text-base"
          >
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredCoupons.map((coupon: { 
            id: string | number; 
            title: string; 
            code?: string; 
            store: { name: string; logo?: string }
          }) => {
            const discountMatch = coupon.title.match(/\d+%/);
            const discount = discountMatch ? discountMatch[0] : null;

            return (
              <Link
                key={coupon.id}
                href={`/coupons/${coupon.id}`}
                className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
              >
                {/* DISCOUNT BADGE */}
                {discount && (
                  <div className="absolute -top-3 left-4 sm:left-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 sm:px-4 py-1 rounded-full shadow-lg">
                    {discount} OFF
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  {coupon.store.logo ? (
                    <Image
                      src={coupon.store.logo}
                      alt={coupon.store.name}
                      width={50}
                      height={30}
                      className="object-contain"
                    />
                  ) : (
                    <span className="font-semibold text-sm text-gray-700">
                      {coupon.store.name}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold mb-3 group-hover:text-red-500 transition line-clamp-2 min-h-[3rem]">
                  {coupon.title}
                </h3>

                {coupon.code && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl py-2.5 text-center font-mono text-xs sm:text-sm mb-4 bg-gray-50 text-gray-800 font-semibold">
                    {coupon.code}
                  </div>
                )}

                <div className="bg-black text-white text-center py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base group-hover:bg-red-500 transition shadow-md">
                  Get Deal →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================= FEATURED STORES ================= */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Top Brands
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Shop from trusted retailers
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {featuredStores.map((store: { id: string | number; slug: string; logo?: string; name: string }) => (
              <Link
                key={store.id}
                href={`/stores/${store.slug}`}
                className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center min-h-[100px] border border-gray-100 group"
              >
                {store.logo ? (
                  <Image
                    src={store.logo}
                    alt={store.name}
                    width={100}
                    height={50}
                    className="object-contain max-h-12 sm:max-h-16 opacity-80 group-hover:opacity-100 transition"
                  />
                ) : (
                  <span className="font-semibold text-sm sm:text-base text-gray-700 text-center">
                    {store.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
