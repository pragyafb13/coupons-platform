import { createBanner } from "../actions";
import Link from "next/link";

export default async function NewBannerPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Create Banner</h2>

      <form
        action={createBanner}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block font-medium mb-1">
            Banner Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
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
            placeholder="https://example.com/banner-image.jpg"
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Recommended size: 1200x600px for main banner, 600x400px for promo banners
          </p>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Link URL <span className="text-red-500">*</span>
          </label>
          <input
            name="linkUrl"
            type="url"
            required
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
            defaultValue={0}
            min={0}
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Lower numbers appear first. Position 0 = Main banner, 1-3 = Promo banners
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked />
          <label>Active (Show on homepage)</label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Create Banner
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
