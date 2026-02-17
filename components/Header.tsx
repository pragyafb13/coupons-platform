"use client";

import Link from "next/link";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  categories?: Category[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} categories={categories} />
      <header className="sticky top-0 z-50 w-full bg-white/98 backdrop-blur-lg shadow-premium border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* LEFT SIDEBAR BUTTON & LOGO */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsSidebarOpen(!isSidebarOpen);
                }}
                className="p-2.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
                aria-label="Toggle menu"
                type="button"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/" className="flex items-center gap-3 text-xl sm:text-2xl font-extrabold tracking-tight hover:opacity-90 transition group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition">
                  <span className="text-white font-extrabold text-base sm:text-lg">D</span>
                </div>
                <span className="hidden sm:inline bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  DealStack
                </span>
        </Link>
            </div>

          {/* SEARCH BAR - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-2xl mx-8 relative">
            <Search className="absolute left-5 h-5 w-5 text-gray-400 pointer-events-none z-10" />
          <input
            type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores, coupons, deals..."
              className="w-full pl-14 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all text-sm text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md"
            />
          </form>

          {/* RIGHT BUTTONS - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Categories Dropdown */}
            {categories.length > 0 && (
              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition"
                >
                  Categories
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-premium-lg border-2 border-gray-200 py-3 max-h-96 overflow-y-auto z-50">
                    <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-2xl">
                      <Link 
                        href="/categories" 
                        className="text-sm font-extrabold text-gray-900 hover:text-yellow-600 transition flex items-center gap-2"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <span>All Categories</span>
                        <span className="text-yellow-600">→</span>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3">
                      {categories.slice(0, 12).map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-yellow-600 rounded-xl transition-all duration-200"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
        </div>
            )}

          <Link
            href="/stores"
              className="text-sm font-medium text-gray-700 hover:text-black transition"
          >
            Stores
          </Link>

          <Link
              href="/coupons"
              className="text-sm font-medium text-gray-700 hover:text-black transition"
          >
              Coupons
          </Link>

          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Login
          </Link>

          <Link
            href="/admin"
            className="px-5 py-2.5 text-sm font-extrabold rounded-xl bg-gradient-to-r from-gray-900 to-black text-white hover:from-gray-800 hover:to-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Admin
          </Link>
          </div>

          {/* MOBILE SEARCH & MENU BUTTON */}
          <div className="md:hidden flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex-1 max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition text-sm text-gray-900 placeholder-gray-500"
                />
              </div>
            </form>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-black transition"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <Link
              href="/categories"
              className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              All Categories
            </Link>
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="block px-2 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/stores"
              className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Stores
            </Link>
            <Link
              href="/coupons"
              className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Coupons
            </Link>
            <div className="pt-2 border-t border-gray-200 space-y-2">
              <Link
                href="/login"
                className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/admin"
                className="block px-2 py-2 text-sm font-semibold text-white bg-black hover:bg-gray-800 rounded-lg transition text-center"
                onClick={() => setIsMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
