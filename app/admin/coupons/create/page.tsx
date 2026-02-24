export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CouponStatus } from "@prisma/client";
import { createCoupon } from "../actions";

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
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Create New Coupon</h1>

      <Link href="/admin/coupons" className="text-blue-600 hover:underline">
        ← Back to Coupons List
      </Link>

      <form action={createCoupon} className="space-y-6 bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coupon Title <span className="text-red-500">*</span>
          </label>
          <input 
            name="title" 
            placeholder="e.g., 20% Off on Electronics" 
            required 
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coupon Code (optional)
          </label>
          <input 
            name="code" 
            placeholder="Enter coupon code" 
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal URL <span className="text-red-500">*</span>
          </label>
          <input 
            name="dealUrl" 
            placeholder="https://store.com/deal" 
            required 
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store <span className="text-red-500">*</span>
          </label>
          <select name="storeId" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition">
          <option value="">Select Store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        </div>

        {/* 🔥 CATEGORY MULTI-SELECT WITH CHECKBOXES */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Categories (Select multiple)
          </label>
          <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
            {categories.length === 0 ? (
              <p className="text-gray-500 text-sm">No categories available. Please create categories first.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-white cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      name="categoryIds"
                      value={cat.id}
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 flex-1">{cat.name}</span>
                  </label>
          ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select one or more categories for this coupon
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select name="status" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition">
          <option value={CouponStatus.ACTIVE}>Active</option>
          <option value={CouponStatus.INACTIVE}>Inactive</option>
          <option value={CouponStatus.EXPIRED}>Expired</option>
          <option value={CouponStatus.SCHEDULED}>Scheduled</option>
        </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input 
            type="date" 
            name="expiryDate" 
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition" 
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
        >
          Create Coupon
        </button>
      </form>
    </div>
  );
}
