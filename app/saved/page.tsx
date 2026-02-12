import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";


export default async function SavedPage() {
    const session = await auth();

  if (!session?.user?.email) {
    return <div className="p-10">Please login.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const saved = await prisma.savedCoupon.findMany({
    where: { userId: user?.id },
    include: {
      coupon: {
        include: { store: true },
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-10">Saved Coupons</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {saved.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-500">
              {item.coupon.store.name}
            </p>
            <h3 className="font-semibold mb-2">
              {item.coupon.title}
            </h3>
            <div className="bg-gray-100 p-3 rounded text-center font-mono">
              {item.coupon.code}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
