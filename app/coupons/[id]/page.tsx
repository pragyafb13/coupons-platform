export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, CheckCircle2, ExternalLink, Tag } from "lucide-react";
import CopyButton from "./CopyButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CouponDetailPage({ params }: Props) {
  const { id } = await params;

  if (!id) notFound();

  let coupon;
  try {
    coupon = await prisma.coupon.findUnique({
    where: { id },
    include: {
      store: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    notFound();
  }

  if (!coupon) notFound();

  const discountMatch = coupon.title.match(/\d+%/);
  const discount = discountMatch ? discountMatch[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <Link
          href="/coupons"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all coupons
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-premium border-2 border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-900 to-black p-6 sm:p-8 text-white relative">
            {discount && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                {discount} OFF
              </div>
            )}
            
            {coupon.isVerified && (
              <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </div>
            )}

            <div className="mt-8 sm:mt-12 pr-24">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                {coupon.title}
              </h1>
              
              {coupon.store && (
                <Link
                  href={`/stores/${coupon.store.slug}`}
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                  {coupon.store.logo ? (
                    <Image
                      src={coupon.store.logo}
                      alt={coupon.store.name}
                      width={40}
                      height={24}
                      className="object-contain bg-white/10 rounded p-1"
                    />
                  ) : (
                    <Tag className="h-4 w-4" />
                  )}
                  <span className="font-medium">{coupon.store.name}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Coupon Code Section */}
            {coupon.code && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-400 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Tag className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Coupon Code
                  </span>
                </div>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <code className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wider">
                    {coupon.code}
                  </code>
                </div>
                <CopyButton code={coupon.code || ''} />
              </div>
            )}

            {/* Deal URL Button */}
            {coupon.dealUrl && (
              <a
                href={coupon.dealUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-gray-900 to-black text-white text-center py-4 rounded-xl font-bold text-lg hover:from-red-500 hover:to-red-600 transition shadow-lg flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-5 w-5" />
                Get This Deal Now
              </a>
            )}

            {/* Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {coupon.expiryDate && (
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Expires</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(coupon.expiryDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Status</div>
                  <div className="font-semibold text-gray-900 capitalize">{coupon.status}</div>
                </div>
              </div>
            </div>

            {/* Categories */}
            {coupon.categories && coupon.categories.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {coupon.categories.map((catCoupon) => (
                    <Link
                      key={catCoupon.category.id}
                      href={`/categories/${catCoupon.category.slug}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                    >
                      {catCoupon.category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Make sure to copy the coupon code before clicking "Get This Deal Now". 
                The code will be applied at checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Related Coupons Section */}
        {coupon.store && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              More Deals from {coupon.store.name}
            </h2>
            <Link
              href={`/stores/${coupon.store.slug}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              View all coupons from {coupon.store.name}
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
