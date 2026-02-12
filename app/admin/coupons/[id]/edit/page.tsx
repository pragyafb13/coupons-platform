import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCoupon } from "../../actions";
import { CouponStatus } from "@prisma/client";

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
    <div className="max-w-3xl mx-auto py-12">
      <div className="bg-white border shadow-sm rounded-2xl p-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Coupon
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update coupon details, categories and status
          </p>
        </div>

        <form action={updateCoupon} className="space-y-6">
          <input type="hidden" name="id" value={coupon.id} />

          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <input
              name="title"
              defaultValue={coupon.title}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Code */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Coupon Code</label>
            <input
              name="code"
              defaultValue={coupon.code ?? ""}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Deal URL */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Deal URL</label>
            <input
              name="dealUrl"
              defaultValue={coupon.dealUrl ?? ""}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Store Select */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Store</label>
            <select
              name="storeId"
              defaultValue={coupon.storeId}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              defaultValue={coupon.status}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            >
              <option value={CouponStatus.ACTIVE}>Active</option>
              <option value={CouponStatus.INACTIVE}>Inactive</option>
              <option value={CouponStatus.EXPIRED}>Expired</option>
              <option value={CouponStatus.SCHEDULED}>Scheduled</option>
            </select>
          </div>

          {/* Expiry Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              defaultValue={
                coupon.expiryDate
                  ? coupon.expiryDate.toISOString().split("T")[0]
                  : ""
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* Categories */}
            <div className="space-y-3">
  <label className="text-sm font-medium">Categories</label>

  <div className="flex flex-wrap gap-3 border rounded-xl p-6 bg-gray-50 w-full max-h-[300px] overflow-y-auto overflow-x-hidden">
  {allCategories.map((cat) => (
      <label key={cat.id} className="cursor-pointer">
        
        <input
          type="checkbox"
          name="categoryIds"
          value={cat.id}
          defaultChecked={selectedCategoryIds.includes(cat.id)}
          className="peer sr-only"
        />

        <span className="
          inline-block px-4 py-2 rounded-full border text-sm transition whitespace-nowrap
          bg-white text-gray-700 border-gray-300
          peer-checked:bg-black peer-checked:text-white peer-checked:border-black
        ">
          {cat.name}
        </span>

      </label>
    ))}
  </div>
</div>


          {/* Submit */}
          <button className="w-full bg-black text-white rounded-lg py-2.5 font-medium hover:opacity-90 transition">
            Update Coupon
          </button>
        </form>
      </div>
    </div>
  );
}
