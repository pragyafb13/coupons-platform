import { Megaphone, TrendingUp, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Megaphone className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Advertise with DealStack</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Reach millions of deal-seekers and grow your business
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Advertise on DealStack?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Large Audience</h3>
                  <p className="text-gray-600 text-sm">
                    Reach thousands of active deal-seekers who are ready to make purchases
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <TrendingUp className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">High Conversion</h3>
                  <p className="text-gray-600 text-sm">
                    Our users are actively looking for deals, leading to higher conversion rates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <BarChart3 className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Targeted Marketing</h3>
                  <p className="text-gray-600 text-sm">
                    Reach customers in specific categories and demographics
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Megaphone className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Brand Visibility</h3>
                  <p className="text-gray-600 text-sm">
                    Increase your brand awareness among deal-conscious shoppers
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advertising Options</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Banner Advertising</h3>
                <p className="text-gray-600 mb-4">
                  Display your banner ads on high-traffic pages to maximize visibility
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                  <li>Homepage banner placements</li>
                  <li>Category page banners</li>
                  <li>Store page banners</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Featured Store Listing</h3>
                <p className="text-gray-600 mb-4">
                  Get your store featured prominently in search results and category pages
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                  <li>Top placement in store listings</li>
                  <li>Featured badge on your store page</li>
                  <li>Priority in search results</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Sponsored Coupons</h3>
                <p className="text-gray-600 mb-4">
                  Promote your coupons at the top of relevant category and search pages
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                  <li>Premium placement for your coupons</li>
                  <li>Verified badge for credibility</li>
                  <li>Higher click-through rates</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started</h2>
            <p className="text-gray-600 mb-6">
              Ready to grow your business with DealStack? Contact us today to discuss advertising opportunities and pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-center"
              >
                Contact Us
              </Link>
              <a
                href="mailto:advertise@dealstack.com"
                className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition text-center"
              >
                Email Us
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
