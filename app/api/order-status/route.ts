import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Publiczne sprawdzenie statusu zamówienia.
// Wymaga numeru zamówienia ORAZ adresu e-mail użytego przy zakupie –
// żeby nie dało się podejrzeć cudzego zamówienia po samym numerze.
// GET /api/order-status?id=123&email=adres@email.pl
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idRaw = searchParams.get("id") || "";
    const emailRaw = (searchParams.get("email") || "").trim().toLowerCase();

    const orderId = Number(idRaw);

    if (!idRaw || Number.isNaN(orderId) || !emailRaw) {
      return NextResponse.json(
        { error: "Podaj numer zamówienia oraz adres e-mail." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { select: { id: true } } },
    });

    // Ta sama odpowiedź dla „nie istnieje" i „zły e-mail",
    // żeby nie ujawniać, które numery zamówień istnieją.
    if (!order || order.email.trim().toLowerCase() !== emailRaw) {
      return NextResponse.json(
        { error: "Nie znaleziono zamówienia dla podanych danych." },
        { status: 404 }
      );
    }

    // Pola dodane migracją – lokalny klient Prisma pozna je po `prisma generate`.
    const o = order as typeof order & {
      trackingNumber?: string | null;
      trackingCarrier?: string | null;
    };

    return NextResponse.json({
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      itemsCount: order.items.length,
      shippingMethodName: order.shippingMethodName,
      shippingEstimatedDelivery: order.shippingEstimatedDelivery,
      trackingNumber: o.trackingNumber || null,
      trackingCarrier: o.trackingCarrier || null,
    });
  } catch (error) {
    console.error("ORDER_STATUS_ERROR", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
