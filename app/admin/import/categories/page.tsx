export const dynamic = "force-dynamic";

import { importCategories } from "./actions";

export default function ImportCategoriesPage() {
  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Import Categories (CSV)</h1>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Sample CSV</p>
        <a href="/sample-import/categories.csv" download className="text-blue-600 hover:underline text-sm">
          Download categories.csv (10 categories)
        </a>
      </div>

      <form action={importCategories} className="space-y-4">
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
