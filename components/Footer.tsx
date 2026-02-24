import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

async function getFooterData() {
  const [couponsCount, storesCount, categoriesData] = await Promise.all([
    prisma.coupon.count().catch(() => 0),
    prisma.store.count().catch(() => 0),
    prisma.category.findMany({
      take: 8,
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }).catch(() => []),
  ]);
  return { categories: categoriesData, totalCoupons: couponsCount, totalStores: storesCount };
}

const getCachedFooterData = unstable_cache(getFooterData, ["footer-stats"], { revalidate: 60 });

export default async function Footer() {
  let categories: Array<{ id: string; name: string; slug: string }> = [];
  let totalCoupons = 0;
  let totalStores = 0;

  try {
    const data = await getCachedFooterData();
    categories = data.categories;
    totalCoupons = data.totalCoupons;
    totalStores = data.totalStores;
  } catch (error) {
    console.error("Error fetching footer data:", error);
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <h2 className="text-xl font-bold text-purple-200">DealStack</h2>
            </div>
            <p className="text-sm text-purple-200 mb-4 leading-relaxed">
              Discover the best coupons, promo codes and exclusive deals
              updated daily. Save more on every purchase.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-purple-200 hover:text-purple-100 transition" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-purple-200 hover:text-purple-100 transition" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-purple-200 hover:text-purple-100 transition" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-purple-200 hover:text-purple-100 transition" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-purple-200 mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/categories/${category.slug}`}
                      className="text-purple-200 hover:text-purple-100 transition"
                    >
                      {category.name}
                    </Link>
              </li>
                ))
              ) : (
                <li className="text-purple-200">No categories available</li>
              )}
              <li>
                <Link 
                  href="/categories"
                  className="text-purple-200 hover:text-purple-100 transition font-medium"
                >
                  View All →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-purple-200 mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-purple-200 hover:text-purple-100 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-purple-200 hover:text-purple-100 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-purple-200 hover:text-purple-100 transition">
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="/submit-coupon" className="text-purple-200 hover:text-purple-100 transition">
                  Submit Coupon
                </Link>
              </li>
            </ul>
          </div>

          {/* Stats & Legal */}
          <div>
            <h3 className="font-semibold text-purple-200 mb-4">Quick Stats</h3>
            <div className="space-y-3 mb-6">
              <div>
                <div className="text-2xl font-bold text-purple-200">{totalCoupons}+</div>
                <div className="text-sm text-purple-200">Active Coupons</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-200">{totalStores}+</div>
                <div className="text-sm text-purple-200">Top Stores</div>
              </div>
            </div>
            <h3 className="font-semibold text-purple-200 mb-4 mt-6">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-purple-200 hover:text-purple-100 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-purple-200 hover:text-purple-100 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-purple-200 hover:text-purple-100 transition">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-purple-200 text-center md:text-left">
              © {new Date().getFullYear()} DealStack. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy-policy" className="text-purple-200 hover:text-purple-100 transition">
                Privacy
              </Link>
              <Link href="/terms" className="text-purple-200 hover:text-purple-100 transition">
                Terms
              </Link>
              <Link href="/contact" className="text-purple-200 hover:text-purple-100 transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
