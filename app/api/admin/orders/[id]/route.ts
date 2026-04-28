import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const orderId = Number(id);

    const body = await request.json();
    const { status } = body;

    if (Number.isNaN(orderId)) {
      return NextResponse.json(
        { error: "Nieprawidłowe ID zamówienia" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Brak statusu" },
        { status: 400 }
      );
    }

    const allowedStatuses = ["NOWE", "W_REALIZACJI", "WYSLANE"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Nieprawidłowy status" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd aktualizacji statusu" },
      { status: 500 }
    );
  }
}