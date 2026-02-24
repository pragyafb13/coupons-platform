export const dynamic = "force-dynamic";

import Link from "next/link";
import { Info, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
            <Info className="h-5 w-5" />
            <span className="text-sm font-semibold">About Us</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">About DealStack</h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Your ultimate destination for verified coupons and exclusive deals
          </p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-premium border-2 border-gray-200 p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Info className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">About DealStack</h1>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p className="text-lg leading-relaxed">
              DealStack is your ultimate destination for finding the best coupons, promo codes, and exclusive deals from top retailers across the globe. We are committed to helping you save money on every purchase.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="leading-relaxed">
                Our mission is to make saving money accessible to everyone. We curate and verify thousands of coupons and deals daily, ensuring that you always have access to the latest and most reliable promotional offers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Aggregate coupons and promo codes from verified sources</li>
                <li>Test and verify coupon codes for accuracy</li>
                <li>Update deals daily to ensure freshness</li>
                <li>Provide a user-friendly platform for easy browsing</li>
                <li>Partner with top retailers to bring exclusive deals</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose DealStack?</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Verified Deals:</strong> All coupons are tested and verified before being published</li>
                <li><strong>Daily Updates:</strong> Fresh deals added every day</li>
                <li><strong>Wide Selection:</strong> Thousands of coupons from hundreds of stores</li>
                <li><strong>User-Friendly:</strong> Easy to search and browse</li>
                <li><strong>Free to Use:</strong> No hidden fees or subscriptions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="leading-relaxed mb-4">
                Have questions or suggestions? We&apos;d love to hear from you!
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
              >
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
