import { prisma } from "@/lib/prisma";
import { CouponStatus } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      coupons: {
        where: {
          coupon: {
            status: "ACTIVE",
          },
        },
        include: {
          coupon: {
            include: {
              store: true,
            },
          },
        },
      },
      stores: true,
    },
  });

  if (!category) notFound();
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
      <h1 className="text-4xl font-bold">
        {category.name} Coupons
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="border p-6 rounded-2xl shadow"
          >
            <div className="font-semibold mb-2">
              {coupon.coupon.store.name}
            </div>
            <div className="text-lg font-bold mb-4">
              {coupon.coupon.title}
            </div>
            {coupon.coupon.code && (
              <div className="bg-gray-100 p-2 rounded mb-4 font-mono">
                {coupon.coupon.code}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
