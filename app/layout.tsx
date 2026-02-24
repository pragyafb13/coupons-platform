export const dynamic = "force-dynamic";

import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "DealStack - Save Big with Verified Coupons & Promo Codes",
    template: "%s | DealStack",
  },
  description: "Discover the best coupons, promo codes and exclusive deals updated daily. Save more on every purchase. 100% verified offers from top stores.",
  keywords: ["coupons", "promo codes", "deals", "discounts", "savings", "verified coupons"],
  authors: [{ name: "DealStack" }],
  openGraph: {
    title: "DealStack - Save Big with Verified Coupons & Promo Codes",
    description: "Discover the best coupons, promo codes and exclusive deals updated daily. Save more on every purchase.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DealStack - Save Big with Verified Coupons",
    description: "Discover the best coupons and promo codes. 100% verified deals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Providers>
          <HeaderWrapper />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}