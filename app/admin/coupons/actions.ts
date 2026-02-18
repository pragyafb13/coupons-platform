"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
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

export async function createCoupon(formData: FormData) {
  try {
    const categoryIds = formData.getAll("categoryIds") as string[];

    await prisma.coupon.create({
      data: {
        title: formData.get("title") as string,
        code: (formData.get("code") as string) || null,
        dealUrl: formData.get("dealUrl") as string,
        storeId: formData.get("storeId") as string,
        status: formData.get("status") as CouponStatus,
        expiryDate: formData.get("expiryDate")
          ? new Date(formData.get("expiryDate") as string)
          : null,

        // 🔥 Attach Categories
        categories: {
          create: categoryIds.length > 0 ? categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })) : [],
        },
      },
    });

    revalidatePath("/admin/coupons");
    redirect("/admin/coupons");
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
}
