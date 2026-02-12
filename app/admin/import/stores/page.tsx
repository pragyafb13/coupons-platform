import { importStores } from "./actions";

export default function ImportStoresPage() {
  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Import Stores (CSV)</h1>

      <form action={importStores} className="space-y-4">
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
