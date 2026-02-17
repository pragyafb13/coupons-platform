"use client";

import Link from "next/link";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT LOGO */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="hidden sm:inline">CouponBunch</span>
          </Link>

          {/* SEARCH BAR - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-2xl mx-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores, coupons..."
              className="w-full pl-12 pr-4 py-2.5 rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition text-sm"
            />
            <Search className="absolute left-4 h-4 w-4 text-gray-400" />
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
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <Link 
                        href="/categories" 
                        className="text-sm font-semibold text-gray-900 hover:text-yellow-500 transition"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        All Categories
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2">
                      {categories.slice(0, 12).map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition"
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
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
            >
              Login
            </Link>

            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition"
            >
              Admin
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-black transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* MOBILE SEARCH BAR */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores, coupons..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </form>

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
  );
}
