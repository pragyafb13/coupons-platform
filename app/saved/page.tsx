export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function SavedPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600">You need to be logged in to view your saved coupons.</p>
        </div>
      </div>
    );
  }

  let user;
  let saved: Array<{
    id: string;
    coupon: {
      id: string;
      title: string;
      code: string | null;
      store: {
        id: string;
        name: string;
      } | null;
    };
  }> = [];

  try {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      saved = await prisma.savedCoupon.findMany({
        where: { userId: user.id },
        include: {
          coupon: {
            include: { store: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (error) {
    console.error("Error fetching saved coupons:", error);
    saved = [];
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Saved Coupons</h1>

      {saved.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">You haven't saved any coupons yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {saved.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-2">
                {item.coupon.store?.name || "Unknown Store"}
              </p>
              <h3 className="font-semibold text-gray-900 mb-4">
                {item.coupon.title}
              </h3>
              {item.coupon.code ? (
                <div className="bg-gray-100 p-3 rounded-lg text-center font-mono text-sm">
                  {item.coupon.code}
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center text-sm text-blue-700">
                  Deal Only
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
