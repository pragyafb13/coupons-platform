import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Grid3x3, Store as StoreIcon, Tag, Sparkles } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          stores: true,
          coupons: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Header Section */}
      <section className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <Grid3x3 className="h-5 w-5" />
              <span className="text-sm font-semibold">Browse Categories</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
              All Categories
      </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Explore deals by category - {categories.length} categories available
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {categories.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-premium border-2 border-gray-200 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Grid3x3 className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-xl">No categories available.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
                className="group bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-8 shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-6 group-hover:from-purple-200 group-hover:to-purple-300 transition shadow-lg">
                    <Grid3x3 className="h-10 w-10 text-purple-600" />
                  </div>
                  
                  {/* Category Name */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-gray-900 group-hover:text-purple-600 transition">
              {category.name}
            </h2>

                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 group-hover:bg-purple-50 transition">
                      <StoreIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">
                        {category._count.stores} {category._count.stores === 1 ? 'Store' : 'Stores'}
                      </span>
                    </div>
                    {category._count.coupons > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 group-hover:bg-purple-50 transition">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">
                          {category._count.coupons} {category._count.coupons === 1 ? 'Coupon' : 'Coupons'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* View Link */}
                  <div className="mt-6 flex items-center gap-2 text-purple-600 font-bold text-sm group-hover:text-purple-700 transition">
                    <span>View Deals</span>
                    <span className="text-lg">→</span>
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
