"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* -------------------------------------------------- */
/* CREATE BANNER */
/* -------------------------------------------------- */
export async function createBanner(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const isActive = formData.get("isActive") === "on";
    const positionStr = formData.get("position") as string;
    const position = positionStr ? parseInt(positionStr) : 0;

    if (!title || !imageUrl || !linkUrl) {
      throw new Error("Title, image URL, and link URL are required");
    }

    await prisma.banner.create({
      data: {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl.trim(),
        isActive,
        position: isNaN(position) ? 0 : position,
      },
    });

    revalidatePath("/admin/banners");
    revalidatePath("/");
    redirect("/admin/banners");
  } catch (error) {
    console.error("Error creating banner:", error);
    throw error;
  }
}

/* -------------------------------------------------- */
/* UPDATE BANNER */
/* -------------------------------------------------- */
export async function updateBanner(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const linkUrl = formData.get("linkUrl") as string;
  const isActive = formData.get("isActive") === "on";
  const position = parseInt(formData.get("position") as string) || 0;

  if (!id || !title || !imageUrl || !linkUrl) {
    throw new Error("ID, title, image URL, and link URL are required");
  }

  await prisma.banner.update({
    where: { id },
    data: {
      title,
      imageUrl,
      linkUrl,
      isActive,
      position,
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

/* -------------------------------------------------- */
/* DELETE BANNER */
/* -------------------------------------------------- */
export async function deleteBanner(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Banner ID is required");
  }

  await prisma.banner.delete({
    where: { id },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

/* -------------------------------------------------- */
/* TOGGLE ACTIVE STATUS */
/* -------------------------------------------------- */
export async function toggleBannerActive(id: string) {
  const banner = await prisma.banner.findUnique({
    where: { id },
  });

  if (!banner) {
    throw new Error("Banner not found");
  }

  await prisma.banner.update({
    where: { id },
    data: {
      isActive: !banner.isActive,
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
}
