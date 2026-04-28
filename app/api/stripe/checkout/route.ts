import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      items,
      fullName,
      email,
      address,
      city,
      postalCode,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Koszyk jest pusty" },
        { status: 400 }
      );
    }

    if (!fullName || !email || !address || !city || !postalCode) {
      return NextResponse.json(
        { error: "Brak danych klienta" },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const userId =
      session?.user?.id && !Number.isNaN(Number(session.user.id))
        ? Number(session.user.id)
        : null;

    const order = await prisma.order.create({
      data: {
        total,
        fullName,
        email,
        address,
        city,
        postalCode,
        paymentMethod: "KARTA",
        paymentStatus: "OCZEKUJE",
        userId,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        },
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/zamowienie/${order.id}?stripe=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?stripe=cancel`,
      customer_email: email,
      metadata: {
        orderId: String(order.id),
      },
      line_items: items.map((item: any) => ({
        quantity: item.quantity,
        price_data: {
          currency: "pln",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
      })),
    });

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);

    return NextResponse.json(
      { error: "Nie udało się utworzyć płatności Stripe" },
      { status: 500 }
    );
  }
}