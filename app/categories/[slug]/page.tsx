export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Grid3x3, ArrowLeft, Flame, CheckCircle2, Clock, Zap, Store as StoreIcon, Tag, TrendingUp } from "lucide-react";
import SaveCouponButton from "@/components/SaveCouponButton";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let category;
  let allCoupons: Array<{
    id: string;
    title: string;
    code: string | null;
    dealUrl: string | null;
    expiryDate: Date | null;
    isVerified: boolean;
    status: string;
    isActive: boolean;
    store: {
      id: string;
      name: string;
      logo: string | null;
    };
  }> = [];

  try {
    // First, get the category
    category = await prisma.category.findUnique({
      where: { slug },
      include: {
        stores: {
          include: {
            store: {
              include: {
                _count: {
                  select: {
                    coupons: {
                      where: {
                        status: "ACTIVE",
                        isActive: true,
                        categories: {
                          some: {
                            category: {
                              slug: slug,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!category) notFound();

    // Query coupons directly through CategoryCoupon for this category
    const categoryCoupons = await prisma.categoryCoupon.findMany({
      where: {
        categoryId: category.id,
      },
      include: {
        coupon: {
          include: {
            store: true,
          },
        },
      },
    });

    // Extract and filter coupons that are active
    allCoupons = categoryCoupons
      .map((cc) => cc.coupon)
      .filter((coupon): coupon is NonNullable<typeof coupon> => 
        coupon !== null && coupon.status === "ACTIVE" && coupon.isActive === true
      );
  } catch (error) {
    console.error("Error fetching category:", error);
    notFound();
  }

  if (!category) notFound();

  // Get unique stores for this category
  const uniqueStores = category.stores
    .map((cs) => cs.store)
    .filter((store, index, self) => 
      index === self.findIndex((s) => s.id === store.id)
    )
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Header Section */}
      <section className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-white hover:text-white mb-6 font-medium transition group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition" />
            Back to Categories
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <Grid3x3 className="h-5 w-5" />
              <span className="text-sm font-semibold">Category</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <Grid3x3 className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
                {category.name}
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Discover amazing deals and exclusive coupons in {category.name.toLowerCase()}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl sm:text-4xl font-extrabold mb-2 flex items-center justify-center gap-2">
                  <Tag className="h-6 w-6 sm:h-8 sm:w-8" />
                  {allCoupons.length}
                </div>
                <div className="text-white/80 text-sm sm:text-base font-medium">
                  Active Coupons
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl sm:text-4xl font-extrabold mb-2 flex items-center justify-center gap-2">
                  <StoreIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                  {uniqueStores.length}
                </div>
                <div className="text-white/80 text-sm sm:text-base font-medium">
                  Premium Stores
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 col-span-2 md:col-span-1">
                <div className="text-3xl sm:text-4xl font-extrabold mb-2 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8" />
                  100%
                </div>
                <div className="text-white/80 text-sm sm:text-base font-medium">
                  Verified Deals
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Featured Stores Section */}
        {uniqueStores.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <StoreIcon className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Popular Stores in {category.name}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {uniqueStores.map((store) => (
                <Link
                  key={store.id}
                  href={`/stores/${store.slug}`}
                  className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden"
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 w-full">
                    {store.logo ? (
                      <div className="mb-3 flex justify-center">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 p-2 group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src={store.logo}
                            alt={store.name}
                            width={80}
                            height={80}
                            className="object-contain w-full h-full opacity-90 group-hover:opacity-100 transition"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3 flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-indigo-200 transition">
                          <StoreIcon className="h-10 w-10 text-gray-500 group-hover:text-purple-600 transition" />
                        </div>
                      </div>
                    )}
                    <h3 className="font-extrabold text-sm text-gray-900 text-center mb-2 group-hover:text-purple-600 transition line-clamp-2">
                      {store.name}
                    </h3>
                    <div className="text-xs text-gray-600 text-center bg-gray-50 rounded-lg px-2 py-1 group-hover:bg-purple-50 transition">
                      {store._count.coupons} {store._count.coupons === 1 ? 'coupon' : 'coupons'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Coupons Section */}
        <section>
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                All {category.name} Coupons
              </h2>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {allCoupons.length} {allCoupons.length === 1 ? 'deal' : 'deals'} available
            </div>
          </div>

          {allCoupons.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-premium border-2 border-gray-200 p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Tag className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Coupons</h3>
              <p className="text-gray-600 mb-6">
                No active coupons found in this category at the moment.
              </p>
              <Link
                href="/coupons"
                className="inline-flex items-center gap-2 bg-purple-100 text-gray-900 px-6 py-3 rounded-xl font-extrabold hover:bg-purple-200 transition shadow-lg"
              >
                Browse All Coupons
                <span className="text-xl font-extrabold">→</span>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {allCoupons.map((coupon) => {
                const discountMatch = coupon.title.match(/\d+%/);
                const discount = discountMatch ? discountMatch[0] : null;

                return (
                  <Link
                    key={coupon.id}
                    href={`/coupons/${coupon.id}`}
                    className="group bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Premium Discount Badge */}
                    {discount && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-extrabold px-4 py-2 rounded-xl shadow-lg z-10 flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        {discount} OFF
                      </div>
                    )}

                    {/* Save + Verified Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                      <SaveCouponButton couponId={coupon.id} />
                      {coupon.isVerified && (
                        <div className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Store Logo/Name */}
                    <div className="flex items-center gap-4 mb-6 pr-24">
                      {coupon.store.logo ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 p-2 flex-shrink-0">
                          <Image
                            src={coupon.store.logo}
                            alt={coupon.store.name}
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                          <span className="font-extrabold text-gray-800 text-xl">
                            {coupon.store.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{coupon.store.name}</h4>
                      </div>
                    </div>

                    {/* Coupon Title */}
                    <h3 className="text-lg sm:text-xl font-extrabold mb-4 group-hover:text-red-600 transition line-clamp-2 min-h-[3.5rem] text-gray-900 leading-tight">
                      {coupon.title}
                    </h3>

                    {/* Coupon Code */}
                    {coupon.code && (
                      <div className="border-2 border-dashed border-yellow-500 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl py-4 text-center font-mono text-lg sm:text-xl mb-6 text-gray-900 font-extrabold tracking-wider shadow-inner">
                        {coupon.code}
                      </div>
                    )}

                    {/* Expiry Date */}
                    {coupon.expiryDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-2 mb-6">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span className="font-semibold">
                          Expires {new Date(coupon.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    )}

                    {/* Premium CTA Button */}
                    <div className={`text-center py-4 rounded-xl font-bold text-base sm:text-lg transition shadow-lg ${
                      coupon.code
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white group-hover:from-yellow-400 group-hover:to-orange-400"
                        : "bg-gradient-to-r from-gray-900 to-black text-white group-hover:from-red-500 group-hover:to-red-600"
                    }`}>
                      {coupon.code ? "Show Coupon →" : "Show Deal →"}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Related Categories Section */}
        <section className="mt-16 pt-16 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Explore More Categories
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 bg-purple-100 text-gray-900 px-6 py-3 rounded-xl font-extrabold hover:bg-purple-200 transition shadow-lg hover:shadow-xl"
            >
              <Grid3x3 className="h-5 w-5 text-gray-900" />
              View All Categories
            </Link>
            <Link
              href="/coupons"
              className="inline-flex items-center gap-2 bg-purple-100 text-gray-900 px-6 py-3 rounded-xl font-extrabold hover:bg-purple-200 transition shadow-lg hover:shadow-xl"
            >
              <Tag className="h-5 w-5 text-gray-900" />
              Browse All Coupons
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
