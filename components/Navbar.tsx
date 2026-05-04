"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserNavbarActions from "./UserNavbarActions";
import MobileUserNavbarActions from "./MobileUserNavbarActions";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function Navbar() {
  const [cartValue, setCartValue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      const savedCart = localStorage.getItem("cart");
      const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

      const totalValue = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      setCartValue(totalValue);
    };

    updateCart();
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" onClick={closeMenu} className="flex items-center">
          <Image
            src="/storener-logo.png"
            alt="StoreNER"
            width={220}
            height={60}
            className="h-auto w-[170px] object-contain md:w-[220px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white transition hover:text-green-400"
          >
            Start
          </Link>

          <Link
            href="/koszyk"
            className="text-sm font-medium text-white transition hover:text-green-400"
          >
            Koszyk ({cartValue.toFixed(2)} zł)
          </Link>

          <UserNavbarActions />
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 transition hover:bg-white/10 md:hidden"
          aria-label="Otwórz menu"
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-white"></span>
            <span className="block h-0.5 w-5 bg-white"></span>
            <span className="block h-0.5 w-5 bg-white"></span>
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-black md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-green-400"
            >
              Start
            </Link>

            <Link
              href="/koszyk"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-green-400"
            >
              Koszyk ({cartValue.toFixed(2)} zł)
            </Link>

            <div className="mt-2 border-t border-white/10 pt-2">
              <MobileUserNavbarActions onNavigate={closeMenu} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}