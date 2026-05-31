import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedOrderStatuses = ["NOWE", "W_REALIZACJI", "WYSLANE"];
const allowedPaymentStatuses = ["OCZEKUJE", "OPLACONA", "NIEUDANA"];

export async function GET(_: Request, context: RouteContext) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json({ error: "Nieprawidłowe ID zamówienia" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Zamówienie nie istnieje" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd pobierania zamówienia" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return NextResponse.json({ error: "Nieprawidłowe ID zamówienia" }, { status: 400 });
    }

    const body = await request.json();
    const data: Record<string, string> = {};

    if (body.status) {
      if (!allowedOrderStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Nieprawidłowy status zamówienia" }, { status: 400 });
      }
      data.status = body.status;
    }

    if (body.paymentStatus) {
      if (!allowedPaymentStatuses.includes(body.paymentStatus)) {
        return NextResponse.json({ error: "Nieprawidłowy status płatności" }, { status: 400 });
      }
      data.paymentStatus = body.paymentStatus;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Brak danych do aktualizacji" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        items: { include: { product: true } },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd aktualizacji zamówienia" }, { status: 500 });
  }
}
