import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createStore(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const affiliateUrl = formData.get("affiliateUrl") as string;
  const isFeatured = formData.get("isFeatured") === "on";

  // multi-select support
  const categoryIds = formData.getAll("categoryIds") as string[];

  if (!name || !slug) {
    throw new Error("Name and slug are required");
  }

  await prisma.store.create({
    data: {
      name,
      slug,
      affiliateUrl: affiliateUrl || null,
      isFeatured,

      categories: {
        create: categoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      },
    },
  });

  redirect("/admin/stores");
}
