"use server";

import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type StoreRow = {
  categories?: string | null;
  name?: string;
  slug?: string;
  logo?: string | null;
  affiliate_url?: string | null;
  description?: string | null;
  is_featured?: string;
};

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export async function importStores(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      redirect("/admin/import/stores?error=No+file+uploaded");
    }

    const text = await file.text();
    const rows = parse(text, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    }) as StoreRow[];

    let count = 0;
    for (const row of rows) {
      const name = String(row.name || "").trim();
      const slug = slugify(row.slug || row.name || "");
      if (!name || !slug) continue;

      const categorySlugs =
        typeof row.categories === "string" && row.categories.trim().length > 0
          ? row.categories.split(",").map((c: string) => c.trim().toLowerCase())
          : [];

      const categories = await prisma.category.findMany({
        where: { slug: { in: categorySlugs } },
      });

      const store = await prisma.store.upsert({
        where: { slug },
        update: {
          name,
          logo: row.logo?.trim() || null,
          affiliateUrl: row.affiliate_url?.trim() || null,
          description: row.description?.trim() || null,
          isFeatured: row.is_featured === "true" || row.is_featured === "1",
        },
        create: {
          name,
          slug,
          logo: row.logo?.trim() || null,
          affiliateUrl: row.affiliate_url?.trim() || null,
          description: row.description?.trim() || null,
          isFeatured: row.is_featured === "true" || row.is_featured === "1",
        },
      });

      await prisma.categoryStore.deleteMany({ where: { storeId: store.id } });
      for (const cat of categories) {
        await prisma.categoryStore.create({
          data: { categoryId: cat.id, storeId: store.id },
        });
      }
      count++;
    }

    revalidatePath("/admin/stores");
    redirect(`/admin/import/stores?imported=${count}`);
  } catch (err) {
    console.error("Import stores error:", err);
    redirect("/admin/import/stores?error=" + encodeURIComponent(String(err)));
  }
}
