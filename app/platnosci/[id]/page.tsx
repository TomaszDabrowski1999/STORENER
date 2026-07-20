import Link from "next/link";
import PaymentAction from "./PaymentAction";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ powrot?: string }>;
};

export default async function PaymentPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { powrot } = await searchParams;
  const orderId = Number(id);

  if (!orderId || Number.isNaN(orderId)) {
    notFound();
  }

  const session = await auth();

  if (!session?.user) {
    redirect(`/logowanie`);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const sessionUserId = Number(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin && (Number.isNaN(sessionUserId) || order.userId !== sessionUserId)) {
    notFound();
  }

  const isPaid = order.paymentStatus === "OPLACONA";
  const isReturnFromGateway = powrot === "1";

  const unitPriceOf = (item: { product: { price: number } }) =>
    (item as { price?: number }).price || item.product.price;

  const productsTotal = order.items.reduce(
    (sum, item) => sum + unitPriceOf(item) * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
            płatność zamówienia
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950">
            {isPaid
              ? `Zamówienie #${order.id} zostało opłacone`
              : `Zamówienie #${order.id} zostało utworzone`}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
            {isPaid
              ? "Dziękujemy! Płatność została zaksięgowana. Szczegóły znajdziesz w sekcji „Moje zamówienia”."
              : "Teraz możesz przejść do płatności. Zamówienie jest już zapisane w bazie i będzie widoczne w sekcji „Moje zamówienia”."}
          </p>

          {isReturnFromGateway && !isPaid ? (
            <div className="mt-6 max-w-2xl rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm leading-6 text-yellow-800">
              <p className="font-bold">Płatność jest jeszcze przetwarzana.</p>
              <p className="mt-1">
                Jeśli dokonano wpłaty, status zamówienia zaktualizuje się automatycznie w ciągu
                kilku chwil — odśwież tę stronę. Jeśli płatność się nie powiodła, możesz spróbować
                ponownie poniższym przyciskiem.
              </p>
            </div>
          ) : null}

          {isReturnFromGateway && isPaid ? (
            <div className="mt-6 max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold leading-6 text-emerald-800">
              Płatność potwierdzona przez Przelewy24. Dziękujemy!
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-gray-950">Podsumowanie produktów</h2>
          <div className="mt-5 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 p-4">
                <div>
                  <p className="font-bold text-gray-950">{item.product.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.quantity} × {formatPrice(unitPriceOf(item))}
                  </p>
                </div>
                <p className="font-black text-gray-950">
                  {formatPrice(unitPriceOf(item) * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-gray-950">Do zapłaty</h2>
          <div className="mt-5 space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Produkty</span>
              <strong className="text-gray-950">{formatPrice(productsTotal)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Dostawa</span>
              <strong className="text-gray-950">{formatPrice(order.shippingPrice)}</strong>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-bold text-gray-950">Razem</span>
                <strong className="text-2xl text-gray-950">{formatPrice(order.total)}</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-bold text-gray-950">Metoda płatności</p>
            <p className="mt-1">
              {order.paymentMethod === "POBRANIE"
                ? "Płatność przy odbiorze (pobranie)"
                : "Płatność online — Przelewy24"}
            </p>
            <p className="mt-3 font-bold text-gray-950">Status płatności</p>
            <p className="mt-1">
              {order.paymentStatus === "OPLACONA"
                ? "Opłacona"
                : order.paymentStatus === "NIEUDANA"
                  ? "Nieudana"
                  : "Oczekuje na płatność"}
            </p>
          </div>

          <PaymentAction
            orderId={order.id}
            paymentMethod={order.paymentMethod}
            paymentStatus={order.paymentStatus}
          />

          <Link
            href="/moje-zamowienia"
            className="mt-3 block rounded-2xl border border-gray-300 bg-white px-6 py-4 text-center font-black text-gray-950 transition hover:border-gray-950"
          >
            Przejdź do moich zamówień
          </Link>
        </aside>
      </section>
    </main>
  );
}
