import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { toggleFeaturedAction, deleteStore } from "./actions";

export default async function AdminStoresPage() {
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Stores</h2>

      <div className="mb-4">
        <Link
          href="/admin/stores/new"
          className="inline-block bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Create Store
        </Link>
      </div>

      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Slug</th>
            <th className="text-left px-4 py-3">Featured</th>
            <th className="text-left px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {stores.map((store) => (
            <tr
              key={store.id}
              className="border-b last:border-none hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium">{store.name}</td>
              <td className="px-4 py-3 text-gray-700">{store.slug}</td>

              <td className="px-4 py-3 flex items-center gap-3">
                <span>{store.isFeatured ? "✅ Yes" : "—"}</span>

                <form action={toggleFeaturedAction.bind(null, store.id)}>
                  <button
                    type="submit"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Toggle
                  </button>
                </form>
              </td>

              <td className="px-4 py-3 flex gap-3">
                <Link
                  href={`/admin/stores/${store.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>

                <form action={deleteStore}>
  <input type="hidden" name="id" value={store.id} />
  <button
    type="submit"
    className="text-red-600 hover:underline"
  >
    Delete
  </button>
</form>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
