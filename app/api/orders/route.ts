import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getShippingOption, formatShippingMethod } from "@/lib/shipping";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: unknown) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
      shippingMethod,
      shippingPoint,
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

    if (!shippingMethod) {
      return NextResponse.json(
        { error: "Wybierz metodę dostawy" },
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

    const shippingOption = getShippingOption(shippingMethod);

    if (!shippingOption) {
      return NextResponse.json(
        { error: "Nieprawidłowa metoda dostawy" },
        { status: 400 }
      );
    }

    if (shippingOption.requiresPoint && !String(shippingPoint || "").trim()) {
      return NextResponse.json(
        { error: "Podaj punkt odbioru lub numer paczkomatu" },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const shippingPrice = shippingOption.price;
    const total = subtotal + shippingPrice;

    const paymentStatus =
      paymentMethod === "POBRANIE" ? "OCZEKUJE" : "OPLACONA";

    const userId =
      session?.user?.id && !Number.isNaN(Number(session.user.id))
        ? Number(session.user.id)
        : null;

    const order = await (prisma.order as any).create({
      data: {
        total,
        fullName,
        email,
        address,
        city,
        postalCode,
        paymentMethod,
        shippingMethod,
        shippingMethodName: shippingOption.name,
        shippingPrice,
        shippingPoint: shippingPoint?.trim() || null,
        shippingEstimatedDelivery: shippingOption.estimatedDelivery,
        paymentStatus,
        userId,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const orderItemsHtml = order.items
      .map((item) => {
        const price = item.product.price;
        const itemTotal = price * item.quantity;

        return `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #eee;">${escapeHtml(item.product.name)}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${price.toFixed(2)} zł</td>
            <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${itemTotal.toFixed(2)} zł</td>
          </tr>
        `;
      })
      .join("");

    const { error: emailError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Sklep <onboarding@resend.dev>",
      to: email,
      subject: `Potwierdzenie zamówienia #${order.id}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
          <h2>Dziękujemy za złożenie zamówienia!</h2>
          <p>Cześć ${escapeHtml(fullName)},</p>
          <p>Otrzymaliśmy Twoje zamówienie <strong>#${order.id}</strong>.</p>

          <h3>Szczegóły zamówienia</h3>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <thead>
              <tr style="background:#f7f7f7;">
                <th style="padding:10px;text-align:left;">Produkt</th>
                <th style="padding:10px;text-align:center;">Ilość</th>
                <th style="padding:10px;text-align:right;">Cena</th>
                <th style="padding:10px;text-align:right;">Razem</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>

          <p><strong>Produkty:</strong> ${subtotal.toFixed(2)} zł</p>
          <p><strong>Dostawa:</strong> ${escapeHtml(shippingOption.name)} - ${shippingPrice === 0 ? "Gratis" : `${shippingPrice.toFixed(2)} zł`}</p>
          <p style="font-size:18px;"><strong>Łącznie: ${total.toFixed(2)} zł</strong></p>

          <h3>Dane dostawy</h3>
          <p>
            ${escapeHtml(fullName)}<br />
            ${escapeHtml(address)}<br />
            ${escapeHtml(postalCode)} ${escapeHtml(city)}
          </p>

          <p><strong>Metoda dostawy:</strong> ${escapeHtml(formatShippingMethod(shippingMethod))}</p>
          ${shippingPoint ? `<p><strong>Punkt odbioru:</strong> ${escapeHtml(shippingPoint)}</p>` : ""}
          <p><strong>Przewidywany czas dostawy:</strong> ${escapeHtml(shippingOption.estimatedDelivery)}</p>

          <p><strong>Metoda płatności:</strong> ${escapeHtml(paymentMethod)}</p>
          <p><strong>Status płatności:</strong> ${escapeHtml(paymentStatus)}</p>

          <p>Powiadomimy Cię o kolejnych etapach realizacji zamówienia.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("ORDER CONFIRMATION EMAIL ERROR:", emailError);
    }

    return NextResponse.json({
      ...order,
      emailSent: !emailError,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd przy tworzeniu zamówienia" },
      { status: 500 }
    );
  }
}