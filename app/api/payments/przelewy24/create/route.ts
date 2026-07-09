import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import {
  buildSessionId,
  getP24Config,
  registerTransaction,
  toGrosze,
} from "@/lib/przelewy24";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

/**
 * POST /api/payments/przelewy24/create
 * Body: { orderId: number }
 *
 * Rejestruje transakcję w Przelewy24 dla istniejącego, nieopłaconego
 * zamówienia i zwraca redirectUrl do bramki płatności.
 */
export async function POST(request: Request) {
  try {
    const config = getP24Config();

    if (!config) {
      return NextResponse.json(
        {
          error:
            "Płatności online nie są jeszcze skonfigurowane. Uzupełnij zmienne P24_MERCHANT_ID, P24_POS_ID, P24_CRC i P24_API_KEY.",
        },
        { status: 503 }
      );
    }

    const session = await auth();
    const body = await request.json().catch(() => ({}));
    const orderId = Number(body?.orderId);

    if (!orderId || !Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        { error: "Nieprawidłowy numer zamówienia" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Nie znaleziono zamówienia" },
        { status: 404 }
      );
    }

    // Płacić może tylko właściciel zamówienia (lub admin).
    const sessionUserId = session?.user?.id ? Number(session.user.id) : null;
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin && (!sessionUserId || order.userId !== sessionUserId)) {
      return NextResponse.json(
        { error: "Brak dostępu do tego zamówienia" },
        { status: 403 }
      );
    }

    if (order.paymentMethod === "POBRANIE") {
      return NextResponse.json(
        { error: "Zamówienie za pobraniem nie wymaga płatności online" },
        { status: 400 }
      );
    }

    if (order.paymentStatus === "OPLACONA") {
      return NextResponse.json(
        { error: "To zamówienie jest już opłacone" },
        { status: 400 }
      );
    }

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      ""
    ).replace(/\/$/, "");

    if (!appUrl) {
      return NextResponse.json(
        { error: "Brak konfiguracji adresu sklepu (NEXT_PUBLIC_APP_URL)" },
        { status: 500 }
      );
    }

    const sessionId = buildSessionId(order.id);
    const amount = toGrosze(order.total);

    const { redirectUrl } = await registerTransaction(config, {
      sessionId,
      amount,
      description: `Zamówienie #${order.id}`,
      email: order.email,
      client: order.fullName,
      address: order.address,
      zip: order.postalCode,
      city: order.city,
      phone: order.phone || undefined,
      urlReturn: `${appUrl}/platnosci/${order.id}?powrot=1`,
      urlStatus: `${appUrl}/api/payments/przelewy24/status`,
    });

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("P24_CREATE_ERROR", error);

    return NextResponse.json(
      { error: "Nie udało się rozpocząć płatności. Spróbuj ponownie." },
      { status: 500 }
    );
  }
}
