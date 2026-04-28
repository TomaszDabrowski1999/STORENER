"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLogoutButton from "../../components/AdminLogoutButton";

type RecentOrder = {
  id: number;
  createdAt: string;
  total: number;
  status: "NOWE" | "W_REALIZACJI" | "WYSLANE";
  fullName: string;
  email: string;
  user: {
    id: number;
    fullName: string;
    email: string;
  } | null;
};

type DashboardData = {
  productsCount: number;
  usersCount: number;
  ordersCount: number;
  revenue: number;
  recentOrders: RecentOrder[];
};

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Nie udało się pobrać dashboardu");
          setIsLoading(false);
          return;
        }

        setData(result);
      } catch {
        setError("Wystąpił błąd połączenia");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const getStatusLabel = (status: RecentOrder["status"]) => {
    if (status === "NOWE") return "Nowe";
    if (status === "W_REALIZACJI") return "W realizacji";
    return "Wysłane";
  };

  const getStatusClasses = (status: RecentOrder["status"]) => {
    if (status === "NOWE") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (status === "W_REALIZACJI") {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    return "bg-green-50 text-green-700 border-green-200";
  };

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <section className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  panel administracyjny
                </p>
                <h1 className="mt-3 text-4xl font-bold text-gray-900">
                  Dashboard sklepu
                </h1>
                <p className="mt-3 max-w-2xl text-gray-600">
                  Zarządzaj ofertą, monitoruj zamówienia i kontroluj podstawowe
                  statystyki sklepu w jednym miejscu.
                </p>
              </div>

              <AdminLogoutButton />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/produkty"
              className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              Lista produktów
            </Link>

            <Link
              href="/admin/produkty/dodaj"
              className="rounded-xl border border-black px-5 py-3 font-medium text-black transition hover:bg-black hover:text-white"
            >
              Dodaj produkt
            </Link>

            <Link
              href="/admin/zamowienia"
              className="rounded-xl border border-black px-5 py-3 font-medium text-black transition hover:bg-black hover:text-white"
            >
              Zamówienia
            </Link>
          </div>

          {isLoading && (
            <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-gray-600">Ładowanie dashboardu...</p>
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {data && (
            <>
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="inline-flex rounded-2xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                    Produkty
                  </div>
                  <p className="mt-5 text-4xl font-bold text-gray-900">
                    {data.productsCount}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Łączna liczba produktów w sklepie
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="inline-flex rounded-2xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                    Użytkownicy
                  </div>
                  <p className="mt-5 text-4xl font-bold text-gray-900">
                    {data.usersCount}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Zarejestrowane konta użytkowników
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="inline-flex rounded-2xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                    Zamówienia
                  </div>
                  <p className="mt-5 text-4xl font-bold text-gray-900">
                    {data.ordersCount}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Wszystkie złożone zamówienia
                  </p>
                </div>

                <div className="rounded-3xl bg-black p-6 text-white shadow-sm">
                  <div className="inline-flex rounded-2xl bg-white/10 px-3 py-2 text-sm font-semibold text-gray-200">
                    Przychód
                  </div>
                  <p className="mt-5 text-4xl font-bold">
                    {data.revenue.toFixed(2)} zł
                  </p>
                  <p className="mt-2 text-sm text-gray-300">
                    Łączna wartość wszystkich zamówień
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                        aktywność
                      </p>
                      <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        Ostatnie zamówienia
                      </h2>
                    </div>

                    <Link
                      href="/admin/zamowienia"
                      className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-black hover:text-black"
                    >
                      Zobacz wszystkie
                    </Link>
                  </div>

                  {data.recentOrders.length === 0 ? (
                    <p className="mt-6 text-gray-600">Brak zamówień.</p>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {data.recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-2xl border border-gray-200 p-5 transition hover:border-gray-300"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <p className="text-lg font-semibold text-gray-900">
                                  Zamówienie #{order.id}
                                </p>
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                    order.status
                                  )}`}
                                >
                                  {getStatusLabel(order.status)}
                                </span>
                              </div>

                              <p className="mt-2 text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>

                              <div className="mt-3 text-sm text-gray-700">
                                <p>{order.fullName}</p>
                                <p>{order.email}</p>
                              </div>

                              {order.user && (
                                <p className="mt-3 text-sm text-gray-500">
                                  Konto: {order.user.fullName} ({order.user.email})
                                </p>
                              )}
                            </div>

                            <div className="text-left lg:text-right">
                              <p className="text-2xl font-bold text-black">
                                {order.total.toFixed(2)} zł
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Zamówienie klienta
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      szybkie akcje
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                      Zarządzanie
                    </h2>

                    <div className="mt-6 space-y-3">
                      <Link
                        href="/admin/produkty/dodaj"
                        className="block rounded-2xl bg-black px-5 py-4 font-medium text-white transition hover:opacity-90"
                      >
                        Dodaj nowy produkt
                      </Link>

                      <Link
                        href="/admin/produkty"
                        className="block rounded-2xl border border-gray-300 px-5 py-4 font-medium text-gray-900 transition hover:border-black"
                      >
                        Edytuj ofertę sklepu
                      </Link>

                      <Link
                        href="/admin/zamowienia"
                        className="block rounded-2xl border border-gray-300 px-5 py-4 font-medium text-gray-900 transition hover:border-black"
                      >
                        Zarządzaj zamówieniami
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 p-6 text-white shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">
                      podsumowanie
                    </p>
                    <h2 className="mt-2 text-3xl font-bold">
                      Sklep działa i rośnie
                    </h2>

                    <p className="mt-4 leading-8 text-gray-200">
                      Masz już panel użytkownika, zamówienia, produkty, checkout,
                      reset hasła i dashboard admina. To jest już bardzo solidny
                      fundament sklepu.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </AdminGuard>
  );
}