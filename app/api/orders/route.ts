import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { getShippingOption, formatShippingMethod } from "@/lib/shipping";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const resend = new Resend(process.env.RESEND_API_KEY);

function getStockStatus(stock: number) {
  if (stock <= 0) return "BRAK";
  if (stock <= 5) return "MALO_SZTUK";
  return "DOSTEPNY";
}


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

    const normalizedItems = items.map((item: any) => ({
      id: Number(item.id),
      quantity: Number(item.quantity),
    }));

    if (
      normalizedItems.some(
        (item: { id: number; quantity: number }) =>
          !item.id ||
          Number.isNaN(item.id) ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
      )
    ) {
      return NextResponse.json(
        { error: "Nieprawidłowe produkty w koszyku" },
        { status: 400 }
      );
    }

    const productIds = normalizedItems.map((item: { id: number }) => item.id);

    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
      },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "Jeden z produktów jest niedostępny" },
        { status: 400 }
      );
    }

    const productById = new Map(dbProducts.map((product) => [product.id, product]));

    for (const item of normalizedItems) {
      const product = productById.get(item.id);

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: product
              ? `Produkt „${product.name}” ma dostępne tylko ${product.stock} szt.`
              : "Produkt jest niedostępny",
          },
          { status: 400 }
        );
      }
    }

    const subtotal = normalizedItems.reduce((sum: number, item: any) => {
      const product = productById.get(item.id);
      return sum + Number(product?.price || 0) * item.quantity;
    }, 0);

    const shippingPrice = shippingOption.price;
    const total = subtotal + shippingPrice;

    const paymentStatus = "OCZEKUJE";

    const userId =
      session?.user?.id && !Number.isNaN(Number(session.user.id))
        ? Number(session.user.id)
        : null;

    const order = await prisma.$transaction(async (tx) => {
      for (const item of normalizedItems) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.id,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (updated.count !== 1) {
          throw new Error("OUT_OF_STOCK");
        }

        const productAfterUpdate = await tx.product.findUnique({
          where: { id: item.id },
          select: { stock: true },
        });

        await tx.product.update({
          where: { id: item.id },
          data: {
            stockStatus: getStockStatus(productAfterUpdate?.stock || 0),
          },
        });
      }

      return tx.order.create({
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
            create: normalizedItems.map((item: any) => ({
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

    if (error instanceof Error && error.message === "OUT_OF_STOCK") {
      return NextResponse.json(
        { error: "Jeden z produktów nie ma już wystarczającej ilości na stanie" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Błąd przy tworzeniu zamówienia" },
      { status: 500 }
    );
  }
}