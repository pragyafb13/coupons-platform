"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CouponStatus } from "@prisma/client";

export async function submitCoupon(formData: FormData) {
  const storeName = formData.get("store") as string;
  const title = formData.get("title") as string;
  const code = formData.get("code") as string | null;
  const dealUrl = formData.get("url") as string;
  const expiryDateStr = formData.get("expiry") as string | null;
  const description = formData.get("description") as string | null;

  if (!storeName || !title || !dealUrl) {
    throw new Error("Store name, title, and deal URL are required");
  }

  // Find or create store
  let store = await prisma.store.findFirst({
    where: {
      name: {
        equals: storeName,
        mode: "insensitive",
      },
    },
  });

  if (!store) {
    // Create a slug from the store name
    const slug = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    store = await prisma.store.create({
      data: {
        name: storeName,
        slug,
        isFeatured: false,
      },
    });
  }

  // Create coupon with INACTIVE status (needs admin approval)
  await prisma.coupon.create({
    data: {
      title,
      code: code || null,
      dealUrl,
      storeId: store.id,
      status: CouponStatus.INACTIVE, // Submitted coupons start as inactive
      expiryDate: expiryDateStr ? new Date(expiryDateStr) : null,
    },
  });

  revalidatePath("/submit-coupon");
  revalidatePath("/admin/coupons");
  
  // Redirect to a success page or show success message
  redirect("/submit-coupon?success=true");
}
