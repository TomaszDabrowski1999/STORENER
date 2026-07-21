import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const PAGE_SIZE = 25;

export async function GET(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("q") || "").trim();
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const where = search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsers, adminsCount, newLast30Days, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
          termsAcceptedAt: true,
          _count: { select: { orders: true } },
          orders: {
            select: { total: true },
          },
        },
      }),
    ]);

    const usersWithStats = users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      termsAcceptedAt: user.termsAcceptedAt,
      ordersCount: user._count.orders,
      totalSpent: user.orders.reduce((sum, order) => sum + order.total, 0),
    }));

    const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));

    return NextResponse.json({
      users: usersWithStats,
      totalUsers,
      adminsCount,
      newLast30Days,
      page,
      totalPages,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd pobierania listy użytkowników" },
      { status: 500 }
    );
  }
}
