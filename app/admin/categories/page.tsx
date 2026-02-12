import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function createCategory(formData: FormData) {
  "use server"; // ✅ put it INSIDE the function

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  await prisma.category.create({
    data: { name, slug },
  });

  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <h1 className="text-2xl font-bold">Manage Categories</h1>

      <form action={createCategory} className="space-y-4">
        <input
          name="name"
          placeholder="Category Name"
          required
          className="input"
        />

        <input
          name="slug"
          placeholder="category-slug"
          required
          className="input"
        />

        <button className="btn-primary w-full">
          Add Category
        </button>
      </form>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 border rounded flex justify-between"
          >
            <span>{cat.name}</span>
            <span className="text-gray-500 text-sm">
              {cat.slug}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
