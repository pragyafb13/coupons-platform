// app/stores/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">Stores</h1>
      {stores.length === 0 ? (
        <p className="text-center text-gray-500">No stores available.</p>
      ) : (
        <ul className="space-y-2">
          {stores.map(store => (
            <li key={store.id}>
              <Link
                href={`/stores/${store.id}`}
                className="text-blue-600 hover:underline"
              >
                {store.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
