"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CouponStatus } from "@prisma/client";
import Link from "next/link";

// ---------------------
// Server Action
// ---------------------
export async function createCoupon(formData: FormData) {
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
        create: categoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      },
    },
  });

  revalidatePath("/admin/coupons");
}

// ---------------------
// Page
// ---------------------
export default async function CreateCouponPage() {
  const stores = await prisma.store.findMany({
    orderBy: { name: "asc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Create New Coupon</h1>

      <Link href="/admin/coupons" className="text-blue-600 hover:underline">
        ← Back to Coupons List
      </Link>

      <form action={createCoupon} className="space-y-4">
        <input name="title" placeholder="Coupon Title" required className="input" />

        <input name="code" placeholder="Coupon Code (optional)" className="input" />

        <input name="dealUrl" placeholder="Deal URL" required className="input" />

        <select name="storeId" required className="input">
          <option value="">Select Store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>

        {/* 🔥 CATEGORY MULTI-SELECT */}
        <select name="categoryIds" multiple className="input h-40">
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select name="status" required className="input">
          <option value={CouponStatus.ACTIVE}>Active</option>
          <option value={CouponStatus.INACTIVE}>Inactive</option>
          <option value={CouponStatus.EXPIRED}>Expired</option>
          <option value={CouponStatus.SCHEDULED}>Scheduled</option>
        </select>

        <input type="date" name="expiryDate" className="input" />

        <button className="btn-primary w-full">Create Coupon</button>
      </form>
    </div>
  );
}
