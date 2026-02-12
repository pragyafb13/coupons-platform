// app/stores/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoreDetailPage({ params }: Props) {
  const { id } = await params;

  if (!id) return notFound();

  const store = await prisma.store.findUnique({
    where: { id },
    include: { coupons: true },
  });

  if (!store) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">{store.name}</h1>

      {store.description && (
        <p className="text-gray-700 mt-2">{store.description}</p>
      )}

      {store.affiliateUrl && (
        <p className="mt-4">
          <a
            href={store.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Visit Store
          </a>
        </p>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Coupons</h2>
        {store.coupons.length === 0 ? (
          <p className="text-gray-500">No coupons available for this store.</p>
        ) : (
          <ul className="space-y-4">
            {store.coupons.map((coupon) => (
              <li key={coupon.id} className="border p-4 rounded-lg shadow-sm">
                <Link
                  href={`/coupons/${coupon.id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {coupon.title}
                </Link>
                {coupon.code && (
                  <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                    {coupon.code}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/stores"
        className="inline-block mt-6 text-blue-600 hover:underline"
      >
        ← Back to all stores
      </Link>
    </div>
  );
}
