"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CouponStatus } from "@prisma/client";

export async function updateCoupon(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const code = formData.get("code") as string | null;
  const dealUrl = formData.get("dealUrl") as string | null;
  const storeId = formData.get("storeId") as string;
  const status = formData.get("status") as CouponStatus;
  const expiryDateStr = formData.get("expiryDate") as string | null;
  
  // Fix: Use "categoryIds" instead of "categories"
  const categoryIds = formData.getAll("categoryIds") as string[];

  await prisma.coupon.update({
    where: { id },
    data: {
      title,
      code: code || null,
      dealUrl: dealUrl || null,
      storeId,
      status,
      expiryDate: expiryDateStr ? new Date(expiryDateStr) : null,
    },
  });

  // Remove old relations
  await prisma.categoryCoupon.deleteMany({
    where: { couponId: id },
  });

  // Add new ones
  if (categoryIds.length > 0) {
    await prisma.categoryCoupon.createMany({
      data: categoryIds.map((categoryId) => ({
        couponId: id,
        categoryId,
      })),
    });
  }

  redirect("/admin/coupons");
}
