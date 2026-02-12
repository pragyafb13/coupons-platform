import { PrismaClient, CouponStatus, CouponType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.click.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.categoryStore.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();

  const fashion = await prisma.category.create({
    data: { name: "Fashion", slug: "fashion" },
  });

  const electronics = await prisma.category.create({
    data: { name: "Electronics", slug: "electronics" },
  });

  const amazon = await prisma.store.create({
    data: {
      name: "Amazon",
      slug: "amazon",
      affiliateUrl: "https://amazon.in",
      isFeatured: true,
      categories: { create: [{ categoryId: electronics.id }] },
    },
  });

  const flipkart = await prisma.store.create({
    data: {
      name: "Flipkart",
      slug: "flipkart",
      affiliateUrl: "https://flipkart.com",
      isFeatured: true,
      categories: { create: [{ categoryId: electronics.id }] },
    },
  });

  await prisma.coupon.createMany({
    data: [
      {
        storeId: amazon.id,
        title: "10% off on Electronics",
        code: "AMZ10",
        type: CouponType.CODE,
        status: CouponStatus.ACTIVE,
        isVerified: true,
      },
      {
        storeId: flipkart.id,
        title: "Up to 40% off Mobiles",
        code: null,
        type: CouponType.DEAL,
        dealUrl: "https://flipkart.com/mobile-offers",
        status: CouponStatus.ACTIVE,
      },
    ],
  });

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
