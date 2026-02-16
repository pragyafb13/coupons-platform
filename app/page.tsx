export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";

export default async function HomePage() {
  const featuredCoupons = await prisma.coupon.findMany({
    where: {
      status: "ACTIVE",
      OR: [{ store: { isFeatured: true } }, { isVerified: true }],
    },
    include: { store: true },
    orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
    take: 8,
  });

  const featuredStores = await prisma.store.findMany({
    where: { isFeatured: true },
    take: 12,
  });

  const [totalCoupons, totalStores] = await Promise.all([
    prisma.coupon.count({ where: { status: "ACTIVE" } }),
    prisma.store.count(),
  ]);

  return (
    <div className="bg-[#fafafa] text-gray-900 min-h-screen">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">

          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            CouponBunch
          </Link>

          {/* search */}
          <div className="hidden md:flex w-[40%] relative">
            <input
              placeholder="Search Amazon, Ajio, Myntra..."
              className="w-full pl-11 pr-4 py-2 rounded-full border bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/stores" className="font-medium text-sm hover:text-black">
              Stores
            </Link>
            <Link href="/categories" className="font-medium text-sm hover:text-black">
              Categories
            </Link>

            <Link
              href="/admin"
              className="bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative pt-28 pb-24 overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
<div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl"></div>


        {/* gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-[0.06]" />

        <div className="max-w-7xl mx-auto px-6 text-center relative">

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            India’s Smartest Way  
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
              to Save Money Online
            </span>
          </h1>

          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Verified coupons & promo codes from {totalStores}+ stores.
            Updated daily. 100% working deals.
          </p>

          {/* search big */}
          <div className="max-w-xl mx-auto relative mb-8">
            <input
              placeholder="Search for stores or coupons..."
              className="w-full h-14 rounded-full border bg-white pl-14 pr-5 text-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <Search className="absolute left-5 top-5 text-gray-400" />
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/coupons"
              className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
            >
              Browse Coupons
            </Link>

            <Link
              href="/stores"
              className="border px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Explore Stores
            </Link>
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold">{totalCoupons}+</div>
              <div className="text-gray-500 text-sm">Active Coupons</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{totalStores}+</div>
              <div className="text-gray-500 text-sm">Stores</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-gray-500 text-sm">Verified Deals</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-y">
  <div className="max-w-6xl mx-auto px-6">
    <p className="text-center text-gray-500 mb-8">
      Trusted by shoppers from top brands
    </p>

    <div className="flex flex-wrap justify-center gap-10 opacity-70">
      {featuredStores.map((store) => (
        <img
          key={store.id}
          src={store.logo || "/logos/default.png"}
          className="h-8 object-contain grayscale hover:grayscale-0 transition"
        />
      ))}
    </div>
  </div>
</section>


      {/* ================= TRENDING COUPONS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">🔥 Trending Coupons</h2>
          <Link href="/coupons" className="font-semibold text-indigo-600">
            View all →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
  {featuredCoupons.map((coupon) => (
    <div
      key={coupon.id}
      className="group relative bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >

      {/* TOP IMAGE / BRAND STRIP */}
      <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center relative">

        {coupon.store.logo ? (
          <img
            src={coupon.store.logo}
            alt={coupon.store.name}
            className="h-12 object-contain bg-white p-2 rounded-xl shadow"
          />
        ) : (
          <div className="text-white font-bold text-lg">
            {coupon.store.name}
          </div>
        )}

        {coupon.isVerified && (
          <div className="absolute top-3 right-3 bg-white/90 text-green-600 text-xs px-3 py-1 rounded-full font-semibold shadow">
            verified
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col h-full">

        <h3 className="font-bold text-lg mb-3 group-hover:text-indigo-600 transition">
          {coupon.title}
        </h3>

        {coupon.code && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl py-3 text-center font-mono text-lg mb-5 bg-gray-50">
            {coupon.code}
          </div>
        )}

        {/* buttons */}
        <div className="flex gap-2 mt-auto">
          {coupon.dealUrl && (
            <a
              href={coupon.dealUrl}
              target="_blank"
              className="flex-1 bg-black text-white py-3 rounded-xl text-center font-semibold hover:scale-105 transition"
            >
              Get Deal
            </a>
          )}

          <Link
            href={`/coupons/${coupon.id}`}
            className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>

      </section>

      {/* ================= FEATURED STORES ================= */}
      <section className="bg-white border-y py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Stores
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {featuredStores.map((store) => (
              <Link
                key={store.id}
                href={`/stores/${store.id}`}
                className="border rounded-2xl p-6 text-center bg-white hover:shadow-md transition font-semibold"
              >
                {store.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-14">
            Why users love CouponBunch
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              ["Manually Verified", "Every coupon is tested before publishing"],
              ["Updated Daily", "Fresh deals added every morning"],
              ["No Fake Codes", "Only working coupons allowed"],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white p-10 rounded-3xl shadow-sm">
                <h3 className="font-bold text-lg mb-3">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-black text-white py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Start Saving Today
        </h2>
        <p className="text-gray-300 mb-8">
          Join thousands saving money every day
        </p>

        <Link
          href="/coupons"
          className="bg-white text-black px-8 py-4 rounded-xl font-semibold"
        >
          Explore Deals
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white/70 backdrop-blur-md border-t shadow-sm py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <div className="text-xl font-bold mb-3">CouponBunch</div>
          <p className="mb-6">India's fastest growing coupon platform.</p>
          <div className="text-sm">
            © {new Date().getFullYear()} CouponBunch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
