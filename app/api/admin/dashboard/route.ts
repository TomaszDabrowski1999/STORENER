import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");

    const [productsCount, usersCount, orders, recentOrders] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        select: {
          total: true,
        },
      }),
      prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      }),
    ]);

    const revenue = orders.reduce(
      (sum: number, order: { total: number }) => sum + order.total,
      0
    );

    return NextResponse.json({
      productsCount,
      usersCount,
      ordersCount: orders.length,
      revenue,
      recentOrders,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd pobierania dashboardu" },
      { status: 500 }
    );
  }
}