import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Coupons Platform - Save Big with Verified Coupons & Promo Codes",
  description: "Discover the best coupons, promo codes and exclusive deals updated daily. Save more on every purchase.",
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