"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ChevronDown } from "lucide-react";
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

const categories = [
  { label: "Wszystkie produkty", href: "/produkty" },
  { label: "Nowości", href: "/produkty?category=NOWOSCI" },
  { label: "Wyprzedaż", href: "/produkty?category=WYPRZEDAZ" },
  { label: "Dom i ogród", href: "/produkty?category=DOM_I_OGROD" },
  { label: "Motoryzacja", href: "/produkty?category=MOTORYZACJA" },
  {
    label: "Akcesoria dla zwierząt",
    href: "/produkty?category=AKCESORIA_DLA_ZWIERZAT",
  },
  { label: "Ogród", href: "/produkty?subcategory=OGROD" },
  { label: "Wyposażenie", href: "/produkty?subcategory=WYPOSAZENIE" },
];

export default function Navbar() {
  const [cartValue, setCartValue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

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

    return () => window.removeEventListener("storage", updateCart);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setCategoriesOpen(false);
  };

  return (
    <header className="relative z-50 w-full bg-black text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-8 py-5">
          <Link href="/" onClick={closeMenu} className="shrink-0">
            <Image
              src="/storener-logo.png"
              alt="StoreNER"
              width={220}
              height={60}
              className="h-auto w-[180px] object-contain md:w-[220px]"
              priority
            />
          </Link>

          <form
            action="/produkty"
            className="hidden h-[52px] flex-1 overflow-hidden rounded-md bg-white md:flex"
          >
            <input
              name="search"
              type="text"
              placeholder="Wpisz czego szukasz"
              className="flex-1 px-6 text-sm text-gray-700 outline-none"
            />

            <button
              type="submit"
              className="flex w-[64px] items-center justify-center bg-[#4caf3d] text-white transition hover:bg-[#43a334]"
              aria-label="Szukaj"
            >
              <Search className="h-7 w-7" />
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 transition hover:bg-white/10 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden items-center justify-between border-t border-white/10 py-4 md:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoriesOpen((prev) => !prev)}
              className="flex items-center gap-3 text-sm font-bold uppercase transition hover:text-[#4caf3d]"
            >
              <Menu className="h-6 w-6" />
              Wszystkie produkty
              <ChevronDown className="h-4 w-4" />
            </button>

            {categoriesOpen && (
              <div className="absolute left-0 top-full z-50 mt-4 w-72 overflow-hidden rounded-2xl border border-white/10 bg-white text-black shadow-2xl">
                {categories.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="block border-b border-gray-100 px-5 py-4 text-sm font-semibold transition hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <nav className="flex items-center gap-9 text-sm font-bold uppercase">
            <Link href="/" className="transition hover:text-[#4caf3d]">
              Start
            </Link>

            <Link href="/koszyk" className="transition hover:text-[#4caf3d]">
              Koszyk ({cartValue.toFixed(2)} zł)
            </Link>

            <UserNavbarActions />
          </nav>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-black md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            <form
              action="/produkty"
              className="mb-4 flex h-[48px] overflow-hidden rounded-md bg-white"
            >
              <input
                name="search"
                type="text"
                placeholder="Wpisz czego szukasz"
                className="flex-1 px-4 text-sm text-gray-700 outline-none"
              />

              <button
                type="submit"
                className="flex w-[56px] items-center justify-center bg-[#4caf3d] text-white"
              >
                <Search className="h-6 w-6" />
              </button>
            </form>

            {categories.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-[#4caf3d]"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/koszyk"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-[#4caf3d]"
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