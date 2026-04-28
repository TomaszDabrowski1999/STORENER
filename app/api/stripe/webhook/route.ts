import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "../../../../lib/stripe";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("Brak podpisu Stripe", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error) {
    console.error("STRIPE WEBHOOK SIGNATURE ERROR:", error);
    return new Response("Nieprawidłowy podpis webhooka", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = Number(session.metadata?.orderId);

      if (!Number.isNaN(orderId)) {
        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            paymentStatus: "OPLACONA",
          },
        });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("STRIPE WEBHOOK ERROR:", error);
    return new Response("Webhook error", { status: 500 });
  }
}