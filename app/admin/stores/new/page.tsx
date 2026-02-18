export const dynamic = "force-dynamic";

import { createStore } from "../actions";
import { prisma } from "@/lib/prisma";

export default async function NewStorePage() {
  let categories = [];
  
  try {
    categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    categories = [];
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Store</h2>
        <p className="text-gray-600">
          Add a new store to the platform
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form action={createStore} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              required
              placeholder="e.g., Amazon"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              name="slug"
              required
              placeholder="e.g., amazon"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            />
            <p className="text-xs text-gray-500">
              URL-friendly identifier (lowercase, no spaces)
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Affiliate URL
            </label>
            <input
              name="affiliateUrl"
              type="url"
              placeholder="https://example.com/affiliate-link"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            />
            <p className="text-xs text-gray-500">
              Optional affiliate tracking URL
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">
              Featured Store
            </label>
            <p className="text-xs text-gray-500 ml-auto">
              Featured stores appear prominently on the homepage
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Categories <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-sm">No categories available. Please create categories first.</p>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-white cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        name="categoryIds"
                        value={category.id}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black cursor-pointer flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-gray-700 flex-1">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
            >
              Create Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
