"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateCoupon(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const storeId = formData.get("storeId") as string;

  const categoryIds = formData.getAll("categories") as string[];

  await prisma.coupon.update({
    where: { id },
    data: {
      title,
      storeId,
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
