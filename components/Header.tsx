"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md shadow-sm border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        
        {/* LEFT LOGO */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          CouponBunch
        </Link>

        {/* SEARCH BAR */}
        <div className="hidden md:flex items-center w-[40%] relative">
          <input
            type="text"
            placeholder="Search stores, coupons..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-3">
          <Link
            href="/stores"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Stores
          </Link>

          <Link
            href="/categories"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Categories
          </Link>

          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            Login
          </Link>

          <Link
            href="/admin"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
