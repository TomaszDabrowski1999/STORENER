"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItem } from "../../types/cart";
import {
  getCart,
  saveCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const refreshCart = () => {
    setCart(getCart());
    window.dispatchEvent(new Event("storage"));
  };

  const handleIncrease = (id: number) => {
    increaseQuantity(id);
    refreshCart();
  };

  const handleDecrease = (id: number) => {
    decreaseQuantity(id);
    refreshCart();
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
    refreshCart();
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Koszyk</h1>
          <p className="mt-2 text-gray-600">
            Sprawdź wybrane produkty i przejdź do finalizacji zamówienia.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Twój koszyk jest pusty</h2>
            <p className="mt-3 text-gray-600">
              Dodaj produkty do koszyka, aby przejść do zamówienia.
            </p>

            <Link
              href="/produkty"
              className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white"
            >
              Przeglądaj produkty
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-32 w-full rounded-xl object-cover sm:w-32"
                    />

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="mt-2 text-gray-600">
                          Cena za sztukę: {item.price.toFixed(2)} zł
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item.id)}
                            className="h-10 w-10 rounded-lg border border-gray-300 text-lg"
                          >
                            -
                          </button>

                          <span className="min-w-8 text-center text-lg font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleIncrease(item.id)}
                            className="h-10 w-10 rounded-lg border border-gray-300 text-lg"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {(item.price * item.quantity).toFixed(2)} zł
                          </p>

                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="mt-2 text-sm text-red-600 hover:underline"
                          >
                            Usuń z koszyka
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Podsumowanie</h2>

              <div className="mt-6 space-y-4 border-b pb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Liczba produktów</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Wartość zamówienia</span>
                  <span>{total.toFixed(2)} zł</span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Dostawa</span>
                  <span>Gratis</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-semibold">Razem</span>
                <span className="text-2xl font-bold">{total.toFixed(2)} zł</span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block rounded-lg bg-black px-6 py-3 text-center text-white"
              >
                Przejdź do checkoutu
              </Link>

              <Link
                href="/produkty"
                className="mt-4 block rounded-lg border border-black px-6 py-3 text-center text-black"
              >
                Kontynuuj zakupy
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}