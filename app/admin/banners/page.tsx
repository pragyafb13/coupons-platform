import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { toggleBannerActive, deleteBanner } from "./actions";
import { Banner } from "@prisma/client";

export default async function AdminBannersPage() {
  let banners: Banner[] = [];
  
  try {
    banners = await prisma.banner.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    // Return empty array if there's an error
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Banners</h2>
          <p className="text-gray-600">Manage homepage banners</p>
        </div>
        <Link
          href="/admin/banners/new"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
        >
          <span>+</span> Create Banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-6 text-lg">No banners created yet.</p>
          <Link
            href="/admin/banners/new"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            <span>+</span> Create Your First Banner
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Preview</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Title</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Position</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr
                  key={banner.id}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {banner.imageUrl ? (
                        <Image
                          src={banner.imageUrl}
                          alt={banner.title}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{banner.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700 font-medium">{banner.position}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      banner.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <form action={toggleBannerActive.bind(null, banner.id)}>
                        <button
                          type="submit"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                        >
                          {banner.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                      <Link
                        href={`/admin/banners/${banner.id}/edit`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                      >
                        Edit
                      </Link>
                      <form action={deleteBanner} className="inline">
                        <input type="hidden" name="id" value={banner.id} />
                        <button
                          type="submit"
                          className="text-sm font-medium text-red-600 hover:text-red-800 transition"
                          onClick={(e) => {
                            if (!confirm("Are you sure you want to delete this banner?")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
