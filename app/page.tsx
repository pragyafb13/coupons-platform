import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
    take: 8,
  });

  const [totalCoupons, totalStores] = await Promise.all([
    prisma.coupon.count({ where: { status: "ACTIVE" } }),
    prisma.store.count(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold text-indigo-600">
            DealStack
          </Link>

          <nav className="hidden md:flex gap-8 font-medium">
            <Link href="/coupons" className="hover:text-indigo-600 transition">
              Coupons
            </Link>
            <Link href="/stores" className="hover:text-indigo-600 transition">
              Stores
            </Link>
            <Link href="/categories" className="hover:text-indigo-600 transition">
              Categories
            </Link>
          </nav>

          <Link
            href="/coupons"
            className="hidden md:block bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Browse Deals
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white py-32 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            India’s Smartest Way to Save Money
          </h1>

          <p className="text-xl text-indigo-100 mb-12">
            Discover verified coupons from {totalStores}+ stores and
            unlock instant savings on every purchase.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              href="/coupons"
              className="bg-white text-indigo-700 px-10 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              Explore Coupons
            </Link>
            <Link
              href="/stores"
              className="bg-indigo-800 px-10 py-4 rounded-2xl font-semibold hover:bg-indigo-900 transition"
            >
              View Stores
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-indigo-100">
            <div>
              <div className="text-4xl font-bold">{totalCoupons}+</div>
              <div>Active Coupons</div>
            </div>
            <div>
              <div className="text-4xl font-bold">{totalStores}+</div>
              <div>Trusted Brands</div>
            </div>
            <div>
              <div className="text-4xl font-bold">100%</div>
              <div>Verified Deals</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED COUPONS ================= */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-14">
          <h2 className="text-4xl font-bold">
            Featured Coupons
          </h2>
          <Link
            href="/coupons"
            className="text-indigo-600 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        {featuredCoupons.length === 0 ? (
          <p className="text-center text-gray-500">
            No featured coupons yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-700">
                      {coupon.store.name}
                    </span>
                    {coupon.isVerified && (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-5 group-hover:text-indigo-600 transition">
                    {coupon.title}
                  </h3>

                  {coupon.code && (
                    <div className="font-mono bg-gray-100 border-dashed border-2 border-gray-300 px-4 py-3 rounded-xl text-center mb-6">
                      {coupon.code}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-auto">
                  {coupon.dealUrl &&
                    coupon.dealUrl.startsWith("http") && (
                      <a
                        href={coupon.dealUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-indigo-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
                      >
                        Get Deal
                      </a>
                    )}

                  <Link
                    href={`/coupons/${coupon.id}`}
                    className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= TRUST SECTION ================= */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-16">
            Why Millions Trust DealStack
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Manually Verified",
                desc: "Every coupon is checked before publishing.",
              },
              {
                title: "Real-Time Updates",
                desc: "Expired deals are removed instantly.",
              },
              {
                title: "Fast & Clean",
                desc: "Lightning fast experience without clutter.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-md">
                <h3 className="text-xl font-bold mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED STORES ================= */}
      {featuredStores.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Featured Stores
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {featuredStores.map((store) => (
              <Link
                key={store.id}
                href={`/stores/${store.id}`}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-xl transition"
              >
                <div className="font-semibold">
                  {store.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= CTA ================= */}
      <section className="bg-indigo-600 text-white py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Start Saving Today
        </h2>
        <p className="text-indigo-200 mb-10">
          Browse top deals from India’s biggest brands.
        </p>
        <Link
          href="/coupons"
          className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition"
        >
          Explore Now
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 py-14 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-white text-2xl font-bold mb-4">
              DealStack
            </h3>
            <p>
              Your trusted platform for verified coupons and
              unbeatable savings.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><Link href="/coupons">Coupons</Link></li>
              <li><Link href="/stores">Stores</Link></li>
              <li><Link href="/categories">Categories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">
              Contact
            </h4>
            <p>Email: support@dealstack.com</p>
          </div>
        </div>

        <div className="text-center mt-10 text-sm text-gray-500">
          © {new Date().getFullYear()} DealStack. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
