"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* -------------------------------------------------- */
/* CREATE STORE */
/* -------------------------------------------------- */
export async function createStore(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const affiliateUrl = formData.get("affiliateUrl") as string | null;
  const isFeatured = formData.get("isFeatured") === "on";

  const categoryIds = formData.getAll("categoryIds") as string[];

  if (!name || !slug) {
    throw new Error("Name and slug are required");
  }

  await prisma.store.create({
    data: {
      name,
      slug,
      affiliateUrl: affiliateUrl || null,
      isFeatured,
      categories: {
        create: categoryIds.map((categoryId) => ({
          category: {
            connect: { id: categoryId },
          },
        })),
      },
    },
  });

  revalidatePath("/admin/stores");
  redirect("/admin/stores");
}

/* -------------------------------------------------- */
/* UPDATE STORE */
/* -------------------------------------------------- */
export async function updateStore(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  const categoryIds = formData.getAll("categoryIds") as string[];

  if (!id) throw new Error("Store ID is required");

  // Update main store fields
  await prisma.store.update({
    where: { id },
    data: {
      name,
      slug,
    },
  });

  // Remove old category relations
  await prisma.categoryStore.deleteMany({
    where: { storeId: id },
  });

  // Add new category relations
  if (categoryIds.length > 0) {
    await prisma.categoryStore.createMany({
      data: categoryIds.map((categoryId) => ({
        storeId: id,
        categoryId,
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/admin/stores");
  redirect("/admin/stores");
}

/* -------------------------------------------------- */
/* TOGGLE FEATURED */
/* -------------------------------------------------- */
export async function toggleFeaturedAction(storeId: string) {
  if (!storeId) return;

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { isFeatured: true },
  });

  if (!store) return;

  await prisma.store.update({
    where: { id: storeId },
    data: {
      isFeatured: !store.isFeatured,
    },
  });

  revalidatePath("/admin/stores");
}
/* -------------------------------------------------- */
/* DELETE STORE */
/* -------------------------------------------------- */
export async function deleteStore(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) throw new Error("Store ID is required");

  try {
    // 1️⃣ Remove category relations
    await prisma.categoryStore.deleteMany({
      where: { storeId: id },
    });

    // 2️⃣ Remove coupons of this store
    await prisma.coupon.deleteMany({
      where: { storeId: id },
    });

    // 3️⃣ Delete store
    await prisma.store.delete({
      where: { id },
    });

    revalidatePath("/admin/stores");

    // ✅ Redirect after delete
    redirect("/admin/stores");

  } catch (error) {
    console.error("Delete store failed:", error);
    throw new Error("Failed to delete store");
  }
}

