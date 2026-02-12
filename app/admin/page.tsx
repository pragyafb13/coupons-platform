import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Counter from "@/components/Counter";
import { toggleFeatured, deleteStore } from "./actions";
import { Store, TicketPercent, CheckCircle } from "lucide-react";

export default async function AdminDashboard() {
  const [stores, totalCoupons, activeCoupons] = await Promise.all([
    prisma.store.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.coupon.count(),
    prisma.coupon.count({
      where: { status: "ACTIVE" },
    }),
  ]);

  return (
    <div className="space-y-12">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Monitor and manage your coupon platform performance.
          </p>
        </div>
      </div>

      {/* Premium Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <PremiumStatCard
          icon={<Store size={18} />}
          label="Total Stores"
          value={<Counter value={stores.length} />}
        />
        <PremiumStatCard
          icon={<TicketPercent size={18} />}
          label="Total Coupons"
          value={<Counter value={totalCoupons} />}
        />
        <PremiumStatCard
          icon={<CheckCircle size={18} />}
          label="Active Coupons"
          value={<Counter value={activeCoupons} />}
        />
      </div>

      {/* Stores Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Stores
          </h2>

          <Link
            href="/admin/stores/new"
            className="inline-flex items-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition shadow-sm"
          >
            + Add Store
          </Link>
        </div>

        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-medium">
                  Store
                </th>
                <th className="px-6 py-4 text-left font-medium">
                  Slug
                </th>
                <th className="px-6 py-4 text-left font-medium">
                  Featured
                </th>
                <th className="px-6 py-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {stores.map((store) => (
                <tr
                  key={store.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {store.name}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    /{store.slug}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          store.isFeatured
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {store.isFeatured ? "Featured" : "Not Featured"}
                      </span>

                      <form
                        action={async () => {
                          "use server";
                          await toggleFeatured(store.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Toggle
                        </button>
                      </form>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/stores/${store.id}/edit`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <form action={deleteStore}>
  <input type="hidden" name="id" value={store.id} />
  <button
    type="submit"
    className="text-sm font-medium text-red-600 hover:underline"
  >
    Delete
  </button>
</form>

                    </div>
                  </td>
                </tr>
              ))}

              {stores.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="space-y-2">
                      <p className="font-medium">
                        No stores yet
                      </p>
                      <p className="text-sm">
                        Start by adding your first store.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ---------- Premium Stat Card ---------- */

function PremiumStatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border shadow-sm p-6 hover:shadow-md transition">
      
      <div className="flex items-center gap-3 text-gray-500 text-sm">
        <div className="p-2 rounded-lg bg-gray-100">
          {icon}
        </div>
        {label}
      </div>

      <div className="mt-4 text-4xl font-bold text-gray-900">
        {value}
      </div>

      {/* subtle accent line */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-black to-gray-400" />
    </div>
  );
}
