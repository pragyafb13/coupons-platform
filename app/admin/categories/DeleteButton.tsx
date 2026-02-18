"use client";

import { deleteCategory } from "./actions";

export default function DeleteButton({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This will remove all category associations.`)) {
      return;
    }
    
    const formData = new FormData();
    formData.append("id", categoryId);
    await deleteCategory(formData);
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
