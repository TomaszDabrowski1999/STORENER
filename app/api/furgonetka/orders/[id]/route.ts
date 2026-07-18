import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import {
  normalizePackageSize,
  formatPackageSize,
  PACKAGE_DIMENSIONS,
  getCourier,
} from "@/lib/shipping";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// Furgonetka sends tracking info to this endpoint when shipment is created
// POST /api/furgonetka/orders/{id}  (opcja "Wysyłaj informacje o przesyłce")
export async function POST(request: Request, context: RouteContext) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || "";
  const expectedToken = process.env.FURGONETKA_WEBHOOK_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const orderId = Number(id);
    if (isNaN(orderId)) return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

    const body = await request.json().catch(() => ({}));

    // Furgonetka (oraz różne warianty integracji) mogą nazywać te pola różnie –
    // przyjmujemy najczęstsze nazwy, żeby nic nie zgubić.
    const trackingNumber =
      body.tracking_number ||
      body.trackingNumber ||
      body.package_no ||
      body.packageNo ||
      body.tracking_no ||
      body.waybill ||
      body.number ||
      null;

    const trackingCarrier =
      body.carrier ||
      body.service ||
      body.courier ||
      body.service_name ||
      null;

    // Upewniamy się, że zamówienie istnieje, zanim cokolwiek zmienimy.
    const existing = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Etykieta wygenerowana => zamówienie jest wysłane.
    const updateData: Record<string, unknown> = { status: "WYSLANE" };
    if (trackingNumber) updateData.trackingNumber = String(trackingNumber);
    if (trackingCarrier) updateData.trackingCarrier = String(trackingCarrier);

    try {
      await prisma.order.update({
        where: { id: orderId },
        // trackingNumber/trackingCarrier istnieją w bazie po migracji;
        // rzutujemy przez unknown, bo lokalny klient Prisma pozna je po `prisma generate`.
        data: updateData as unknown as Prisma.OrderUpdateInput,
      });
    } catch (writeError) {
      // Gdyby kolumny trackingNumber/trackingCarrier nie były jeszcze w bazie
      // (brak wykonanej migracji), nie wywracamy callbacku – aktualizujemy sam status.
      console.error("FURGONETKA TRACKING WRITE FALLBACK:", writeError);
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "WYSLANE" },
      });
    }

    console.log(
      `Furgonetka shipment for order #${orderId}: ${trackingCarrier || "?"} ${trackingNumber || "(brak numeru)"}`
    );

    return NextResponse.json({ success: true, message: "Order updated" });
  } catch (error) {
    console.error("FURGONETKA TRACKING ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET single order details
export async function GET(request: Request, context: RouteContext) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || "";
  const expectedToken = process.env.FURGONETKA_WEBHOOK_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const orderId = Number(id);
    if (isNaN(orderId)) return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { select: { name: true, image: true, price: true } },
          },
        },
      },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Pola dodane migracją – lokalny klient Prisma pozna je po `prisma generate`.
    const o = order as typeof order & {
      phone?: string | null;
      trackingNumber?: string | null;
      trackingCarrier?: string | null;
    };

    return NextResponse.json({
      id: String(order.id),
      status: order.status,
      payment_status: order.paymentStatus,
      created_at: order.createdAt.toISOString(),
      total: order.total,
      currency: "PLN",
      customer: { name: order.fullName, email: order.email, phone: o.phone || null },
      shipping_address: {
        name: order.fullName,
        street: order.address,
        city: order.city,
        postal_code: order.postalCode,
        country: "PL",
      },
      shipping: {
        method: order.shippingMethod,
        method_name: order.shippingMethodName,
        service: getCourier(order.shippingMethod)?.furgonetkaService || null,
        price: order.shippingPrice,
        point: order.shippingPoint || null,
        package_size: normalizePackageSize((order as { packageSize?: string | null }).packageSize),
        package_size_name: formatPackageSize((order as { packageSize?: string | null }).packageSize),
        parcel: {
          ...PACKAGE_DIMENSIONS[
            normalizePackageSize((order as { packageSize?: string | null }).packageSize)
          ],
          dimension_unit: "cm",
          weight_unit: "kg",
        },
      },
      tracking: {
        number: o.trackingNumber || null,
        carrier: o.trackingCarrier || null,
      },
      items: order.items.map((item: any) => ({
        id: String(item.id),
        name: item.product?.name || "Produkt",
        quantity: item.quantity,
        price: item.product?.price || 0,
      })),
    });
  } catch (error) {
    console.error("FURGONETKA GET ORDER ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
