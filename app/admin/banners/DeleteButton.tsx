"use client";

import { deleteBanner } from "./actions";

export default function DeleteButton({ bannerId }: { bannerId: string }) {
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this banner?")) {
      return;
    }
    
    const formData = new FormData();
    formData.append("id", bannerId);
    await deleteBanner(formData);
  }

  return (
    <form action={handleDelete} className="inline">
      <button
        type="submit"
        className="text-sm font-medium text-red-600 hover:text-red-800 transition"
      >
        Delete
      </button>
    </form>
  );
}
