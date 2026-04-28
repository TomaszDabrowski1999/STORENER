"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UserGuard from "../../components/UserGuard";
import { getCurrentUser } from "../../lib/user-auth";

type OrderItem = {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
};

type Order = {
  id: number;
  createdAt: string;
  total: number;
  status: "NOWE" | "W_REALIZACJI" | "WYSLANE";
  paymentMethod: "BLIK" | "KARTA" | "PRZELEW" | "POBRANIE";
  paymentStatus: "OCZEKUJE" | "OPLACONA" | "NIEUDANA";
  items: OrderItem[];
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const currentUser = getCurrentUser();

        if (!currentUser) {
          setError("Użytkownik nie jest zalogowany");
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/my-orders/${currentUser.id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Nie udało się pobrać zamówień");
          setIsLoading(false);
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

  const getStatusLabel = (status: Order["status"]) => {
    if (status === "NOWE") return "Nowe";
    if (status === "W_REALIZACJI") return "W realizacji";
    return "Wysłane";
  };

  const getStatusClasses = (status: Order["status"]) => {
    if (status === "NOWE") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "W_REALIZACJI") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    return "border-green-200 bg-green-50 text-green-700";
  };

  const getPaymentStatusClasses = (status: Order["paymentStatus"]) => {
    if (status === "OCZEKUJE") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    if (status === "OPLACONA") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    return "border-red-200 bg-red-50 text-red-700";
  };

  const getPaymentStatusLabel = (status: Order["paymentStatus"]) => {
    if (status === "OCZEKUJE") return "Oczekuje";
    if (status === "OPLACONA") return "Opłacona";
    return "Nieudana";
  };

  return (
    <UserGuard>
      <main className="min-h-screen bg-gray-50">
        <section className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              historia zakupów
            </p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900">
              Moje zamówienia
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              Sprawdź status swoich zamówień, metody płatności i zawartość
              każdego zakupu.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-8 flex flex-wrap gap-4">
            <Link
              href="/konto"
              className="rounded-xl border border-black px-5 py-3 font-medium text-black transition hover:bg-black hover:text-white"
            >
              Wróć do konta
            </Link>

            <Link
              href="/produkty"
              className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              Kontynuuj zakupy
            </Link>
          </div>

          {isLoading && (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-gray-600">Ładowanie zamówień...</p>
            </div>
          )}

          {error && (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && orders.length === 0 && (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">
                Nie masz jeszcze żadnych zamówień
              </h2>
              <p className="mt-3 text-gray-600">
                Gdy złożysz pierwsze zamówienie, pojawi się właśnie tutaj.
              </p>

              <Link
                href="/produkty"
                className="mt-6 inline-block rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
              >
                Zobacz produkty
              </Link>
            </div>
          )}

          {!isLoading && !error && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-3xl bg-white p-8 shadow-sm"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Zamówienie #{order.id}
                        </h2>

                        <span
                          className={`rounded-full border px-3 py-1 text-sm font-semibold ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-sm font-semibold ${getPaymentStatusClasses(
                            order.paymentStatus
                          )}`}
                        >
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-sm text-gray-500">Status zamówienia</p>
                          <p className="mt-2 font-semibold text-black">
                            {getStatusLabel(order.status)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-sm text-gray-500">Płatność</p>
                          <p className="mt-2 font-semibold text-black">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-black px-6 py-5 text-white lg:min-w-[220px]">
                      <p className="text-sm uppercase tracking-[0.2em] text-gray-300">
                        Razem
                      </p>
                      <p className="mt-3 text-3xl font-bold">
                        {order.total.toFixed(2)} zł
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Produkty w zamówieniu
                    </h3>

                    <div className="mt-5 space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-base font-semibold text-gray-900">
                              {item.product.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Ilość: {item.quantity}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Cena za sztukę: {item.product.price.toFixed(2)} zł
                            </p>
                          </div>

                          <p className="text-lg font-bold text-black">
                            {(item.product.price * item.quantity).toFixed(2)} zł
                          </p>
                        </div>
                      ))}
                    </div>
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