export const dynamic = "force-dynamic";

import { importCoupons } from "./actions";
import ImportFeedback from "../ImportFeedback";

export default async function ImportCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; imported?: string; skipped?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Import Coupons (CSV)</h1>

      <ImportFeedback
        error={params.error}
        imported={params.imported}
        skipped={params.skipped}
      />

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Sample CSV</p>
        <p className="text-xs text-gray-600 mb-2">Import categories and stores first. Uses store_slug.</p>
        <a href="/sample-import/coupons.csv" download className="text-blue-600 hover:underline text-sm">
          Download coupons.csv (59 coupons)
        </a>
      </div>

      <form action={importCoupons} method="POST" encType="multipart/form-data" className="space-y-4">
        <input
          type="file"
          name="file"
          accept=".csv"
          required
        />

        <button className="bg-black text-white px-4 py-2 rounded-md">
          Upload CSV
        </button>
      </form>
    </div>
  );
}
