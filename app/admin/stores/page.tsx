export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { toggleFeaturedAction, deleteStore } from "./actions";

export default async function AdminStoresPage() {
  let stores: Array<{
    id: string;
    name: string;
    slug: string;
    isFeatured: boolean;
    categories: Array<{ category: { id: string; name: string } }>;
  }> = [];

  try {
    stores = await prisma.store.findMany({
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    stores = [];
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
    <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Stores</h2>
          <p className="text-gray-600">Manage all stores on the platform</p>
        </div>
        <Link
          href="/admin/stores/new"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
        >
          <span>+</span> Create Store
        </Link>
      </div>

      {stores.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-6 text-lg">No stores created yet.</p>
          <Link
            href="/admin/stores/new"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            <span>+</span> Create Your First Store
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Slug</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Categories</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Featured</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr
              key={store.id}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
            >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{store.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {store.slug}
                    </code>
                  </td>
              
                  <td className="px-6 py-4">
                {store.categories && store.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                    {store.categories.map((sc) => (
                      <span
                        key={sc.category.id}
                            className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                      >
                        {sc.category.name}
                      </span>
                    ))}
                  </div>
                ) : (
                      <span className="text-gray-400 text-sm">No categories</span>
                )}
              </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        store.isFeatured 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {store.isFeatured ? "✓ Featured" : "—"}
                      </span>
                      <form action={toggleFeaturedAction.bind(null, store.id)} className="inline">
                  <button
                    type="submit"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                  >
                    Toggle
                  </button>
                </form>
                    </div>
              </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                <Link
                  href={`/admin/stores/${store.id}/edit`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                >
                  Edit
                </Link>
                      <form action={deleteStore} className="inline">
  <input type="hidden" name="id" value={store.id} />
  <button
    type="submit"
                          className="text-sm font-medium text-red-600 hover:text-red-800 transition"
  >
    Delete
  </button>
</form>
                    </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      )}
    </div>
  );
}
