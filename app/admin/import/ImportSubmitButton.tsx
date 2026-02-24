"use client";

import { useFormStatus } from "react-dom";

export default function ImportSubmitButton({ children = "Upload CSV" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-black text-white px-4 py-2 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Uploading..." : children}
    </button>
  );
}
