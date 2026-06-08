"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import UserGuard from "../../components/UserGuard";
import { Package, CreditCard, Truck, Clock, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";

type OrderItem = {
  id: number; quantity: number;
  product: { id: number; name: string; price: number; image?: string | null; slug?: string | null };
};

type Order = {
  id: number; createdAt: string; total: number;
  status: "NOWE" | "W_REALIZACJI" | "WYSLANE";
  paymentMethod: "BLIK" | "KARTA" | "PRZELEW" | "POBRANIE";
  paymentStatus: "OCZEKUJE" | "OPLACONA" | "NIEUDANA";
  shippingMethodName?: string; shippingEstimatedDelivery?: string;
  fullName: string; address: string; city: string; postalCode: string;
  items: OrderItem[];
};

const formatPrice = (v: number) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(v);
const formatDate = (v: string) => new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(v));

const STATUS_CONFIG = {
  NOWE:         { label: "Nowe",         cls: "bg-blue-50 text-blue-700 border-blue-100",    icon: Clock },
  W_REALIZACJI: { label: "W realizacji", cls: "bg-amber-50 text-amber-700 border-amber-100", icon: Package },
  WYSLANE:      { label: "Wysłane",      cls: "bg-green-50 text-green-700 border-green-100", icon: Truck },
};

const PAYMENT_CONFIG = {
  OCZEKUJE: { label: "Oczekuje", cls: "bg-amber-50 text-amber-700 border-amber-100" },
  OPLACONA: { label: "Opłacona", cls: "bg-green-50 text-green-700 border-green-100" },
  NIEUDANA: { label: "Nieudana", cls: "bg-red-50 text-red-700 border-red-100" },
};

const PAYMENT_LABELS = { BLIK: "BLIK", KARTA: "Karta płatnicza", PRZELEW: "Przelew bankowy", POBRANIE: "Za pobraniem" };

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"WSZYSTKIE" | Order["status"]>("WSZYSTKIE");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/my-orders").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setOrders(data);
      else setError(data.error || "Błąd pobierania zamówień");
    }).catch(() => setError("Błąd połączenia")).finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => filter === "WSZYSTKIE" ? orders : orders.filter(o => o.status === filter), [orders, filter]);
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const paidCount = orders.filter(o => o.paymentStatus === "OPLACONA").length;

  return (
    <UserGuard>
      <main className="min-h-screen" style={{ background: "var(--surface)" }}>
        {/* Header */}
        <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-5xl px-6 py-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4caf3d]">Panel klienta</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>Moje zamówienia</h1>

            {/* Stats */}
            {orders.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-3">
                {[
                  { label: "Zamówień", value: orders.length, icon: Package, color: "text-blue-500 bg-blue-50" },
                  { label: "Opłaconych", value: paidCount, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
                  { label: "Wydano łącznie", value: formatPrice(totalSpent), icon: CreditCard, color: "text-purple-600 bg-purple-50" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
                    <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-lg font-bold text-gray-950">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-8">
          {/* Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-1.5 rounded-xl border bg-white p-1" style={{ borderColor: "var(--border)" }}>
              {(["WSZYSTKIE", "NOWE", "W_REALIZACJI", "WYSLANE"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${filter === f ? "bg-[#0a0a0a] text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {f === "WSZYSTKIE" ? "Wszystkie" : STATUS_CONFIG[f].label}
                </button>
              ))}
            </div>
            <Link href="/konto" className="text-sm font-medium text-gray-500 transition hover:text-gray-800">← Wróć do konta</Link>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-2xl skeleton" />)}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" /> {error}
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="rounded-[28px] bg-white p-12 text-center" style={{ boxShadow: "var(--shadow-md)" }}>
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-200" />
              <p className="text-xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>Brak zamówień</p>
              <p className="mt-2 text-gray-500">{filter !== "WSZYSTKIE" ? "Brak zamówień w tej kategorii." : "Nie złożono jeszcze żadnego zamówienia."}</p>
              <Link href="/produkty" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0a0a0a] px-6 py-2.5 text-sm font-semibold text-white">
                Przeglądaj produkty
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {filtered.map((order) => {
              const status = STATUS_CONFIG[order.status];
              const payment = PAYMENT_CONFIG[order.paymentStatus];
              const StatusIcon = status.icon;
              const isOpen = expanded === order.id;

              return (
                <div key={order.id} className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                  {/* Order header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50/50"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                        <Package className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-gray-950">#{order.id}</span>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.cls}`}>
                            <StatusIcon className="h-3 w-3" /> {status.label}
                          </span>
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${payment.cls}`}>
                            {payment.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400">{formatDate(order.createdAt)} · {order.items.length} {order.items.length === 1 ? "produkt" : "produktów"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-lg font-bold text-gray-950">{formatPrice(order.total)}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: "var(--border)" }}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Products */}
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Produkty</p>
                          <div className="space-y-2">
                            {order.items.map(item => (
                              <div key={item.id} className="flex items-center gap-3">
                                {item.product.image && (
                                  <img src={item.product.image} alt={item.product.name} className="h-10 w-10 rounded-xl object-cover" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-800">{item.product.name}</p>
                                  <p className="text-xs text-gray-400">{item.quantity} szt. × {item.product.price.toFixed(2)} zł</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Dostawa</p>
                            <p className="text-sm font-medium text-gray-700">{order.shippingMethodName || "Standardowa"}</p>
                            {order.shippingEstimatedDelivery && <p className="text-xs text-gray-400">{order.shippingEstimatedDelivery}</p>}
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Płatność</p>
                            <p className="text-sm font-medium text-gray-700">{PAYMENT_LABELS[order.paymentMethod]}</p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Adres dostawy</p>
                            <p className="text-sm text-gray-600">{order.fullName}</p>
                            <p className="text-sm text-gray-600">{order.address}, {order.postalCode} {order.city}</p>
                          </div>
                        </div>
                      </div>

                      {order.paymentStatus === "OCZEKUJE" && (
                        <Link href={`/platnosci/${order.id}`} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#4caf3d] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#3a9a2c]">
                          <CreditCard className="h-4 w-4" /> Opłać zamówienie
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </UserGuard>
  );
}
