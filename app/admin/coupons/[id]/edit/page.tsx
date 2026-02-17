export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCoupon } from "../../actions";
import { CouponStatus } from "@prisma/client";
import Link from "next/link";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  // Fetch coupon with categories
  const coupon = await prisma.coupon.findUnique({
    where: { id },
    include: {
      store: true,
      categories: true,
    },
  });

  if (!coupon) notFound();

  // Fetch stores
  const stores = await prisma.store.findMany({
    orderBy: { name: "asc" },
  });

  // Fetch all categories
  const allCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const selectedCategoryIds = coupon.categories.map(
    (c) => c.categoryId
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white border shadow-sm rounded-2xl p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Coupon
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Update coupon details, categories and status
            </p>
          </div>
          <Link
            href="/admin/coupons"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Coupons
          </Link>
        </div>

        <form action={updateCoupon} className="space-y-6">
          <input type="hidden" name="id" value={coupon.id} />

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              defaultValue={coupon.title}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              placeholder="e.g., Extra 50% Off Electronics"
            />
          </div>

          {/* Code */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Coupon Code
            </label>
            <input
              name="code"
              defaultValue={coupon.code ?? ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              placeholder="e.g., SAVE50"
            />
            <p className="text-xs text-gray-500">
              Leave empty for deal-only coupons (no code required)
            </p>
          </div>

          {/* Deal URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Deal URL
            </label>
            <input
              name="dealUrl"
              type="url"
              defaultValue={coupon.dealUrl ?? ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
              placeholder="https://example.com/deal"
            />
            <p className="text-xs text-gray-500">
              URL where users can claim this deal
            </p>
          </div>

          {/* Store Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Store <span className="text-red-500">*</span>
            </label>
            <select
              name="storeId"
              defaultValue={coupon.storeId}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              defaultValue={coupon.status}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            >
              <option value={CouponStatus.ACTIVE}>Active</option>
              <option value={CouponStatus.INACTIVE}>Inactive</option>
              <option value={CouponStatus.EXPIRED}>Expired</option>
              <option value={CouponStatus.SCHEDULED}>Scheduled</option>
            </select>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              defaultValue={
                coupon.expiryDate
                  ? coupon.expiryDate.toISOString().split("T")[0]
                  : ""
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            />
            <p className="text-xs text-gray-500">
              Optional: When this coupon expires
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Categories
            </label>
            <div className="border border-gray-300 rounded-xl p-6 bg-gray-50 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allCategories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white transition"
                  >
                    <input
                      type="checkbox"
                      name="categoryIds"
                      value={cat.id}
                      defaultChecked={selectedCategoryIds.includes(cat.id)}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>


          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
            >
              Update Coupon
            </button>
            <Link
              href="/admin/coupons"
              className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
