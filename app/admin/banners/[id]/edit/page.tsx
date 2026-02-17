import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateBanner } from "../actions";
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
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Edit Banner</h2>

      <form
        action={updateBanner}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <input type="hidden" name="id" value={banner.id} />

        <div>
          <label className="block font-medium mb-1">
            Banner Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
            defaultValue={banner.title}
            placeholder="e.g., Summer Sale 2024"
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            This will be displayed on the banner
          </p>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            name="imageUrl"
            type="url"
            required
            defaultValue={banner.imageUrl}
            placeholder="https://example.com/banner-image.jpg"
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
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

        <div>
          <label className="block font-medium mb-1">
            Link URL <span className="text-red-500">*</span>
          </label>
          <input
            name="linkUrl"
            type="url"
            required
            defaultValue={banner.linkUrl}
            placeholder="https://example.com/deal-page"
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Where users will be redirected when clicking the banner
          </p>
        </div>

        <div>
          <label className="block font-medium mb-1">Position</label>
          <input
            name="position"
            type="number"
            defaultValue={banner.position}
            min={0}
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Lower numbers appear first. Position 0 = Main banner, 1-3 = Promo banners
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={banner.isActive}
          />
          <label>Active (Show on homepage)</label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Update Banner
          </button>
          <Link
            href="/admin/banners"
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
