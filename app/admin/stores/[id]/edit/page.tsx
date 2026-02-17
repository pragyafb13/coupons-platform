export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateStore } from "../../actions";
import Link from "next/link";

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!store) notFound();

  const allCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const selectedCategoryIds = store.categories.map(
    (c) => c.category.id
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white border shadow-sm rounded-2xl p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Store</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update store information, categories, and settings
            </p>
          </div>
          <Link
            href="/admin/stores"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Stores
          </Link>
        </div>

        <form action={updateStore} className="space-y-6">
          <input type="hidden" name="id" value={store.id} />

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              defaultValue={store.name}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              placeholder="e.g., Amazon"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              name="slug"
              defaultValue={store.slug}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              placeholder="e.g., amazon"
            />
            <p className="text-xs text-gray-500">
              URL-friendly identifier (lowercase, no spaces)
            </p>
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              name="logo"
              type="url"
              defaultValue={store.logo || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              placeholder="https://example.com/logo.png"
            />
            {store.logo && (
              <div className="mt-2">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="h-16 w-auto object-contain border border-gray-200 rounded-lg p-2 bg-gray-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <p className="text-xs text-gray-500">
              Direct URL to the store's logo image
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={store.description || ""}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition resize-none"
              placeholder="Brief description of the store..."
            />
          </div>

          {/* Affiliate URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Affiliate URL
            </label>
            <input
              name="affiliateUrl"
              type="url"
              defaultValue={store.affiliateUrl || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              placeholder="https://example.com/affiliate-link"
            />
            <p className="text-xs text-gray-500">
              Optional affiliate tracking URL
            </p>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              defaultChecked={store.isFeatured}
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">
              Featured Store
            </label>
            <p className="text-xs text-gray-500 ml-auto">
              Featured stores appear prominently on the homepage
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Categories
            </label>
            <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allCategories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white transition"
                  >
                    <input
                      type="checkbox"
                      name="categoryIds"
                      value={cat.id}
                      defaultChecked={selectedCategoryIds.includes(cat.id)}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-gray-700 flex-1">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
            >
              Update Store
            </button>
            <Link
              href="/admin/stores"
              className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
