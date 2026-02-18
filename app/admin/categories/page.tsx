export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { createCategory } from "./actions";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function AdminCategoriesPage() {
  let categories: Array<{ id: string; name: string; slug: string }> = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    categories = [];
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="bg-white border shadow-sm rounded-2xl p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create, edit, and delete product categories
            </p>
          </div>
        </div>

        {/* Create Form */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Category</h2>
          <form action={createCategory} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  placeholder="e.g., Electronics"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  name="slug"
                  placeholder="e.g., electronics"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
            >
              Create Category
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Categories ({categories.length})
          </h2>

          {categories.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No categories created yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Slug</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{cat.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {cat.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/admin/categories/${cat.id}/edit`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                          >
                            Edit
                          </Link>
                          <DeleteButton categoryId={cat.id} categoryName={cat.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
