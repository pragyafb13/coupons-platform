import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Store as StoreIcon, Star, Sparkles, TrendingUp } from "lucide-react";

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    include: {
      coupons: {
        where: {
          status: "ACTIVE",
          isActive: true,
        },
      },
      _count: {
        select: {
          coupons: {
            where: {
              status: "ACTIVE",
              isActive: true,
            },
          },
        },
      },
    },
    orderBy: [
      { isFeatured: "desc" },
      { name: "asc" }
    ],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Header Section */}
      <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <StoreIcon className="h-5 w-5" />
              <span className="text-sm font-semibold">Premium Stores</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
              All Stores
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Browse {stores.length}+ stores with exclusive deals and coupons
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {stores.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-premium border-2 border-gray-200 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <StoreIcon className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-xl">No stores available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {stores.map((store) => (
              <Link
                key={store.id}
                href={`/stores/${store.slug}`}
                className="group bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Featured Badge */}
                {store.isFeatured && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 z-10 shadow-lg">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </div>
                )}

                <div className="relative z-10 w-full">
                  {/* Store Logo */}
                  {store.logo ? (
                    <div className="mb-4 flex justify-center">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 p-3 group-hover:scale-110 transition-transform duration-300">
                        <Image
                          src={store.logo}
                          alt={store.name}
                          width={96}
                          height={96}
                          className="object-contain w-full h-full opacity-90 group-hover:opacity-100 transition"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 flex justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition">
                        <StoreIcon className="h-12 w-12 text-gray-500 group-hover:text-blue-600 transition" />
                      </div>
                    </div>
                  )}

                  {/* Store Name */}
                  <h3 className="font-extrabold text-base sm:text-lg text-gray-900 text-center mb-3 group-hover:text-blue-600 transition line-clamp-2">
                    {store.name}
                  </h3>

                  {/* Coupon Count */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 group-hover:bg-blue-50 transition">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">
                      {store._count.coupons} {store._count.coupons === 1 ? 'coupon' : 'coupons'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
