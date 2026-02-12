// app/coupons/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({
    where: { status: "ACTIVE" },
    include: { store: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">Available Coupons</h1>

      {coupons.length === 0 ? (
        <p className="text-center text-gray-500">No coupons available.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {coupons.map(coupon => (
            <div
              key={coupon.id}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{coupon.title}</h2>
              <p>Store: {coupon.store.name}</p>
              {coupon.code && (
                <p>
                  Code:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {coupon.code}
                  </span>
                </p>
              )}
              {coupon.expiryDate && (
                <p className="text-sm text-gray-500">
                  Expires: {coupon.expiryDate.toISOString().split("T")[0]}
                </p>
              )}
              <div className="mt-2 flex gap-2">
                <Link
                  href={coupon.dealUrl}
                  target="_blank"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Deal
                </Link>
                <Link
                  href={`/coupons/${coupon.id}`}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
