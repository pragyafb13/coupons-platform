"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleFeatured(storeId: string) {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) return;

  await prisma.store.update({
    where: { id: storeId },
    data: {
      isFeatured: !store.isFeatured,
    },
  });
}

export async function deleteStore(formData: FormData) {
  const id = formData.get("id") as string;

  await prisma.categoryStore.deleteMany({
    where: { storeId: id },
  });

  await prisma.coupon.deleteMany({
    where: { storeId: id },
  });

  await prisma.store.delete({
    where: { id },
  });

  revalidatePath("/admin");
}