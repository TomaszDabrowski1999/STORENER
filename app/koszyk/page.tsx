"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItem } from "../../types/cart";
import { getCart, removeFromCart, increaseQuantity, decreaseQuantity } from "../../lib/cart";
import { polishPlural } from "../../lib/format";
import { FREE_SHIPPING_THRESHOLD } from "../../lib/shipping";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, RefreshCcw, Tag } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => { setCart(getCart()); }, []);

  const refresh = () => {
    setCart(getCart());
    window.dispatchEvent(new Event("storage"));
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD;
  const remaining = Math.max(0, freeShippingThreshold - total);

  return (
    <main className="min-h-screen" style={{ background: "var(--surface)" }}>
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a0a0a]">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>Koszyk</h1>
              <p className="text-sm text-gray-500">{totalItems > 0 ? `${totalItems} ${polishPlural(totalItems, "produkt", "produkty", "produktów")}` : "Twój koszyk jest pusty"}</p>
            </div>
          </div>

          {/* Free shipping progress */}
          {cart.length > 0 && (
            <div className="mt-5 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: remaining === 0 ? "#f0fdf4" : "white" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Truck className="h-4 w-4 text-[#4caf3d]" />
                  {remaining === 0 ? (
                    <span className="text-[#4caf3d] font-semibold">Masz darmową dostawę! 🎉</span>
                  ) : (
                    <span>Do darmowej dostawy brakuje <strong>{remaining.toFixed(2)} zł</strong></span>
                  )}
                </div>
                <span className="text-xs text-gray-400">próg: {freeShippingThreshold} zł</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#4caf3d] transition-all duration-500"
                  style={{ width: `${Math.min(100, (total / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {cart.length === 0 ? (
          <div className="rounded-[32px] bg-white p-12 text-center" style={{ boxShadow: "var(--shadow-md)" }}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
              <ShoppingCart className="h-9 w-9 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>Koszyk jest pusty</h2>
            <p className="mt-2 text-gray-500">Dodaj produkty, aby przejść do zamówienia.</p>
            <Link href="/produkty" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0a0a0a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a1a1a]">
              Przeglądaj produkty <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Cart items */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="group rounded-2xl bg-white p-4 transition-shadow hover:shadow-md" style={{ border: "1px solid var(--border)" }}>
                  <div className="flex gap-4">
                    <Link href={item.slug ? `/produkty/${item.slug}` : "/produkty"} className="shrink-0">
                      <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover transition group-hover:opacity-90" />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">{item.name}</h3>
                        <button
                          onClick={() => { removeFromCart(item.id); refresh(); }}
                          aria-label={`Usuń ${item.name} z koszyka`}
                          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-0 rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                          <button
                            onClick={() => { decreaseQuantity(item.id); refresh(); }}
                            className="flex h-8 w-8 items-center justify-center text-gray-500 transition hover:bg-gray-50 active:bg-gray-100"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => { increaseQuantity(item.id); refresh(); }}
                            className="flex h-8 w-8 items-center justify-center text-gray-500 transition hover:bg-gray-50 active:bg-gray-100"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-950">{(item.price * item.quantity).toFixed(2)} <span className="text-sm font-semibold text-gray-400">zł</span></p>
                          <p className="text-xs text-gray-400">{item.price.toFixed(2)} zł / szt.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit space-y-4">
              <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
                <h2 className="text-lg font-bold text-gray-950 mb-5" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>Podsumowanie</h2>

                <div className="space-y-3 border-b pb-5" style={{ borderColor: "var(--border)" }}>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Produkty ({totalItems})</span>
                    <span>{total.toFixed(2)} zł</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Dostawa</span>
                    <span className={remaining === 0 ? "font-semibold text-[#4caf3d]" : "text-gray-600"}>
                      {remaining === 0 ? "Gratis 🎉" : "obliczana w kasie"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <span className="font-semibold text-gray-950">Razem</span>
                  <span className="text-2xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>{total.toFixed(2)} <span className="text-base font-semibold text-gray-400">zł</span></span>
                </div>

                <Link href="/checkout" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4caf3d] py-3.5 text-sm font-bold text-white transition hover:bg-[#3a9a2c]">
                  Przejdź do kasy <ArrowRight className="h-4 w-4" />
                </Link>

                <Link href="/produkty" className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900" style={{ borderColor: "var(--border)" }}>
                  <RefreshCcw className="h-3.5 w-3.5" /> Kontynuuj zakupy
                </Link>
              </div>

              {/* Trust */}
              <div className="rounded-2xl bg-white p-4 space-y-2.5" style={{ border: "1px solid var(--border)" }}>
                {[
                  { icon: ShieldCheck, text: "Bezpieczna płatność SSL" },
                  { icon: Truck, text: "Dostawa w 24–48h" },
                  { icon: Tag, text: "30 dni na zwrot" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                    <Icon className="h-3.5 w-3.5 text-[#4caf3d]" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
