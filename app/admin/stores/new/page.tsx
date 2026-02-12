import { createStore } from "../actions";
import { prisma } from "@/lib/prisma";

export default async function NewStorePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6">Create Store</h2>

      <form
        action={createStore}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block font-medium mb-1">Store Name</label>
          <input
            name="name"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Slug</label>
          <input
            name="slug"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Affiliate URL</label>
          <input
            name="affiliateUrl"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" />
          <label>Featured Store</label>
        </div>

        <div>
          <label className="block font-medium mb-1">Categories</label>
          <select name="categoryIds" multiple required className="w-full border rounded px-3 py-2">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button className="bg-gray-900 text-white px-4 py-2 rounded">
          Create Store
        </button>
      </form>
    </div>
  );
}
