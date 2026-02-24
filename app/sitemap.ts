import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://coupons-platform.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stores, categories, coupons] = await Promise.all([
    prisma.store.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.coupon.findMany({
      where: { status: "ACTIVE", isActive: true },
      select: { id: true, updatedAt: true },
    }).catch(() => []),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/coupons`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/stores`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const storePages = stores.map((s) => ({
    url: `${BASE_URL}/stores/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${BASE_URL}/categories/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const couponPages = coupons.map((c) => ({
    url: `${BASE_URL}/coupons/${c.id}`,
    lastModified: c.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...storePages, ...categoryPages, ...couponPages];
}
