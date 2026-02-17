export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCategory } from "../../actions";
import Link from "next/link";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) notFound();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white border shadow-sm rounded-2xl p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update category information
            </p>
          </div>
          <Link
            href="/admin/categories"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Categories
          </Link>
        </div>

        <form action={updateCategory} className="space-y-6">
          <input type="hidden" name="id" value={category.id} />

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              defaultValue={category.name}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              placeholder="e.g., Electronics"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              name="slug"
              defaultValue={category.slug}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              placeholder="e.g., electronics"
            />
            <p className="text-xs text-gray-500">
              URL-friendly identifier (lowercase, no spaces)
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
            >
              Update Category
            </button>
            <Link
              href="/admin/categories"
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
