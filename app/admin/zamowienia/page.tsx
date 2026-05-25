"use client";

import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";
import { formatShippingMethod } from "../../../lib/shipping";

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
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: "BLIK" | "KARTA" | "PRZELEW" | "POBRANIE";
  paymentStatus: "OCZEKUJE" | "OPLACONA" | "NIEUDANA";
  shippingMethod?: string;
  shippingMethodName?: string | null;
  shippingPrice?: number | null;
  shippingPoint?: string | null;
  shippingEstimatedDelivery?: string | null;
  items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();

      if (!res.ok) {
        setError("Nie udało się pobrać zamówień");
        return;
      }

      setOrders(data);
    } catch {
      setError("Błąd połączenia");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (
    orderId: number,
    status: "NOWE" | "W_REALIZACJI" | "WYSLANE"
  ) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Nie udało się zmienić statusu");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch {
      alert("Błąd połączenia");
    }
  };

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

  const getPaymentStatusLabel = (status: Order["paymentStatus"]) => {
    if (status === "OCZEKUJE") return "Oczekuje";
    if (status === "OPLACONA") return "Opłacona";
    return "Nieudana";
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

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <section className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              panel administracyjny
            </p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900">
              Zamówienia
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              Monitoruj zamówienia klientów, płatności i przebieg realizacji w
              jednym miejscu.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          {error && (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!error && orders.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">
                Brak zamówień
              </h2>
              <p className="mt-3 text-gray-600">
                Gdy pojawią się zamówienia klientów, zobaczysz je tutaj.
              </p>
            </div>
          ) : null}

          {!error && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-3xl bg-white p-8 shadow-sm"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex-1">
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

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                          <p className="text-sm text-gray-500">Klient</p>
                          <p className="mt-2 font-semibold text-black">
                            {order.fullName}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {order.email}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                          <p className="text-sm text-gray-500">Adres</p>
                          <p className="mt-2 font-semibold text-black">
                            {order.address}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {order.postalCode} {order.city}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                          <p className="text-sm text-gray-500">
                            Metoda dostawy
                          </p>
                          <p className="mt-2 font-semibold text-black">
                            {order.shippingMethodName || formatShippingMethod(order.shippingMethod)}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
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

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                          <p className="text-sm text-gray-500">
                            Metoda płatności
                          </p>
                          <p className="mt-2 font-semibold text-black">
                            {order.paymentMethod}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                          <p className="text-sm text-gray-500">
                            Status płatności
                          </p>
                          <p className="mt-2 font-semibold text-black">
                            {getPaymentStatusLabel(order.paymentStatus)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full rounded-3xl bg-black p-6 text-white xl:max-w-xs">
                      <p className="text-sm uppercase tracking-[0.2em] text-gray-300">
                        wartość
                      </p>
                      <p className="mt-3 text-3xl font-bold">
                        {order.total.toFixed(2)} zł
                      </p>

                      <div className="mt-6">
                        <label className="mb-2 block text-sm text-gray-300">
                          Zmień status
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(
                              order.id,
                              e.target.value as Order["status"]
                            )
                          }
                          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
                        >
                          <option value="NOWE" className="text-black">
                            Nowe
                          </option>
                          <option
                            value="W_REALIZACJI"
                            className="text-black"
                          >
                            W realizacji
                          </option>
                          <option value="WYSLANE" className="text-black">
                            Wysłane
                          </option>
                        </select>
                      </div>
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
          ) : null}
        </section>
      </main>
    </AdminGuard>
  );
}