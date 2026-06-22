import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Furgonetka calls this endpoint to fetch orders for shipment creation
// GET /api/furgonetka/orders          - lista zamówień gotowych do wysyłki
// GET /api/furgonetka/orders?id=123   - pojedyncze zamówienie
// GET /api/furgonetka/orders?all=1    - wszystkie zamówienia (z pominięciem domyślnego filtra)
// POST /api/furgonetka/orders/{id}    - odbiór informacji o przesyłce (numer listu)

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
  const all = searchParams.get("all");

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

    // Lista zamówień.
    // Domyślnie pokazujemy Furgonetce tylko to, co realnie da się wysłać kurierem:
    //  - opłacone albo płatne za pobraniem (POBRANIE),
    //  - z wyłączeniem odbioru osobistego (nie nadajemy go kurierem),
    //  - jeszcze nie wysłane.
    // Filtr można nadpisać parametrem ?status=... lub całkowicie pominąć przez ?all=1.
    const where: any = {};
    if (status) {
      where.status = status;
    } else if (!all) {
      where.AND = [
        { OR: [{ paymentStatus: "OPLACONA" }, { paymentMethod: "POBRANIE" }] },
        { NOT: { shippingMethod: "ODBIOR_OSOBISTY" } },
        { NOT: { status: "WYSLANE" } },
      ];
    }

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
      phone: order.phone || null,
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
    tracking: {
      number: order.trackingNumber || null,
      carrier: order.trackingCarrier || null,
    },
    items: order.items?.map((item: any) => ({
      id: String(item.id),
      name: item.product?.name || "Produkt",
      quantity: item.quantity,
      price: item.product?.price || 0,
    })) || [],
  };
}
