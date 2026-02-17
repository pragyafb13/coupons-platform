"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* -------------------------------------------------- */
/* CREATE CATEGORY */
/* -------------------------------------------------- */
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) {
    throw new Error("Name and slug are required");
  }

  await prisma.category.create({
    data: { name, slug },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

/* -------------------------------------------------- */
/* UPDATE CATEGORY */
/* -------------------------------------------------- */
export async function updateCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!id || !name || !slug) {
    throw new Error("ID, name, and slug are required");
  }

  await prisma.category.update({
    where: { id },
    data: { name, slug },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

/* -------------------------------------------------- */
/* DELETE CATEGORY */
/* -------------------------------------------------- */
export async function deleteCategory(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Category ID is required");
  }

  try {
    // Delete category relations first
    await prisma.categoryStore.deleteMany({
      where: { categoryId: id },
    });

    await prisma.categoryCoupon.deleteMany({
      where: { categoryId: id },
    });

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    redirect("/admin/categories");
  } catch (error) {
    console.error("Delete category failed:", error);
    throw new Error("Failed to delete category");
  }
}
