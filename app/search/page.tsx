export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";

  if (!query) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <p className="text-gray-500">Please enter a search term.</p>
      </div>
    );
  }

  let results: Array<{
    id: string;
    title: string;
    store: {
      id: string;
      name: string;
    };
  }> = [];

  try {
    results = await prisma.coupon.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          store: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    include: {
      store: true,
    },
  });
  } catch (error) {
    console.error("Error searching coupons:", error);
    results = [];
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{query}"
      </h1>

      {results.length === 0 && (
        <p className="text-gray-500">No coupons found.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {results.map((coupon) => (
          <div
            key={coupon.id}
            className="border rounded-xl p-6 hover:shadow-lg transition"
          >
            <h3 className="font-semibold mb-2">
              {coupon.title}
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              {coupon.store.name}
            </p>

            <Link
              href={`/coupons/${coupon.id}`}
              className="text-red-500 font-semibold"
            >
              View Deal →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
