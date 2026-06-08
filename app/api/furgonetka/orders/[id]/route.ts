import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// Furgonetka sends tracking info to this endpoint when shipment is created
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

    const body = await request.json();
    const { tracking_number, carrier } = body;

    // Update order status to W_REALIZACJI when shipment is created
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "W_REALIZACJI" },
    });

    console.log(`Furgonetka tracking update for order #${orderId}: ${carrier} ${tracking_number}`);

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

    return NextResponse.json({
      id: String(order.id),
      status: order.status,
      payment_status: order.paymentStatus,
      created_at: order.createdAt.toISOString(),
      total: order.total,
      currency: "PLN",
      customer: { name: order.fullName, email: order.email },
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
        price: order.shippingPrice,
        point: order.shippingPoint || null,
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
