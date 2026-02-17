import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function StoreDetailPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) return notFound();

  const store = await prisma.store.findUnique({
    where: { slug },
    include: { 
      coupons: {
        where: {
          status: "ACTIVE",
          isActive: true,
        },
        orderBy: [
          { isVerified: "desc" },
          { createdAt: "desc" }
        ],
      },
    },
  });

  if (!store) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Store Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {store.logo && (
            <div className="flex-shrink-0">
              <Image
                src={store.logo}
                alt={store.name}
                width={120}
                height={60}
                className="object-contain max-h-16 sm:max-h-20"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {store.name}
            </h1>
            {store.description && (
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {store.description}
              </p>
            )}
            {store.affiliateUrl && (
              <a
                href={store.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Visit Store →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Coupons Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Available Coupons
          </h2>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            {store.coupons.length} {store.coupons.length === 1 ? 'coupon' : 'coupons'}
          </span>
        </div>

        {store.coupons.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No active coupons available for this store.</p>
            <Link
              href="/stores"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse other stores →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.coupons.map((coupon) => {
              const discountMatch = coupon.title.match(/\d+%/);
              const discount = discountMatch ? discountMatch[0] : null;

              return (
                <Link
                  key={coupon.id}
                  href={`/coupons/${coupon.id}`}
                  className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
                >
                  {/* DISCOUNT BADGE */}
                  {discount && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg z-10">
                      {discount} OFF
                    </div>
                  )}

                  <h3 className="text-base sm:text-lg font-bold mb-3 group-hover:text-red-500 transition line-clamp-2 min-h-[3rem] text-gray-900 pr-16">
                    {coupon.title}
                  </h3>

                  {coupon.code && (
                    <div className="border-2 border-dashed border-yellow-400 bg-yellow-50 rounded-lg py-3 text-center font-mono text-sm sm:text-base mb-4 text-gray-900 font-bold tracking-wider">
                      {coupon.code}
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-gray-900 to-black text-white text-center py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base group-hover:from-red-500 group-hover:to-red-600 transition shadow-md">
                    Get Deal →
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Back Link */}
      <Link
        href="/stores"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
      >
        ← Back to all stores
      </Link>
    </div>
  );
}
