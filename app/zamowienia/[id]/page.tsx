import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { formatShippingMethod } from "../../../lib/shipping";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderSuccessPage({ params }: Props) {
  const { id } = await params;
  const orderId = Number(id);

  const order = await (prisma.order as any).findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Nie znaleziono zamówienia
          </h1>
          <p className="mt-3 text-gray-600">
            Zamówienie o podanym identyfikatorze nie istnieje lub zostało usunięte.
          </p>

          <Link
            href="/produkty"
            className="mt-6 inline-block rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
          >
            Wróć do zakupów
          </Link>
        </div>
      </main>
    );
  }

  const getStatusLabel = (status: typeof order.status) => {
    if (status === "NOWE") return "Nowe";
    if (status === "W_REALIZACJI") return "W realizacji";
    return "Wysłane";
  };

  const getPaymentStatusLabel = (status: typeof order.paymentStatus) => {
    if (status === "OCZEKUJE") return "Oczekuje";
    if (status === "OPLACONA") return "Opłacona";
    return "Nieudana";
  };

  const getStatusClasses = (status: typeof order.status) => {
    if (status === "NOWE") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "W_REALIZACJI") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    return "border-green-200 bg-green-50 text-green-700";
  };

  const getPaymentStatusClasses = (status: typeof order.paymentStatus) => {
    if (status === "OCZEKUJE") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    if (status === "OPLACONA") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    return "border-red-200 bg-red-50 text-red-700";
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                zamówienie przyjęte
              </p>

              <h1 className="mt-3 text-4xl font-bold text-gray-900">
                Dziękujemy za zakup
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                Twoje zamówienie zostało zapisane poprawnie. Poniżej znajdziesz
                jego szczegóły, status i podsumowanie produktów.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">
                  Numer zamówienia #{order.id}
                </span>

                <span
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClasses(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>

                <span
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${getPaymentStatusClasses(
                    order.paymentStatus
                  )}`}
                >
                  {getPaymentStatusLabel(order.paymentStatus)}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-black px-8 py-6 text-white shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-300">
                wartość zamówienia
              </p>
              <p className="mt-3 text-4xl font-bold">
                {order.total.toFixed(2)} zł
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                produkty
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Zawartość zamówienia
              </h2>

              <div className="mt-6 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Ilość: {item.quantity}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Cena za sztukę: {item.product.price.toFixed(2)} zł
                      </p>
                    </div>

                    <p className="text-xl font-bold text-black">
                      {(item.product.price * item.quantity).toFixed(2)} zł
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                dostawa i klient
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Dane zamówienia
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Imię i nazwisko</p>
                  <p className="mt-2 font-semibold text-black">
                    {order.fullName}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-2 font-semibold text-black">{order.email}</p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:col-span-2">
                  <p className="text-sm text-gray-500">Adres</p>
                  <p className="mt-2 font-semibold text-black">
                    {order.address}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {order.postalCode} {order.city}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Metoda dostawy</p>
                  <p className="mt-2 font-semibold text-black">
                    {order.shippingMethodName || formatShippingMethod(order.shippingMethod)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {order.shippingEstimatedDelivery || "1-3 dni robocze"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Koszt dostawy</p>
                  <p className="mt-2 font-semibold text-black">
                    {Number(order.shippingPrice || 0) === 0
                      ? "Gratis"
                      : `${Number(order.shippingPrice || 0).toFixed(2)} zł`}
                  </p>
                  {order.shippingPoint ? (
                    <p className="mt-1 text-sm text-gray-600">
                      Punkt: {order.shippingPoint}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                status
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Informacje
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Status zamówienia</span>
                  <span className="font-semibold text-black">
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Metoda dostawy</span>
                  <span className="text-right font-semibold text-black">
                    {order.shippingMethodName || formatShippingMethod(order.shippingMethod)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Koszt dostawy</span>
                  <span className="font-semibold text-black">
                    {Number(order.shippingPrice || 0) === 0
                      ? "Gratis"
                      : `${Number(order.shippingPrice || 0).toFixed(2)} zł`}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Metoda płatności</span>
                  <span className="font-semibold text-black">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Status płatności</span>
                  <span className="font-semibold text-black">
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Data złożenia</span>
                  <span className="font-semibold text-black">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Numer zamówienia</span>
                  <span className="font-semibold text-black">#{order.id}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 p-8 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">
                co dalej?
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                Śledź swoje zamówienie
              </h2>
              <p className="mt-4 leading-8 text-gray-200">
                Możesz wrócić do konta użytkownika lub przejść do listy swoich
                zamówień, aby później sprawdzić status realizacji.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/moje-zamowienia"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
                >
                  Moje zamówienia
                </Link>

                <Link
                  href="/konto"
                  className="inline-flex items-center justify-center rounded-xl border border-white px-5 py-3 font-medium text-white transition hover:bg-white hover:text-black"
                >
                  Wróć do konta
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <Link
                href="/produkty"
                className="inline-flex w-full items-center justify-center rounded-xl border border-black px-5 py-3 font-medium text-black transition hover:bg-black hover:text-white"
              >
                Kontynuuj zakupy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}