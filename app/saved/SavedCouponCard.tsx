"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Zap } from "lucide-react";
import SaveCouponButton from "@/components/SaveCouponButton";

type Props = {
  item: {
    id: string;
    coupon: {
      id: string;
      title: string;
      code: string | null;
      expiryDate: Date | null;
      store: { id: string; name: string; logo: string | null } | null;
    };
  };
};

export default function SavedCouponCard({ item }: Props) {
  const router = useRouter();
  const discountMatch = item.coupon.title.match(/\d+%/);
  const discount = discountMatch ? discountMatch[0] : null;

  return (
    <div className="group bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 shadow-premium hover:shadow-premium-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
      {discount && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-extrabold px-4 py-2 rounded-xl shadow-lg z-10 flex items-center gap-1">
          <Zap className="h-4 w-4" />
          {discount} OFF
        </div>
      )}

      {/* Save/Unsave button - click to remove from saved */}
      <div className="absolute top-4 left-4 z-10">
        <SaveCouponButton
          couponId={item.coupon.id}
          initialSaved
          onSavedChange={(saved) => {
            if (!saved) router.refresh();
          }}
        />
      </div>

      <Link href={`/coupons/${item.coupon.id}`} className="block">
        <div className="flex items-center gap-4 mb-4 pr-20">
          {item.coupon.store?.logo ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 p-2 flex-shrink-0">
              <Image
                src={item.coupon.store.logo}
                alt={item.coupon.store.name}
                width={64}
                height={64}
                className="object-contain w-full h-full"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
              <span className="font-extrabold text-gray-800 text-lg">
                {item.coupon.store?.name?.charAt(0) || "?"}
              </span>
            </div>
          )}
          <h4 className="font-bold text-gray-900 text-sm">{item.coupon.store?.name || "Unknown"}</h4>
        </div>

        <h3 className="text-lg font-extrabold mb-4 group-hover:text-red-600 transition line-clamp-2 text-gray-900 leading-tight">
          {item.coupon.title}
        </h3>

        {item.coupon.code ? (
          <div className="border-2 border-dashed border-yellow-500 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl py-3 text-center font-mono text-base mb-4 text-gray-900 font-extrabold tracking-wider">
            {item.coupon.code}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl py-3 text-center text-sm font-semibold text-gray-600 mb-4">
            Deal Only
          </div>
        )}

        {item.coupon.expiryDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Clock className="h-4 w-4" />
            <span>Expires {new Date(item.coupon.expiryDate).toLocaleDateString("en-US")}</span>
          </div>
        )}

        <div className="text-center py-3 rounded-xl font-bold bg-gradient-to-r from-gray-900 to-black text-white group-hover:from-red-500 group-hover:to-red-600 transition">
          View Deal →
        </div>
      </Link>
    </div>
  );
}
