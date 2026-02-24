"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface SaveCouponButtonProps {
  couponId: string;
  initialSaved?: boolean;
  className?: string;
}

export default function SaveCouponButton({ couponId, initialSaved = false, className = "" }: SaveCouponButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/save-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      } else if (res.status === 401) {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-lg transition ${
        saved
          ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
      } ${className}`}
      aria-label={saved ? "Unsave coupon" : "Save coupon"}
      title={saved ? "Remove from saved" : "Save for later"}
    >
      <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
