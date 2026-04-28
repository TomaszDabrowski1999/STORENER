import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../auth";

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
      paymentMethod,
    } = body;

    if (!items || items.length === 0) {
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

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Wybierz metodę płatności" },
        { status: 400 }
      );
    }

    const allowedMethods = ["BLIK", "KARTA", "PRZELEW", "POBRANIE"];

    if (!allowedMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Nieprawidłowa metoda płatności" },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const paymentStatus =
      paymentMethod === "POBRANIE" ? "OCZEKUJE" : "OPLACONA";

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
        paymentMethod,
        paymentStatus,
        userId,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd przy tworzeniu zamówienia" },
      { status: 500 }
    );
  }
}