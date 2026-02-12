// app/admin/coupons/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CouponsPage() {
  // Fetch all coupons
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { store: true }, // include store info
  });

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Coupons</h1>

      <Link
        href="/admin/coupons/create"
        className="btn-primary px-4 py-2"
      >
        + Create New Coupon
      </Link>

      {coupons.length === 0 ? (
        <p>No coupons found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">Code</th>
              <th className="border px-4 py-2 text-left">Store</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Expiry</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{coupon.title}</td>
                <td className="border px-4 py-2">{coupon.code ?? "-"}</td>
                <td className="border px-4 py-2">{coupon.store?.name ?? "-"}</td>
                <td className="border px-4 py-2">{coupon.status}</td>
                <td className="border px-4 py-2">
                  {coupon.expiryDate ? coupon.expiryDate.toISOString().split("T")[0] : "-"}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <Link
                    href={`/admin/coupons/${coupon.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  {/* You can add Delete action here later */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
