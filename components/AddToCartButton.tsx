"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type AddToCartButtonProps = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function AddToCartButton({
  id,
  name,
  price,
  image,
}: AddToCartButtonProps) {
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    if (!isToastVisible) return;

    const timeout = window.setTimeout(() => {
      setIsToastVisible(false);
    }, 4500);

    return () => window.clearTimeout(timeout);
  }, [isToastVisible]);

  const handleAddToCart = () => {
    const existingCart = localStorage.getItem("cart");
    const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const existingProduct = cart.find((item) => item.id === id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    setIsToastVisible(true);
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        className="inline-flex w-full items-center justify-center rounded-xl bg-black px-6 py-4 text-lg font-semibold text-white transition hover:opacity-90"
      >
        Dodaj do koszyka
      </button>

      {isToastVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-50 w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/20 sm:right-6 sm:top-6"
        >
          <div className="flex items-start gap-4 border-b border-slate-100 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
              ✓
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-950">
                Produkt dodany do koszyka
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Możesz kontynuować zakupy albo przejść od razu do koszyka.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsToastVisible(false)}
              className="rounded-full px-2 text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Zamknij komunikat"
            >
              ×
            </button>
          </div>

          <div className="flex gap-3 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <Image
                src={image}
                alt={name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-slate-900">
                {name}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {price.toFixed(2).replace(".", ",")} zł
              </p>
            </div>
          </div>

          <div className="grid gap-3 bg-slate-50 p-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setIsToastVisible(false)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Kontynuuj zakupy
            </button>
            <Link
              href="/koszyk"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Przejdź do koszyka
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
