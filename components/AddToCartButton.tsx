"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, X, ArrowRight, Check } from "lucide-react";

type CartItem = { id: number; name: string; price: number; image: string; quantity: number };
type Props = { id: number; name: string; price: number; image: string; stock?: number };

export default function AddToCartButton({ id, name, price, image, stock = 0 }: Props) {
  const [visible, setVisible] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, [visible]);

  const handleAdd = () => {
    if (stock <= 0) return;
    setAdding(true);

    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(i => i.id === id);
    if (existing) {
      if (existing.quantity >= stock) { setAdding(false); return; }
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));

    setTimeout(() => { setAdding(false); setVisible(true); }, 300);
  };

  return (
    <>
      <button
        onClick={handleAdd}
        disabled={stock <= 0 || adding}
        className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-base font-bold transition ${
          stock <= 0
            ? "cursor-not-allowed bg-gray-100 text-gray-400"
            : adding
            ? "bg-[#4caf3d] text-white"
            : "bg-[#4caf3d] text-white hover:bg-[#3a9a2c] active:scale-[0.98]"
        }`}
        style={{ boxShadow: stock > 0 ? "0 4px 16px rgba(76,175,61,0.3)" : "none" }}
      >
        {adding ? (
          <>
            <Check className="h-5 w-5 animate-bounce" />
            Dodano!
          </>
        ) : stock <= 0 ? (
          "Produkt niedostępny"
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Dodaj do koszyka
          </>
        )}
      </button>

      {/* Slide-in toast */}
      {visible && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-2xl bg-white shadow-2xl"
          style={{ border: "1px solid var(--border)", animation: "slideUp 0.3s ease" }}
        >
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4caf3d]/10 text-[#4caf3d]">
                <Check className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-gray-900">Dodano do koszyka</p>
            </div>
            <button onClick={() => setVisible(false)} className="text-gray-400 transition hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-3 p-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
              <Image src={image} alt={name} fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-semibold text-gray-900">{name}</p>
              <p className="mt-0.5 text-sm font-bold text-gray-950">{price.toFixed(2)} zł</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t p-3" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <button
              onClick={() => setVisible(false)}
              className="rounded-xl border py-2.5 text-xs font-bold text-gray-700 transition hover:border-gray-400"
              style={{ borderColor: "var(--border)" }}
            >
              Kontynuuj
            </button>
            <Link
              href="/koszyk"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0a0a0a] py-2.5 text-xs font-bold text-white transition hover:bg-[#1a1a1a]"
            >
              Koszyk <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
