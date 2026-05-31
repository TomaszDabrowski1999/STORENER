import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: Props) {
  try {
    const session = await auth();
    const { id } = await params;
    const orderId = Number(id);

    if (!orderId || Number.isNaN(orderId)) {
      return NextResponse.json({ error: "Nieprawidłowy numer zamówienia" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        paymentStatus: true,
        paymentMethod: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Nie znaleziono zamówienia" }, { status: 404 });
    }

    const sessionUserId = session?.user?.id ? Number(session.user.id) : null;

    if (order.userId && (!sessionUserId || order.userId !== sessionUserId)) {
      return NextResponse.json({ error: "Brak dostępu do tego zamówienia" }, { status: 403 });
    }

    if (order.paymentMethod === "POBRANIE") {
      return NextResponse.json({ error: "Zamówienie za pobraniem nie wymaga płatności online" }, { status: 400 });
    }

    if (order.paymentStatus === "OPLACONA") {
      return NextResponse.json({ ok: true, paymentStatus: order.paymentStatus });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "OPLACONA" },
      select: {
        id: true,
        paymentStatus: true,
      },
    });

    return NextResponse.json({ ok: true, ...updatedOrder });
  } catch (error) {
    console.error("ORDER_PAYMENT_ERROR", error);
    return NextResponse.json(
      { error: "Nie udało się potwierdzić płatności" },
      { status: 500 }
    );
  }
}
