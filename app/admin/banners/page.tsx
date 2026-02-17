import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { toggleBannerActive, deleteBanner } from "./actions";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Banners</h2>
        <Link
          href="/admin/banners/new"
          className="inline-block bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          + Create Banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No banners created yet.</p>
          <Link
            href="/admin/banners/new"
            className="inline-block bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Create Your First Banner
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="text-left px-4 py-3">Preview</th>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Position</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr
                  key={banner.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="relative w-24 h-16 rounded overflow-hidden bg-gray-100">
                      {banner.imageUrl ? (
                        <Image
                          src={banner.imageUrl}
                          alt={banner.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{banner.title}</td>
                  <td className="px-4 py-3 text-gray-700">{banner.position}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      banner.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <form action={toggleBannerActive.bind(null, banner.id)}>
                      <button
                        type="submit"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {banner.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                    <Link
                      href={`/admin/banners/${banner.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteBanner}>
                      <input type="hidden" name="id" value={banner.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:underline"
                        onClick={(e) => {
                          if (!confirm("Are you sure you want to delete this banner?")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </form>
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
