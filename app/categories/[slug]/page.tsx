import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      coupons: {
        include: {
          coupon: {
            include: {
              store: true,
            },
          },
        },
      },
      stores: {
        include: {
          store: {
            include: {
              coupons: {
                where: {
                  status: "ACTIVE",
                  isActive: true,
                },
                include: {
                  store: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!category) notFound();

  // Direct category coupons
  const directCoupons =
    category.coupons.map((c) => c.coupon);

  // Coupons via stores
  const storeCoupons =
    category.stores.flatMap((cs) =>
      cs.store.coupons
    );

  // Merge + remove duplicates
  const allCoupons = [
    ...directCoupons,
    ...storeCoupons,
  ].filter(
    (value, index, self) =>
      index ===
      self.findIndex((c) => c.id === value.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">
        {category.name} Coupons
      </h1>

      {allCoupons.length === 0 && (
        <p className="text-gray-500">
          No active coupons found in this category.
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {allCoupons.map((coupon) => (
          <Link
          key={coupon.id}
          href={`/coupons/${coupon.id}`}
          className="block border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
        >
          <h3 className="font-semibold mb-2">
            {coupon.title}
          </h3>
        
          <p className="text-sm text-gray-500">
            {coupon.store.name}
          </p>
        </Link>
        
        ))}
      </div>
    </div>
  );
}
