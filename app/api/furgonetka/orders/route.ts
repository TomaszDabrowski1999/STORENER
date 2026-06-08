import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Furgonetka calls this endpoint to fetch orders for shipment creation
// GET /api/furgonetka/orders - returns orders list
// GET /api/furgonetka/orders?id=123 - returns single order
// POST /api/furgonetka/orders/{id}/tracking_number - receives tracking update

export async function GET(request: Request) {
  // Verify Furgonetka token
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || "";
  const expectedToken = process.env.FURGONETKA_WEBHOOK_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const status = searchParams.get("status");

  try {
    if (id) {
      // Single order
      const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
          items: {
            include: {
              product: { select: { name: true, image: true, price: true } },
            },
          },
        },
      });

      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

      return NextResponse.json(formatOrderForFurgonetka(order));
    }

    // Orders list
    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: {
            include: {
              product: { select: { name: true, image: true, price: true } },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders: orders.map(formatOrderForFurgonetka),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("FURGONETKA GET ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function formatOrderForFurgonetka(order: any) {
  return {
    id: String(order.id),
    status: order.status,
    payment_status: order.paymentStatus,
    created_at: order.createdAt.toISOString(),
    total: order.total,
    currency: "PLN",
    customer: {
      name: order.fullName,
      email: order.email,
    },
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
    items: order.items?.map((item: any) => ({
      id: String(item.id),
      name: item.product?.name || "Produkt",
      quantity: item.quantity,
      price: item.product?.price || 0,
    })) || [],
  };
}
