import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const { userId } = await context.params;
    const numericUserId = Number(userId);

    if (Number.isNaN(numericUserId)) {
      return NextResponse.json(
        { error: "Nieprawidłowe ID użytkownika" },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: numericUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd pobierania zamówień użytkownika" },
      { status: 500 }
    );
  }
}