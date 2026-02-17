import Link from "next/link";
import BannerForm from "./BannerForm";

export default async function NewBannerPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Banner</h2>
        <p className="text-gray-600">
          Add a new banner to display on the homepage
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <BannerForm />
      </div>
    </div>
  );
}
