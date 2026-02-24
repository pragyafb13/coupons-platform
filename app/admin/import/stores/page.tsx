export const dynamic = "force-dynamic";

import { importStores } from "./actions";
import ImportFeedback from "../ImportFeedback";

export default async function ImportStoresPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; imported?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Import Stores (CSV)</h1>

      <ImportFeedback error={params.error} imported={params.imported} />

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Sample CSV</p>
        <a href="/sample-import/stores.csv" download className="text-blue-600 hover:underline text-sm">
          Download stores.csv (20 stores)
        </a>
      </div>

      <form action={importStores} method="POST" encType="multipart/form-data" className="space-y-4">
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
