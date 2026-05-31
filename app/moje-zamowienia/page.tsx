"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UserGuard from "../../components/UserGuard";

type OrderItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string | null;
    slug?: string | null;
  };
};

type Order = {
  id: number;
  createdAt: string;
  total: number;
  status: "NOWE" | "W_REALIZACJI" | "WYSLANE";
  paymentMethod: "BLIK" | "KARTA" | "PRZELEW" | "POBRANIE";
  paymentStatus: "OCZEKUJE" | "OPLACONA" | "NIEUDANA";
  shippingMethodName?: string;
  shippingEstimatedDelivery?: string;
  items: OrderItem[];
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const getStatusLabel = (status: Order["status"]) => {
  if (status === "NOWE") return "Nowe";
  if (status === "W_REALIZACJI") return "W realizacji";
  return "Wysłane";
};

const getStatusClasses = (status: Order["status"]) => {
  if (status === "NOWE") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (status === "W_REALIZACJI") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
};

const getPaymentStatusLabel = (status: Order["paymentStatus"]) => {
  if (status === "OCZEKUJE") return "Oczekuje na płatność";
  if (status === "OPLACONA") return "Opłacona";
  return "Nieudana";
};

const getPaymentStatusClasses = (status: Order["paymentStatus"]) => {
  if (status === "OCZEKUJE") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (status === "OPLACONA") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-red-50 text-red-700 ring-red-200";
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"WSZYSTKIE" | Order["status"]>("WSZYSTKIE");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch("/api/my-orders");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Nie udało się pobrać zamówień");
          return;
        }

        setOrders(data);
      } catch {
        setError("Wystąpił błąd połączenia");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "WSZYSTKIE") return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [activeFilter, orders]);

  const paidCount = orders.filter((order) => order.paymentStatus === "OPLACONA").length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <UserGuard>
      <main className="min-h-screen bg-[#f3f4f6]">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
                  panel klienta
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
                  Moje zamówienia
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                  Pełna historia zakupów, status realizacji, płatności i lista produktów w każdym zamówieniu.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/konto" className="rounded-2xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-950 transition hover:border-gray-950">
                  Wróć do panelu
                </Link>
                <Link href="/produkty" className="rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:opacity-90">
                  Kontynuuj zakupy
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Liczba zamówień</p>
              <p className="mt-3 text-4xl font-black text-gray-950">{orders.length}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Opłacone</p>
              <p className="mt-3 text-4xl font-black text-gray-950">{paidCount}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Łączna wartość</p>
              <p className="mt-3 text-3xl font-black text-gray-950">{formatPrice(totalSpent)}</p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-3 rounded-3xl border border-gray-200 bg-white p-3 shadow-sm">
            {[
              ["WSZYSTKIE", "Wszystkie"],
              ["NOWE", "Nowe"],
              ["W_REALIZACJI", "W realizacji"],
              ["WYSLANE", "Wysłane"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveFilter(value as typeof activeFilter)}
                className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
                  activeFilter === value
                    ? "bg-gray-950 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <p className="font-medium text-gray-600">Ładowanie zamówień...</p>
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
              <p className="font-semibold text-red-700">{error}</p>
            </div>
          )}

          {!isLoading && !error && filteredOrders.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-black text-gray-950">Brak zamówień w tej sekcji</h2>
              <p className="mt-3 text-gray-600">Po złożeniu zamówienia pojawi się ono w panelu klienta.</p>
              <Link href="/produkty" className="mt-6 inline-flex rounded-2xl bg-gray-950 px-6 py-3 font-bold text-white transition hover:opacity-90">
                Zobacz produkty
              </Link>
            </div>
          )}

          {!isLoading && !error && filteredOrders.length > 0 && (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <article key={order.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-2xl font-black text-gray-950">Zamówienie #{order.id}</h2>
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${getStatusClasses(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${getPaymentStatusClasses(order.paymentStatus)}`}>
                            {getPaymentStatusLabel(order.paymentStatus)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Złożone: {formatDate(order.createdAt)}</p>
                      </div>

                      <div className="rounded-2xl bg-gray-950 px-6 py-4 text-white lg:text-right">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300">Razem</p>
                        <p className="mt-1 text-2xl font-black">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 p-6 xl:grid-cols-[1fr_280px]">
                    <div>
                      <h3 className="text-lg font-black text-gray-950">Produkty</h3>
                      <div className="mt-4 space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-4 rounded-2xl border border-gray-100 p-4">
                            <div className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl bg-gray-100">
                              {item.product.image ? (
                                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">Brak zdjęcia</div>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-bold text-gray-950">{item.product.name}</p>
                                <p className="mt-1 text-sm text-gray-500">Ilość: {item.quantity} × {formatPrice(item.product.price)}</p>
                              </div>
                              <p className="font-black text-gray-950">{formatPrice(item.product.price * item.quantity)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <aside className="space-y-3 rounded-3xl border border-gray-100 bg-gray-50 p-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Dostawa</p>
                        <p className="mt-1 font-semibold text-gray-950">{order.shippingMethodName || "Standardowa"}</p>
                        <p className="mt-1 text-sm text-gray-500">{order.shippingEstimatedDelivery || "1-2 dni robocze"}</p>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Płatność</p>
                        <p className="mt-1 font-semibold text-gray-950">{order.paymentMethod}</p>
                      </div>
                      <Link href={`/zamowienia/${order.id}`} className="block rounded-2xl bg-white px-5 py-3 text-center font-bold text-gray-950 ring-1 ring-gray-200 transition hover:ring-gray-950">
                        Szczegóły zamówienia
                      </Link>
                    </aside>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </UserGuard>
  );
}
