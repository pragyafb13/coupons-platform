import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          stores: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Browse Categories
      </h1>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold mb-4">
              {category.name}
            </h2>

            <div className="text-gray-600 text-sm">
              {category._count.stores} Stores
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
