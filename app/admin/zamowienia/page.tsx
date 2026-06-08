"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminGuard from "../../../components/AdminGuard";
import { formatShippingMethod } from "../../../lib/shipping";
import {
  Search, Download, Package, Clock, Truck, ChevronDown, ChevronUp,
  ArrowRight, BarChart3, Plus, ClipboardList, List, Truck as TruckIcon
} from "lucide-react";

type OrderItem = { id: number; quantity: number; product: { name: string; price: number } };
type Order = {
  id: number; createdAt: string; total: number;
  status: "NOWE" | "W_REALIZACJI" | "WYSLANE";
  fullName: string; email: string; address: string; city: string; postalCode: string;
  paymentMethod: "BLIK" | "KARTA" | "PRZELEW" | "POBRANIE";
  paymentStatus: "OCZEKUJE" | "OPLACONA" | "NIEUDANA";
  shippingMethod?: string; shippingMethodName?: string | null; shippingPrice?: number | null;
  shippingPoint?: string | null; items: OrderItem[];
};

const ORDER_STATUS = {
  NOWE:         { label: "Nowe",         cls: "bg-blue-50 text-blue-700 border-blue-100",   icon: Clock },
  W_REALIZACJI: { label: "W realizacji", cls: "bg-amber-50 text-amber-700 border-amber-100", icon: Package },
  WYSLANE:      { label: "Wysłane",      cls: "bg-green-50 text-green-700 border-green-100", icon: Truck },
};

const PAYMENT_STATUS = {
  OCZEKUJE: { label: "Oczekuje",  cls: "bg-amber-50 text-amber-700 border-amber-100" },
  OPLACONA: { label: "Opłacona", cls: "bg-green-50 text-green-700 border-green-100" },
  NIEUDANA: { label: "Nieudana",  cls: "bg-red-50 text-red-700 border-red-100" },
};

const fmt = (v: number) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(v);
const fmtDate = (v: string) => new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(v));

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders", { cache: "no-store" })
      .then(r => r.json())
      .then(d => { if (!Array.isArray(d)) setError(d.error || "Błąd"); else setOrders(d); })
      .catch(() => setError("Błąd połączenia"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => orders.filter(o => {
    const t = search.toLowerCase();
    return (
      (!t || String(o.id).includes(t) || o.fullName.toLowerCase().includes(t) || o.email.toLowerCase().includes(t)) &&
      (statusFilter === "ALL" || o.status === statusFilter) &&
      (paymentFilter === "ALL" || o.paymentStatus === paymentFilter)
    );
  }), [orders, search, statusFilter, paymentFilter]);

  const updateOrder = async (id: number, payload: any) => {
    const tid = toast.loading("Aktualizowanie...");
    const res = await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const d = await res.json();
    if (!res.ok) { toast.error(d.error || "Błąd", { id: tid }); return; }
    setOrders(prev => prev.map(o => o.id === id ? d : o));
    toast.success("Zaktualizowano", { id: tid });
  };

  const exportCsv = () => {
    const csv = [["ID","Data","Klient","Email","Status","Płatność","Wartość"],
      ...filtered.map(o => [o.id, fmtDate(o.createdAt), o.fullName, o.email, o.status, o.paymentStatus, o.total.toFixed(2)])
    ].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(";")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "zamowienia.csv"; a.click();
  };

  const revenue = filtered.reduce((s, o) => s + o.total, 0);

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
              { href: "/admin", label: "Dashboard", icon: BarChart3 },
              { href: "/admin/produkty", label: "Produkty", icon: Package },
              { href: "/admin/produkty/dodaj", label: "Dodaj produkt", icon: Plus },
              { href: "/admin/zamowienia", label: "Zamówienia", icon: ClipboardList, active: true },
              { href: "/admin/furgonetka", label: "Furgonetka", icon: TruckIcon },
            ].map(({ href, label, icon: Icon, active }) => (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/6 hover:text-white/80"}`}>
                <Icon className="h-4 w-4 shrink-0" />{label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/8 p-3">
            <Link href="/" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:text-white/70">
              <ArrowRight className="h-3.5 w-3.5" /> Sklep
            </Link>
          </div>
        </aside>

        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-white px-8 py-4" style={{ borderColor: "#e8e8e6" }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Panel administracyjny</p>
              <h1 className="text-xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Zamówienia ({filtered.length})</h1>
            </div>
            <button onClick={exportCsv} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400" style={{ borderColor: "#e8e8e6" }}>
              <Download className="h-4 w-4" /> Eksport CSV
            </button>
          </div>

          <div className="p-8 space-y-5">
            {/* Summary bar */}
            {orders.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Łącznie", value: filtered.length + " zamówień" },
                  { label: "Wartość filtrowanych", value: fmt(revenue) },
                  { label: "Nowych", value: filtered.filter(o => o.status === "NOWE").length },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-white px-4 py-3" style={{ border: "1px solid #e8e8e6" }}>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="mt-0.5 font-bold text-gray-950">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-4" style={{ border: "1px solid #e8e8e6" }}>
              <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: "#e8e8e6" }}>
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Szukaj po ID, kliencie, e-mailu…" className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400" />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm font-medium text-gray-700 outline-none" style={{ borderColor: "#e8e8e6" }}>
                <option value="ALL">Wszystkie statusy</option>
                <option value="NOWE">Nowe</option>
                <option value="W_REALIZACJI">W realizacji</option>
                <option value="WYSLANE">Wysłane</option>
              </select>
              <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm font-medium text-gray-700 outline-none" style={{ borderColor: "#e8e8e6" }}>
                <option value="ALL">Każda płatność</option>
                <option value="OCZEKUJE">Oczekuje</option>
                <option value="OPLACONA">Opłacona</option>
                <option value="NIEUDANA">Nieudana</option>
              </select>
            </div>

            {loading && <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl skeleton" />)}</div>}
            {error && <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

            {/* Orders list */}
            <div className="space-y-2">
              {filtered.map(order => {
                const s = ORDER_STATUS[order.status];
                const p = PAYMENT_STATUS[order.paymentStatus];
                const SIcon = s.icon;
                const isOpen = expanded === order.id;

                return (
                  <div key={order.id} className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid #e8e8e6" }}>
                    {/* Row */}
                    <button onClick={() => setExpanded(isOpen ? null : order.id)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-gray-50/50">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                        <SIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 min-w-0">
                        <span className="font-bold text-gray-950">#{order.id}</span>
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${s.cls}`}>{s.label}</span>
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${p.cls}`}>{p.label}</span>
                        <span className="text-sm text-gray-500">{order.fullName}</span>
                        <span className="hidden text-xs text-gray-400 sm:block">{fmtDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-gray-950">{fmt(order.total)}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                      </div>
                    </button>

                    {/* Expanded */}
                    {isOpen && (
                      <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: "#e8e8e6" }}>
                        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
                          {/* Left: details */}
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Klient</p>
                              <p className="font-medium text-gray-800">{order.fullName}</p>
                              <p className="text-sm text-gray-500">{order.email}</p>
                            </div>
                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Adres dostawy</p>
                              <p className="text-sm text-gray-700">{order.address}</p>
                              <p className="text-sm text-gray-700">{order.postalCode} {order.city}</p>
                              {order.shippingPoint && <p className="mt-1 text-xs text-gray-500">Punkt: {order.shippingPoint}</p>}
                            </div>
                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Dostawa</p>
                              <p className="text-sm text-gray-700">{order.shippingMethodName || formatShippingMethod(order.shippingMethod || "")}</p>
                              {order.shippingPrice != null && <p className="text-sm text-gray-500">{order.shippingPrice.toFixed(2)} zł</p>}
                            </div>
                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Produkty ({order.items.length})</p>
                              <div className="space-y-1">
                                {order.items.map(item => (
                                  <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-700">{item.product.name} × {item.quantity}</span>
                                    <span className="font-medium text-gray-900">{(item.product.price * item.quantity).toFixed(2)} zł</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right: controls */}
                          <div className="space-y-3">
                            <div className="rounded-2xl bg-[#0a0a0a] p-4 text-white">
                              <p className="text-xs text-white/40">Wartość zamówienia</p>
                              <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "'Syne', system-ui" }}>{fmt(order.total)}</p>
                            </div>
                            <div className="rounded-2xl border p-4 space-y-3" style={{ borderColor: "#e8e8e6" }}>
                              <div>
                                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Status realizacji</label>
                                <select value={order.status} onChange={e => updateOrder(order.id, { status: e.target.value })} className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none" style={{ borderColor: "#e8e8e6" }}>
                                  <option value="NOWE">Nowe</option>
                                  <option value="W_REALIZACJI">W realizacji</option>
                                  <option value="WYSLANE">Wysłane</option>
                                </select>
                              </div>
                              <div>
                                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Status płatności</label>
                                <select value={order.paymentStatus} onChange={e => updateOrder(order.id, { paymentStatus: e.target.value })} className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none" style={{ borderColor: "#e8e8e6" }}>
                                  <option value="OCZEKUJE">Oczekuje</option>
                                  <option value="OPLACONA">Opłacona</option>
                                  <option value="NIEUDANA">Nieudana</option>
                                </select>
                              </div>
                              <Link href={`/admin/zamowienia/${order.id}`} className="flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400" style={{ borderColor: "#e8e8e6" }}>
                                Pełne szczegóły <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
