import { prisma } from "@/lib/prisma";
import Header from "./Header";

export default async function HeaderWrapper() {
  let categories: Array<{ id: string; name: string; slug: string }> = [];
  
  try {
    categories = await prisma.category.findMany({
      take: 12,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  } catch (error) {
    console.error("Error fetching categories for header:", error);
    // Use empty array if query fails
    categories = [];
  }

  return <Header categories={categories} />;
}
