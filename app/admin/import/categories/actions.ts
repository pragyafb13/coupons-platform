"use server";

import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type CategoryRow = { name?: string; slug?: string };

export async function importCategories(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      redirect("/admin/import/categories?error=No+file+uploaded");
    }

    const text = await file.text();
    const rows = parse(text, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    }) as CategoryRow[];

    let count = 0;
    for (const row of rows) {
      const name = String(row.name || "").trim();
      const slug = String(row.slug || "").trim().toLowerCase().replace(/\s+/g, "-");
      if (!name || !slug) continue;

      await prisma.category.upsert({
        where: { slug },
        update: { name },
        create: { name, slug },
      });
      count++;
    }

    revalidatePath("/admin/categories");
    redirect(`/admin/import/categories?imported=${count}`);
  } catch (err) {
    const e = err as { digest?: string };
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("Import categories error:", err);
    redirect("/admin/import/categories?error=" + encodeURIComponent(String(err)));
  }
}
