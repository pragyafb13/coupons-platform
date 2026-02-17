import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default async function Footer() {
  let categories: Array<{ id: string; name: string; slug: string }> = [];
  let totalCoupons = 0;
  let totalStores = 0;

  try {
    // Fetch sequentially to reduce connection pool pressure
    let couponsCount = 0;
    let storesCount = 0;
    
    try {
      couponsCount = await prisma.coupon.count();
    } catch (err) {
      console.error("Error counting coupons in footer:", err);
    }
    
    try {
      storesCount = await prisma.store.count();
    } catch (err) {
      console.error("Error counting stores in footer:", err);
    }
    
    // Fetch categories separately
    let categoriesData: Array<{ id: string; name: string; slug: string }> = [];
    try {
      categoriesData = await prisma.category.findMany({
        take: 8,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });
    } catch (err) {
      console.error("Error fetching categories in footer:", err);
    }
    
    categories = categoriesData;
    totalCoupons = couponsCount;
    totalStores = storesCount;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    // Use default values if queries fail
    categories = [];
    totalCoupons = 0;
    totalStores = 0;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <h2 className="text-xl font-bold text-white">DealStack</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Discover the best coupons, promo codes and exclusive deals
              updated daily. Save more on every purchase.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/categories/${category.slug}`}
                      className="text-gray-400 hover:text-yellow-400 transition"
                    >
                      {category.name}
                    </Link>
              </li>
                ))
              ) : (
                <li className="text-gray-400">No categories available</li>
              )}
              <li>
                <Link 
                  href="/categories"
                  className="text-gray-400 hover:text-yellow-400 transition font-medium"
                >
                  View All →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-yellow-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-yellow-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-gray-400 hover:text-yellow-400 transition">
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="/submit-coupon" className="text-gray-400 hover:text-yellow-400 transition">
                  Submit Coupon
                </Link>
              </li>
            </ul>
          </div>

          {/* Stats & Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-3 mb-6">
              <div>
                <div className="text-2xl font-bold text-yellow-400">{totalCoupons}+</div>
                <div className="text-sm text-gray-400">Active Coupons</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{totalStores}+</div>
                <div className="text-sm text-gray-400">Top Stores</div>
              </div>
            </div>
            <h3 className="font-semibold text-white mb-4 mt-6">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-yellow-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-yellow-400 transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-yellow-400 transition">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} DealStack. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-yellow-400 transition">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-yellow-400 transition">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-yellow-400 transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
