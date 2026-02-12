import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, Store, TicketPercent, Folder, Upload } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 🔐 Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

          <nav className="space-y-3 text-sm">

            {/* Dashboard */}
            <Link href="/admin" className="flex items-center gap-2 hover:text-blue-400">
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            {/* STORES */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 uppercase mb-2">Stores</p>

              <Link href="/admin/stores" className="flex items-center gap-2 hover:text-blue-400">
                <Store size={16} />
                All Stores
              </Link>

              <Link href="/admin/stores/new" className="block ml-6 hover:text-blue-400">
                Add Store
              </Link>
            </div>

            {/* CATEGORIES */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 uppercase mb-2">Categories</p>

              <Link href="/admin/categories" className="flex items-center gap-2 hover:text-blue-400">
                <Folder size={16} />
                All Categories
              </Link>
            </div>

            {/* COUPONS */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 uppercase mb-2">Coupons</p>

              <Link href="/admin/coupons" className="flex items-center gap-2 hover:text-blue-400">
                <TicketPercent size={16} />
                All Coupons
              </Link>

              <Link href="/admin/coupons/create" className="block ml-6 hover:text-blue-400">
                Create Coupon
              </Link>
            </div>

            {/* 🔥 IMPORT SECTION */}
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 uppercase mb-2">Bulk Import</p>

              <Link href="/admin/import/categories" className="flex items-center gap-2 hover:text-blue-400">
                <Upload size={16} />
                Import Categories
              </Link>

              <Link href="/admin/import/stores" className="block ml-6 hover:text-blue-400">
                Import Stores
              </Link>

              <Link href="/admin/import/coupons" className="block ml-6 hover:text-blue-400">
                Import Coupons
              </Link>
            </div>
          </nav>
        </div>

        {/* User / Logout */}
        <div className="border-t border-gray-700 pt-4">
          <div className="text-xs text-gray-400 mb-1">Logged in as</div>
          <div className="text-sm font-medium mb-4">
            {session.user?.email}
          </div>

          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h2 className="font-semibold text-lg">
            Admin Dashboard
          </h2>

          <div className="text-sm text-gray-500">
            Welcome back 👋
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
