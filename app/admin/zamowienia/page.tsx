"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminGuard from "../../../components/AdminGuard";
import { formatShippingMethod } from "../../../lib/shipping";

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

const orderStatuses = ["ALL", "NOWE", "W_REALIZACJI", "WYSLANE"] as const;
const paymentStatuses = ["ALL", "OCZEKUJE", "OPLACONA", "NIEUDANA"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof orderStatuses)[number]>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<(typeof paymentStatuses)[number]>("ALL");

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Nie udało się pobrać zamówień"); return; }
      setOrders(data);
    } catch { setError("Błąd połączenia"); }
  };

  useEffect(() => { loadOrders(); }, []);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const term = search.toLowerCase().trim();
    const matchesSearch = !term || String(order.id).includes(term) || order.fullName.toLowerCase().includes(term) || order.email.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  }), [orders, search, statusFilter, paymentFilter]);

  const updateOrder = async (orderId: number, payload: Partial<Pick<Order, "status" | "paymentStatus">>) => {
    const toastId = toast.loading("Aktualizowanie zamówienia...");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Nie udało się zapisać zmian", { id: toastId }); return; }
      setOrders((prev) => prev.map((order) => order.id === orderId ? data : order));
      toast.success("Zamówienie zaktualizowane", { id: toastId });
    } catch { toast.error("Błąd połączenia", { id: toastId }); }
  };

  const exportCsv = () => {
    const header = ["ID", "Data", "Klient", "Email", "Status", "Płatność", "Wartość"];
    const rows = filteredOrders.map((o) => [o.id, new Date(o.createdAt).toLocaleString(), o.fullName, o.email, o.status, o.paymentStatus, o.total.toFixed(2)]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "zamowienia.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <section className="border-b bg-white"><div className="mx-auto max-w-6xl px-6 py-14"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">panel administracyjny</p><h1 className="mt-3 text-4xl font-bold text-gray-900">Zamówienia</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">Szukaj, filtruj, eksportuj oraz zmieniaj status realizacji i płatności.</p></div></section>
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6 grid gap-3 rounded-3xl bg-white p-5 shadow-sm lg:grid-cols-[1fr_180px_180px_auto]">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Szukaj po ID, kliencie lub e-mailu" className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="rounded-xl border border-gray-200 px-4 py-3"><option value="ALL">Każdy status</option><option value="NOWE">Nowe</option><option value="W_REALIZACJI">W realizacji</option><option value="WYSLANE">Wysłane</option></select>
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as any)} className="rounded-xl border border-gray-200 px-4 py-3"><option value="ALL">Każda płatność</option><option value="OCZEKUJE">Oczekuje</option><option value="OPLACONA">Opłacona</option><option value="NIEUDANA">Nieudana</option></select>
            <button onClick={exportCsv} className="rounded-xl bg-black px-5 py-3 font-semibold text-white">Eksport CSV</button>
          </div>

          {error ? <div className="rounded-3xl bg-white p-8 shadow-sm"><p className="text-red-600">{error}</p></div> : null}
          {!error && filteredOrders.length === 0 ? <div className="rounded-3xl bg-white p-8 shadow-sm"><h2 className="text-2xl font-bold text-gray-900">Brak zamówień</h2></div> : null}

          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <article key={order.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex-1"><div className="flex flex-wrap items-center gap-3"><h2 className="text-2xl font-bold text-gray-900">Zamówienie #{order.id}</h2><Badge text={order.status} /><Badge text={order.paymentStatus} /></div><p className="mt-2 text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    <div className="mt-5 grid gap-4 md:grid-cols-3"><Info title="Klient" value={order.fullName} desc={order.email} /><Info title="Dostawa" value={order.shippingMethodName || formatShippingMethod(order.shippingMethod)} desc={`${order.postalCode} ${order.city}`} /><Info title="Adres" value={order.address} desc={order.shippingPoint ? `Punkt: ${order.shippingPoint}` : undefined} /></div>
                    <div className="mt-5"><h3 className="font-bold text-gray-900">Produkty</h3><div className="mt-3 space-y-2">{order.items.map((item) => <div key={item.id} className="flex justify-between rounded-2xl border border-gray-100 p-3 text-sm"><span>{item.product.name} × {item.quantity}</span><strong>{(item.product.price * item.quantity).toFixed(2)} zł</strong></div>)}</div></div>
                  </div>
                  <div className="w-full rounded-3xl bg-black p-6 text-white xl:max-w-xs"><p className="text-sm uppercase tracking-[0.2em] text-gray-300">wartość</p><p className="mt-3 text-3xl font-bold">{order.total.toFixed(2)} zł</p>
                    <label className="mt-6 block text-sm text-gray-300">Status realizacji</label><select value={order.status} onChange={(e) => updateOrder(order.id, { status: e.target.value as Order["status"] })} className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-black"><option value="NOWE">Nowe</option><option value="W_REALIZACJI">W realizacji</option><option value="WYSLANE">Wysłane</option></select>
                    <label className="mt-4 block text-sm text-gray-300">Status płatności</label><select value={order.paymentStatus} onChange={(e) => updateOrder(order.id, { paymentStatus: e.target.value as Order["paymentStatus"] })} className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-black"><option value="OCZEKUJE">Oczekuje</option><option value="OPLACONA">Opłacona</option><option value="NIEUDANA">Nieudana</option></select>
                    <Link href={`/admin/zamowienia/${order.id}`} className="mt-4 block rounded-xl border border-white/20 px-4 py-3 text-center font-semibold text-white transition hover:bg-white hover:text-black">Szczegóły</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}

function Badge({ text }: { text: string }) { return <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">{text.replaceAll("_", " ")}</span>; }
function Info({ title, value, desc }: { title: string; value?: string | null; desc?: string }) { return <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4"><p className="text-sm text-gray-500">{title}</p><p className="mt-2 font-semibold text-black">{value || "—"}</p>{desc ? <p className="mt-1 text-sm text-gray-600">{desc}</p> : null}</div>; }
