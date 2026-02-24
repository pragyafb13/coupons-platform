import { unstable_cache } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Header from "./Header";

const getHeaderCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      take: 12,
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ["header-categories"],
  { revalidate: 60 }
);

export default async function HeaderWrapper() {
  const [session, categories] = await Promise.all([
    auth(),
    getHeaderCategories().catch(() => []),
  ]);
  return <Header categories={categories} isLoggedIn={!!session?.user} />;
}
