import { prisma } from "@/lib/prisma";
import Header from "./Header";

export default async function HeaderWrapper() {
  const categories = await prisma.category.findMany({
    take: 12,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return <Header categories={categories} />;
}
