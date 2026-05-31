"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "../../../../components/AdminGuard";

type Order = {
  id: number; createdAt: string; total: number; status: string; paymentStatus: string; paymentMethod: string;
  fullName: string; email: string; address: string; city: string; postalCode: string;
  shippingMethodName?: string | null; shippingPrice?: number | null; shippingPoint?: string | null;
  items: { id: number; quantity: number; product: { name: string; price: number; image?: string | null } }[];
};

export default function AdminOrderDetailsClient({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Nie udało się pobrać zamówienia"); return; }
        setOrder(data);
      } catch { setError("Błąd połączenia"); }
    };
    loadOrder();
  }, [id]);

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <section className="border-b bg-white"><div className="mx-auto max-w-6xl px-6 py-12"><Link href="/admin/zamowienia" className="text-sm font-semibold text-gray-600 hover:text-black">← Wróć do zamówień</Link><h1 className="mt-4 text-4xl font-bold text-gray-900">Szczegóły zamówienia</h1></div></section>
        <section className="mx-auto max-w-6xl px-6 py-10">
          {error ? <div className="rounded-3xl bg-white p-8 text-red-600 shadow-sm">{error}</div> : null}
          {!error && !order ? <div className="rounded-3xl bg-white p-8 shadow-sm">Ładowanie...</div> : null}
          {order ? <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-3xl bg-white p-8 shadow-sm"><div className="flex flex-wrap items-center gap-3"><h2 className="text-3xl font-bold">Zamówienie #{order.id}</h2><span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">{order.status}</span><span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">{order.paymentStatus}</span></div><p className="mt-2 text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              <div className="mt-8 grid gap-4 md:grid-cols-2"><Box title="Klient" lines={[order.fullName, order.email]} /><Box title="Adres dostawy" lines={[order.address, `${order.postalCode} ${order.city}`, order.shippingPoint ? `Punkt: ${order.shippingPoint}` : ""]} /><Box title="Dostawa" lines={[order.shippingMethodName || "Dostawa", `${Number(order.shippingPrice || 0).toFixed(2)} zł`]} /><Box title="Płatność" lines={[order.paymentMethod, order.paymentStatus]} /></div>
              <h3 className="mt-8 text-2xl font-bold">Produkty</h3><div className="mt-4 space-y-3">{order.items.map((item) => <div key={item.id} className="flex justify-between rounded-2xl border border-gray-100 p-4"><div><p className="font-semibold">{item.product.name}</p><p className="text-sm text-gray-500">Ilość: {item.quantity} · {item.product.price.toFixed(2)} zł/szt.</p></div><strong>{(item.product.price * item.quantity).toFixed(2)} zł</strong></div>)}</div>
            </div>
            <aside className="rounded-3xl bg-black p-8 text-white shadow-sm"><p className="text-sm uppercase tracking-[0.2em] text-gray-300">Podsumowanie</p><p className="mt-4 text-4xl font-bold">{order.total.toFixed(2)} zł</p><p className="mt-4 text-sm text-gray-300">Widok szczegółów ułatwia obsługę reklamacji, wysyłki i kontaktu z klientem.</p></aside>
          </div> : null}
        </section>
      </main>
    </AdminGuard>
  );
}

function Box({ title, lines }: { title: string; lines: string[] }) {
  return <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5"><p className="text-sm text-gray-500">{title}</p>{lines.filter(Boolean).map((line) => <p key={line} className="mt-2 font-medium text-gray-900">{line}</p>)}</div>;
}
