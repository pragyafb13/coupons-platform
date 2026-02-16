"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-40 w-full border-t bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold">CouponBunch</h2>
            <p className="text-sm text-gray-600 mt-3">
              Discover the best coupons, promo codes and exclusive deals
              updated daily. Save more on every purchase.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/advertise">Advertise</Link>
              </li>
              <li>
                <Link href="/submit-coupon">Submit Coupon</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/category/fashion">Fashion</Link>
              </li>
              <li>
                <Link href="/category/electronics">Electronics</Link>
              </li>
              <li>
                <Link href="/category/food">Food</Link>
              </li>
              <li>
                <Link href="/category/travel">Travel</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/disclaimer">Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CouponBunch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
