"use server";

import { prisma } from "@/lib/prisma";
import { CouponType, CouponStatus } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const VALID_STATUSES = ["ACTIVE", "EXPIRED", "SCHEDULED", "INACTIVE"] as const;

export async function importCoupons(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      redirect("/admin/import/coupons?error=No+file+uploaded");
    }

    const text = await file.text();
    const rows = parse(text, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    }) as Record<string, unknown>[];

    let count = 0;
    let skipped = 0;

    for (const row of rows) {
      const title = String(row.title || "").trim();
      if (!title) continue;

      // Resolve store by store_slug or storeId
      let storeId = row.storeId as string | undefined;
      if (!storeId && row.store_slug) {
        const slug = String(row.store_slug).trim().toLowerCase();
        const store = await prisma.store.findUnique({ where: { slug } });
        if (!store) {
          skipped++;
          continue;
        }
        storeId = store.id;
      }
      if (!storeId) {
        skipped++;
        continue;
      }

      const categorySlugs =
        typeof row.categories === "string" && row.categories.trim().length > 0
          ? row.categories.split(",").map((c: string) => c.trim().toLowerCase())
          : [];

      const categories = await prisma.category.findMany({
        where: { slug: { in: categorySlugs } },
      });

      const code = row.code ? String(row.code).trim() || null : null;
      const typeVal = String(row.type || "code").toLowerCase();
      const type = ["code", "deal"].includes(typeVal)
        ? (typeVal.toUpperCase() as CouponType)
        : CouponType.CODE;

      let expiryDate: Date | null = null;
      if (row.expiry_date) {
        const d = new Date(String(row.expiry_date));
        if (!isNaN(d.getTime())) expiryDate = d;
      }

      const statusVal = String(row.status || "ACTIVE").toUpperCase();
      const status = VALID_STATUSES.includes(statusVal as (typeof VALID_STATUSES)[number])
        ? (statusVal as CouponStatus)
        : CouponStatus.ACTIVE;

      try {
        await prisma.coupon.create({
          data: {
            title,
            code,
            type,
            dealUrl: row.deal_url ? String(row.deal_url).trim() || null : null,
            expiryDate,
            status,
            isVerified: row.is_verified === "true" || row.is_verified === "1",
            storeId,
            categories: {
              connect: categories.map((c) => ({ id: c.id })),
            },
          },
        });
        count++;
      } catch (createErr: unknown) {
        const prismaErr = createErr as { code?: string };
        if (prismaErr.code === "P2002") {
          skipped++; // Duplicate storeId+code, skip
        } else {
          throw createErr;
        }
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/coupons");
    const params = new URLSearchParams({ imported: String(count) });
    if (skipped > 0) params.set("skipped", String(skipped));
    redirect(`/admin/import/coupons?${params.toString()}`);
  } catch (err) {
    const e = err as { digest?: string };
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("Import coupons error:", err);
    redirect("/admin/import/coupons?error=" + encodeURIComponent(String(err)));
  }
}