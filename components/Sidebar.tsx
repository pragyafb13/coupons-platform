"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X, Home, Store, Tag, Grid3x3, HelpCircle, Mail, FileText, Shield, Info } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[];
}

export default function Sidebar({ isOpen, onClose, categories = [] }: SidebarProps) {
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => {
            onClose();
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold">DealStack</span>
            </div>
            <button
              onClick={() => {
                onClose();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Close menu"
              type="button"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-1 mb-8">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
              <Link
                href="/coupons"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
              >
                <Tag className="h-5 w-5" />
                All Coupons
              </Link>
              <Link
                href="/stores"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
              >
                <Store className="h-5 w-5" />
                Stores
              </Link>
              <Link
                href="/categories"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
              >
                <Grid3x3 className="h-5 w-5" />
                Categories
              </Link>
            </div>

            {/* Categories Section */}
            {categories.length > 0 && (
              <div className="mb-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Popular Categories
                </h3>
                <div className="space-y-1">
                  {categories.slice(0, 12).map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      onClick={onClose}
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-sm"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Company Section */}
            <div className="mb-8">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Company
              </h3>
              <div className="space-y-1">
                <Link
                  href="/about"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-sm"
                >
                  <Info className="h-4 w-4" />
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-sm"
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </Link>
                <Link
                  href="/advertise"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-sm"
                >
                  <Store className="h-4 w-4" />
                  Advertise
                </Link>
                <Link
                  href="/submit-coupon"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-sm"
                >
                  <Tag className="h-4 w-4" />
                  Submit Coupon
                </Link>
              </div>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Legal
              </h3>
              <div className="space-y-1">
                <Link
                  href="/privacy-policy"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-sm"
                >
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Terms & Conditions
                </Link>
                <Link
                  href="/disclaimer"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-sm"
                >
                  <HelpCircle className="h-4 w-4" />
                  Disclaimer
                </Link>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <Link
              href="/login"
              onClick={onClose}
              className="block w-full text-center px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-gray-700 font-medium mb-2"
            >
              Login
            </Link>
            <Link
              href="/admin"
              onClick={onClose}
              className="block w-full text-center px-4 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition font-semibold"
            >
              Admin
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
