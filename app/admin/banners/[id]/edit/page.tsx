export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateBanner } from "../../actions";
import Link from "next/link";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const banner = await prisma.banner.findUnique({
    where: { id },
  });

  if (!banner) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Banner</h2>
        <p className="text-gray-600">
          Update banner information and settings
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form action={updateBanner} className="space-y-6">
        <input type="hidden" name="id" value={banner.id} />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Banner Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
            defaultValue={banner.title}
            placeholder="e.g., Summer Sale 2024"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
          />
          <p className="text-xs text-gray-500">
            This will be displayed on the banner
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            name="imageUrl"
            type="url"
            required
            defaultValue={banner.imageUrl}
            placeholder="https://example.com/banner-image.jpg"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
          />
          <p className="text-xs text-gray-500">
            Recommended size: 1200x600px for main banner, 600x400px for promo banners
          </p>
          {banner.imageUrl && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Preview:</p>
              <div className="relative w-full h-48 rounded overflow-hidden bg-gray-100 border">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Link URL <span className="text-red-500">*</span>
          </label>
          <input
            name="linkUrl"
            type="url"
            required
            defaultValue={banner.linkUrl}
            placeholder="https://example.com/deal-page"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
          />
          <p className="text-xs text-gray-500">
            Where users will be redirected when clicking the banner
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Position</label>
          <input
            name="position"
            type="number"
            defaultValue={banner.position}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
          />
          <p className="text-xs text-gray-500">
            Lower numbers appear first. Position 0 = Main banner, 1-3 = Promo banners
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            defaultChecked={banner.isActive}
            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
            Active (Show on homepage)
          </label>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition shadow-sm"
          >
            Update Banner
          </button>
          <Link
            href="/admin/banners"
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
