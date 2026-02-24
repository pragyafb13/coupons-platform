"use server";

import { prisma } from "@/lib/prisma";
import { CouponType, CouponStatus } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function importCoupons(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const text = await file.text();

  const rows = parse(text, {
    columns: true,
    skip_empty_lines: true,
  });

  for (const row of rows as any[]) {
    if (!row.title) continue;

    // Resolve store: use storeId if provided, else lookup by store_slug
    let storeId = row.storeId as string | undefined;
    if (!storeId && row.store_slug) {
      const store = await prisma.store.findUnique({
        where: { slug: String(row.store_slug).trim() },
      });
      if (!store) continue;
      storeId = store.id;
    }
    if (!storeId) continue;

    const categorySlugs =
      typeof row.categories === "string" && row.categories.trim().length > 0
        ? row.categories.split(",").map((c: string) => c.trim())
        : [];

    const categories = await prisma.category.findMany({
      where: { slug: { in: categorySlugs } },
    });

    await prisma.coupon.create({
      data: {
        title: row.title,
        code: row.code || null,
        type: (row.type && ["code", "deal"].includes(String(row.type).toLowerCase()))
          ? (String(row.type).toUpperCase() as CouponType)
          : CouponType.CODE,
        dealUrl: row.deal_url || null,
        expiryDate: row.expiry_date ? new Date(row.expiry_date) : null,
        status: (row.status as CouponStatus) || CouponStatus.ACTIVE,
        isVerified: row.is_verified === "true",
        storeId,
        categories: {
          connect: categories.map((c) => ({ id: c.id })),
        },
      },
    });
  }
  await revalidatePath("/admin");
  return redirect("/admin");
}