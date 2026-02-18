export const dynamic = "force-dynamic";

"use client";

import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { submitCoupon } from "./actions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SubmitCouponForm() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      // Clear success message after 5 seconds
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Upload className="h-8 w-8 text-green-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Submit a Coupon</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Help others save money by sharing your coupon codes
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Submit</h3>
                <p className="text-gray-600 text-sm">
                  Fill out the form below with coupon details
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Review</h3>
                <p className="text-gray-600 text-sm">
                  Our team verifies the coupon code
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Publish</h3>
                <p className="text-gray-600 text-sm">
                  Your coupon goes live and helps others save
                </p>
              </div>
            </div>
          </section>

          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Success!</h3>
                  <p className="text-green-800 text-sm">
                    Your coupon has been submitted successfully. Our team will review it and publish it soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Your Coupon</h2>
            <form action={submitCoupon} className="space-y-6">
              <div>
                <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  id="store"
                  name="store"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g., Amazon, Flipkart"
                  required
                />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g., 20% Off on Electronics"
                  required
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono"
                  placeholder="Enter coupon code (if applicable)"
                />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Deal URL *
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="https://store.com/deal"
                  required
                />
              </div>
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiry"
                  name="expiry"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Additional details about the coupon..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <Upload className="h-5 w-5" />
                Submit Coupon
              </button>
            </form>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Tips for Submission</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Make sure the coupon code is valid and not expired</li>
                  <li>• Provide accurate store name and deal URL</li>
                  <li>• Include expiry date if known</li>
                  <li>• Verified coupons get priority placement</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Note</h3>
                <p className="text-yellow-800 text-sm">
                  All submitted coupons are reviewed by our team before being published. We reserve the right to reject coupons that don't meet our quality standards or violate our terms of service.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function SubmitCouponPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmitCouponForm />
    </Suspense>
  );
}
