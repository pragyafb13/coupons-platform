import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateStore } from "../../actions";

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
    (c) => c.categoryId
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold">Edit Store</h1>

      <form action={updateStore} className="space-y-6">
        <input type="hidden" name="id" value={store.id} />

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            defaultValue={store.name}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            name="slug"
            defaultValue={store.slug}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Categories
          </label>

          <div className="grid grid-cols-2 gap-3">
            {allCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={cat.id}
                  defaultChecked={selectedCategoryIds.includes(cat.id)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded-md">
          Update Store
        </button>
      </form>
    </div>
  );
}
