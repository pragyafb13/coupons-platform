"use server";

import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function importCategories(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) throw new Error("No file uploaded");

  const text = await file.text();

  const rows = parse(text, {
    columns: true,
    skip_empty_lines: true,
  });

  for (const row of rows as any[]) {
    if (!row.name || !row.slug) continue;

    await prisma.category.upsert({
      where: { slug: row.slug },
      update: { name: row.name },
      create: {
        name: row.name,
        slug: row.slug,
      },
    });
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
