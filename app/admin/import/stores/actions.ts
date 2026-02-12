"use server";

import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function importStores(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const text = await file.text();

  const rows = parse(text, {
    columns: true,
    skip_empty_lines: true,
  });

  for (const row of rows as any[]) {
    if (!row.name || !row.slug) continue;

    // 1️⃣ Find categories by slug
    const categorySlugs =
      row.categories && typeof row.categories === "string"
        ? row.categories.split(",").map((c: string) => c.trim())
        : [];

    const categories = await prisma.category.findMany({
      where: {
        slug: { in: categorySlugs },
      },
    });
  
    // 2️⃣ Create or update store (NO category connect here)
    const store = await prisma.store.upsert({
      where: { slug: row.slug },
      update: {
        name: row.name,
        logo: row.logo || null,
        affiliateUrl: row.affiliate_url || null,
        description: row.description || null,
        isFeatured: row.is_featured === "true",
      },
      create: {
        name: row.name,
        slug: row.slug,
        logo: row.logo || null,
        affiliateUrl: row.affiliate_url || null,
        description: row.description || null,
        isFeatured: row.is_featured === "true",
      },
    });
  
    // 3️⃣ Remove old category relations (important)
    await prisma.categoryStore.deleteMany({
      where: { storeId: store.id },
    });
  
    // 4️⃣ Create new relations
    for (const category of categories) {
      await prisma.categoryStore.create({
        data: {
          categoryId: category.id,
          storeId: store.id,
        },
      });
    }
  }
  

  revalidatePath("/admin/stores");
  redirect("/admin/stores");
}
