import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
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
              <p className="leading-relaxed">
                Have questions or suggestions? We'd love to hear from you! Visit our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a> to get in touch.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
