import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Publiczne sprawdzenie statusu zamówienia.
// Wymaga numeru zamówienia ORAZ adresu e-mail użytego przy zakupie –
// żeby nie dało się podejrzeć cudzego zamówienia po samym numerze.
// GET /api/order-status?id=123&email=adres@email.pl
export async function GET(request: Request) {
  // Bez limitu ten endpoint pozwala metodą siłową sprawdzać pary
  // "numer zamówienia + e-mail", aż trafi się na istniejącą kombinację.
  const ip = getClientIp(request);
  const limit = hit(`order-status:${ip}`, 20, 10 * 60 * 1000);

  if (!limit.ok) {
    return tooManyRequests(limit.retryAfterSeconds);
  }

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
