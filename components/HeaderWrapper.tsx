import { unstable_cache } from "next/cache";
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
  let categories: Array<{ id: string; name: string; slug: string }> = [];
  try {
    categories = await getHeaderCategories();
  } catch (error) {
    console.error("Error fetching categories for header:", error);
  }
  return <Header categories={categories} />;
}
