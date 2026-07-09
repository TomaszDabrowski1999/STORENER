import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getP24Config,
  isValidNotificationSign,
  parseOrderIdFromSessionId,
  toGrosze,
  verifyTransaction,
  type P24Notification,
} from "@/lib/przelewy24";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

/**
 * POST /api/payments/przelewy24/status
 *
 * Webhook wywoływany przez serwery Przelewy24 po opłaceniu transakcji
 * (adres podany jako urlStatus przy rejestracji).
 *
 * Kolejność zabezpieczeń:
 *  1. sprawdzenie podpisu SHA-384 z kluczem CRC,
 *  2. sprawdzenie merchantId / posId / waluty,
 *  3. sprawdzenie, że kwota zgadza się z kwotą zamówienia w bazie,
 *  4. potwierdzenie transakcji w API P24 (PUT /transaction/verify).
 * Dopiero po tym zamówienie dostaje status OPLACONA.
 */
export async function POST(request: Request) {
  try {
    const config = getP24Config();

    if (!config) {
      console.error("P24_WEBHOOK: brak konfiguracji P24");
      return NextResponse.json({ error: "P24 not configured" }, { status: 503 });
    }

    const body = (await request.json().catch(() => null)) as
      | Partial<P24Notification>
      | null;

    if (
      !body ||
      !body.sessionId ||
      !body.sign ||
      typeof body.amount !== "number" ||
      typeof body.orderId !== "number"
    ) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const notification: P24Notification = {
      merchantId: Number(body.merchantId),
      posId: Number(body.posId),
      sessionId: String(body.sessionId),
      amount: Number(body.amount),
      originAmount: Number(body.originAmount),
      currency: String(body.currency),
      orderId: Number(body.orderId),
      methodId: Number(body.methodId),
      statement: String(body.statement ?? ""),
      sign: String(body.sign),
    };

    if (!isValidNotificationSign(config, notification)) {
      console.error("P24_WEBHOOK: nieprawidłowy podpis", notification.sessionId);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (
      notification.merchantId !== config.merchantId ||
      notification.posId !== config.posId ||
      notification.currency !== "PLN"
    ) {
      console.error("P24_WEBHOOK: niezgodne dane sprzedawcy/waluty", notification);
      return NextResponse.json({ error: "Invalid merchant data" }, { status: 400 });
    }

    const orderId = parseOrderIdFromSessionId(notification.sessionId);

    if (!orderId) {
      console.error("P24_WEBHOOK: nieprawidłowe sessionId", notification.sessionId);
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, total: true, paymentStatus: true, paymentMethod: true },
    });

    if (!order) {
      console.error("P24_WEBHOOK: brak zamówienia", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const expectedAmount = toGrosze(order.total);

    if (notification.amount !== expectedAmount) {
      console.error(
        "P24_WEBHOOK: niezgodna kwota",
        { orderId, expectedAmount, received: notification.amount }
      );
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Idempotencja – P24 może wysłać powiadomienie więcej niż raz.
    if (order.paymentStatus === "OPLACONA") {
      return NextResponse.json({ status: "OK" });
    }

    const verified = await verifyTransaction(config, {
      sessionId: notification.sessionId,
      orderId: notification.orderId,
      amount: notification.amount,
    });

    if (!verified) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "OPLACONA" },
    });

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("P24_WEBHOOK_ERROR", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
