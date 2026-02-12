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

  for (const row of rows as Array<{ title?: string; code?: string; type?: string; deal_url?: string; expiry_date?: string; status?: string; is_verified?: string; storeId?: string; categories?: string }>) {
  if (!row.title || !row.storeId) continue;

  const categorySlugs = row.categories
    ? row.categories.split(",").map((c: string) => c.trim())
    : [];

  const categories = await prisma.category.findMany({
    where: {
      slug: { in: categorySlugs },
    },
  });
await prisma.coupon.create({
  data: {
    title: row.title,
    code: row.code || null,
    type: (row.type && ["code", "deal"].includes(row.type))
      ? (row.type as CouponType)
      : undefined,
    dealUrl: row.deal_url || null,
    expiryDate: row.expiry_date
      ? new Date(row.expiry_date)
      : null,
    status: row.status as CouponStatus | undefined,
    isVerified: row.is_verified === "true",
    storeId: row.storeId,
    categories: {
      connect: categories.map((c) => ({ id: c.id })),
    },
  },
});


  }
  await revalidatePath("/admin");
  return redirect("/admin");
}