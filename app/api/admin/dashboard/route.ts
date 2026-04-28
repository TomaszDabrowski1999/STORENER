import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
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

    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

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