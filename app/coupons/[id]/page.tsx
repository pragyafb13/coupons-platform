// app/coupons/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: { id: string }; // dynamic route param
};

export default async function CouponDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  const coupon = await prisma.coupon.findUnique({
    where: { id },
    include: {
      store: true,
      categories: true,
    },
  });

  if (!coupon) notFound();

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">{coupon.title}</h1>

      {coupon.store && (
        <p className="text-gray-700">
          Store:{" "}
          <Link
            href={`/stores/${coupon.store.id}`}
            className="text-blue-600 hover:underline"
          >
            {coupon.store.name}
          </Link>
        </p>
      )}

      {coupon.code && (
        <p className="mt-2 text-gray-800">
          Coupon Code:{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            {coupon.code}
          </span>
        </p>
      )}

      {coupon.dealUrl && (
        <p className="mt-4">
          <a
            href={coupon.dealUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Deal
          </a>
        </p>
      )}

      {coupon.expiryDate && (
        <p className="mt-2 text-gray-500">
          Expires on:{" "}
          {new Date(coupon.expiryDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}

      <p className="mt-4 text-gray-600">
        Status: <span className="font-semibold">{coupon.status}</span>
      </p>

      <Link
        href="/coupons"
        className="inline-block mt-6 text-blue-600 hover:underline"
      >
        ← Back to all coupons
      </Link>
    </div>
  );
}
