"use client";

import { useState, useTransition } from "react";
import { createBanner } from "../actions";
import Link from "next/link";

export default function BannerForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    
    startTransition(async () => {
      try {
        await createBanner(formData);
        // Redirect will happen in the action
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create banner. Please try again.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banner Title <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          required
          placeholder="e.g., Summer Sale 2024"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
        />
        <p className="text-sm text-gray-500 mt-1.5">
          This will be displayed on the banner
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URL <span className="text-red-500">*</span>
        </label>
        <input
          name="imageUrl"
          type="url"
          required
          placeholder="https://example.com/banner-image.jpg"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
        />
        <p className="text-sm text-gray-500 mt-1.5">
          Recommended size: 1200x600px for main banner, 600x400px for promo banners
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Link URL <span className="text-red-500">*</span>
        </label>
        <input
          name="linkUrl"
          type="url"
          required
          placeholder="https://example.com/deal-page"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
        />
        <p className="text-sm text-gray-500 mt-1.5">
          Where users will be redirected when clicking the banner
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position
        </label>
        <input
          name="position"
          type="number"
          defaultValue={0}
          min={0}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
        />
        <p className="text-sm text-gray-500 mt-1.5">
          Lower numbers appear first. Position 0 = Main banner, 1-3 = Promo banners
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          defaultChecked
          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Active (Show on homepage)
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "Create Banner"}
        </button>
        <Link
          href="/admin/banners"
          className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition text-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
