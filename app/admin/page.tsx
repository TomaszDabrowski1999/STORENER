"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "../../components/AdminGuard";
import AdminLogoutButton from "../../components/AdminLogoutButton";
import {
  Package, Users, ShoppingBag, TrendingUp, Plus, List, ClipboardList,
  ArrowRight, Clock, CheckCircle, Truck, AlertCircle, BarChart3, Truck as TruckIcon
} from "lucide-react";

type RecentOrder = {
  id: number; createdAt: string; total: number;
  status: "NOWE" | "W_REALIZACJI" | "WYSLANE";
  fullName: string; email: string;
  user: { id: number; fullName: string; email: string } | null;
};

type DashboardData = {
  productsCount: number; usersCount: number; ordersCount: number;
  revenue: number; recentOrders: RecentOrder[];
};

const STATUS = {
  NOWE:         { label: "Nowe",         cls: "bg-blue-50 text-blue-700 border border-blue-100",   icon: Clock },
  W_REALIZACJI: { label: "W realizacji", cls: "bg-amber-50 text-amber-700 border border-amber-100", icon: Package },
  WYSLANE:      { label: "Wysłane",      cls: "bg-green-50 text-green-700 border border-green-100", icon: Truck },
};

const fmt = (v: number) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(v);
const fmtDate = (v: string) => new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(v));

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d); })
      .catch(() => setError("Błąd połączenia"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminGuard>
      <div className="flex min-h-screen" style={{ background: "#f0f0ee" }}>
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col bg-[#0a0a0a] md:flex" style={{ minHeight: "100vh" }}>
          <div className="border-b border-white/8 p-5">
            <img src="/storener-logo.png" alt="STORENER" className="h-auto w-32 object-contain brightness-200" />
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Panel admina</p>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            {[
              { href: "/admin", label: "Dashboard", icon: BarChart3, active: true },
              { href: "/admin/produkty", label: "Produkty", icon: Package },
              { href: "/admin/produkty/dodaj", label: "Dodaj produkt", icon: Plus },
              { href: "/admin/zamowienia", label: "Zamówienia", icon: ClipboardList },
              { href: "/admin/klienci", label: "Klienci", icon: Users },
              { href: "/admin/furgonetka", label: "Furgonetka", icon: TruckIcon },
            ].map(({ href, label, icon: Icon, active }) => (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/6 hover:text-white/80"}`}>
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/8 p-3">
            <Link href="/" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:text-white/70">
              <ArrowRight className="h-3.5 w-3.5" /> Przejdź do sklepu
            </Link>
            <div className="mt-1">
              <AdminLogoutButton />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b bg-white px-8 py-4" style={{ borderColor: "#e8e8e6" }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Panel administracyjny</p>
              <h1 className="text-xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/produkty/dodaj" className="flex items-center gap-2 rounded-xl bg-[#0a0a0a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a1a1a]">
                <Plus className="h-4 w-4" /> Dodaj produkt
              </Link>
              <Link href="/admin/zamowienia" className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400" style={{ borderColor: "#e8e8e6" }}>
                <ClipboardList className="h-4 w-4" /> Zamówienia
              </Link>
            </div>
          </div>

          <div className="p-8">
            {loading && (
              <div className="grid gap-4 md:grid-cols-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl skeleton" />)}
              </div>
            )}
            {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">{error}</div>}

            {data && (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Produkty", value: data.productsCount, sub: "w ofercie sklepu", icon: Package, color: "bg-blue-50 text-blue-600", href: "/admin/produkty" },
                    { label: "Użytkownicy", value: data.usersCount, sub: "zarejestrowanych", icon: Users, color: "bg-purple-50 text-purple-600", href: "/admin/klienci" },
                    { label: "Zamówienia", value: data.ordersCount, sub: "wszystkich", icon: ShoppingBag, color: "bg-amber-50 text-amber-600", href: "/admin/zamowienia" },
                    { label: "Przychód", value: fmt(data.revenue), sub: "łączna wartość", icon: TrendingUp, color: "bg-green-50 text-green-600", href: null, big: true },
                  ].map(({ label, value, sub, icon: Icon, color, href, big }) => (
                    <div key={label} className="rounded-2xl bg-white p-5" style={{ border: "1px solid #e8e8e6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                      <div className="flex items-start justify-between">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                          <Icon className="h-[18px] w-[18px]" />
                        </div>
                        {href && (
                          <Link href={href} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 transition hover:bg-gray-50 hover:text-gray-600">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                      <p className={`mt-3 font-bold text-gray-950 ${big ? "text-xl" : "text-2xl"}`} style={{ fontFamily: "'Syne', system-ui" }}>{value}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{label} – {sub}</p>
                    </div>
                  ))}
                </div>

                {/* Orders + Actions */}
                <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
                  {/* Recent orders */}
                  <div className="rounded-2xl bg-white" style={{ border: "1px solid #e8e8e6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "#e8e8e6" }}>
                      <h2 className="font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Ostatnie zamówienia</h2>
                      <Link href="/admin/zamowienia" className="flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-gray-900">
                        Wszystkie <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    {data.recentOrders.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <ShoppingBag className="mx-auto mb-3 h-10 w-10 opacity-30" />
                        <p className="font-medium">Brak zamówień</p>
                      </div>
                    ) : (
                      <div className="divide-y" style={{ borderColor: "#f0f0ee" }}>
                        {data.recentOrders.map((order) => {
                          const s = STATUS[order.status];
                          const SIcon = s.icon;
                          return (
                            <Link key={order.id} href={`/admin/zamowienia/${order.id}`} className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-gray-50/60">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                  <SIcon className="h-4 w-4 text-gray-500" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-gray-900">#{order.id}</span>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${s.cls}`}>{s.label}</span>
                                  </div>
                                  <p className="mt-0.5 truncate text-xs text-gray-400">{order.fullName} · {fmtDate(order.createdAt)}</p>
                                </div>
                              </div>
                              <span className="font-bold text-gray-950 shrink-0">{fmt(order.total)}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid #e8e8e6" }}>
                      <h3 className="mb-4 font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Szybkie akcje</h3>
                      <div className="space-y-2">
                        {[
                          { href: "/admin/produkty/dodaj", label: "Dodaj produkt", icon: Plus, primary: true },
                          { href: "/admin/produkty", label: "Lista produktów", icon: List },
                          { href: "/admin/zamowienia", label: "Zarządzaj zamówieniami", icon: ClipboardList },
                          { href: "/admin/furgonetka", label: "Konfiguracja Furgonetki", icon: TruckIcon },
                        ].map(({ href, label, icon: Icon, primary }) => (
                          <Link key={href} href={href} className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${primary ? "bg-[#0a0a0a] text-white hover:bg-[#1a1a1a]" : "border text-gray-700 hover:border-gray-400 hover:text-gray-900"}`} style={!primary ? { borderColor: "#e8e8e6" } : {}}>
                            <Icon className="h-4 w-4 shrink-0" /> {label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Stats summary */}
                    <div className="rounded-2xl bg-[#0a0a0a] p-5 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Statystyki</p>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/60">Konwersja</span>
                          <span className="text-sm font-bold">{data.ordersCount > 0 && data.usersCount > 0 ? ((data.ordersCount / data.usersCount) * 100).toFixed(0) : 0}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/60">Śr. zamówienie</span>
                          <span className="text-sm font-bold">{data.ordersCount > 0 ? fmt(data.revenue / data.ordersCount) : "—"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/60">Produktów</span>
                          <span className="text-sm font-bold">{data.productsCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
