import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { couponId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.savedCoupon.findUnique({
    where: {
      userId_couponId: {
        userId: user.id,
        couponId,
      },
    },
  });

  if (existing) {
    await prisma.savedCoupon.delete({
      where: {
        userId_couponId: {
          userId: user.id,
          couponId,
        },
      },
    });

    return NextResponse.json({ saved: false });
  }

  await prisma.savedCoupon.create({
    data: {
      userId: user.id,
      couponId,
    },
  });

  return NextResponse.json({ saved: true });
}
