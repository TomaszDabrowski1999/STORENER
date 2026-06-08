"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UserNavbarActions from "./UserNavbarActions";
import MobileUserNavbarActions from "./MobileUserNavbarActions";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const mainCategories = [
  { label: "Wszystkie produkty", href: "/produkty" },
  { label: "Nowości", href: "/produkty?category=NOWOSCI" },
  { label: "Wyprzedaż", href: "/produkty?category=WYPRZEDAZ" },
  { label: "Motoryzacja", href: "/produkty?category=MOTORYZACJA" },
  { label: "Akcesoria dla zwierząt", href: "/produkty?category=AKCESORIA_DLA_ZWIERZAT" },
];

const domOgrodCategory = {
  label: "Dom i ogród",
  href: "/produkty?category=DOM_I_OGROD",
  subcategories: [
    { label: "Ogród", href: "/produkty?subcategory=OGROD" },
    { label: "Wyposażenie", href: "/produkty?subcategory=WYPOSAZENIE" },
  ],
};

export default function Navbar() {
  const [cartValue, setCartValue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [domOgrodOpen, setDomOgrodOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setCategoriesOpen(false);
    setDomOgrodOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top bar */}
        <div className="flex items-center gap-8 py-5">
          <Link href="/" onClick={closeMenu} className="shrink-0">
            <Image
              src="/storener-logo.png"
              alt="StoreNER"
              width={220}
              height={60}
              className="h-auto w-[160px] object-contain md:w-[200px]"
              priority
            />
          </Link>

          {/* Desktop search */}
          <form
            action="/produkty"
            className="hidden h-[48px] flex-1 overflow-hidden rounded-lg bg-white md:flex"
          >
            <input
              name="q"
              type="text"
              placeholder="Wpisz czego szukasz..."
              className="flex-1 px-5 text-sm text-gray-700 outline-none"
            />
            <button
              type="submit"
              className="flex w-[56px] items-center justify-center bg-[#4caf3d] text-white transition hover:bg-[#43a334]"
              aria-label="Szukaj"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="ml-auto hidden items-center gap-6 md:flex">
            <UserNavbarActions />
            <Link
              href="/koszyk"
              className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              🛒 {cartValue.toFixed(2)} zł
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 transition hover:bg-white/10 md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Categories bar */}
        <div className="hidden items-center gap-1 border-t border-white/10 py-2 md:flex">
          {/* All categories dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCategoriesOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wide transition hover:bg-white/10"
            >
              <Menu className="h-4 w-4" />
              Wszystkie kategorie
              <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-white text-black shadow-2xl">
                {mainCategories.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="block border-b border-gray-100 px-5 py-3.5 text-sm font-semibold transition hover:bg-gray-50"
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Dom i ogród with submenu */}
                <div className="relative group/dom">
                  <div
                    className="flex cursor-pointer items-center justify-between border-b border-gray-100 px-5 py-3.5 text-sm font-semibold transition hover:bg-gray-50"
                    onMouseEnter={() => setDomOgrodOpen(true)}
                    onMouseLeave={() => setDomOgrodOpen(false)}
                  >
                    <Link href={domOgrodCategory.href} onClick={closeMenu} className="flex-1">
                      {domOgrodCategory.label}
                    </Link>
                    <ChevronDown className="h-4 w-4 -rotate-90 text-gray-400" />
                  </div>
                  {domOgrodOpen && (
                    <div
                      className="absolute left-full top-0 z-10 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
                      onMouseEnter={() => setDomOgrodOpen(true)}
                      onMouseLeave={() => setDomOgrodOpen(false)}
                    >
                      {domOgrodCategory.subcategories.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={closeMenu}
                          className="block border-b border-gray-100 px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick nav links */}
          <nav className="flex items-center">
            <Link href="/produkty?category=NOWOSCI" onClick={closeMenu} className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-white/10">
              Nowości
            </Link>
            <Link href="/produkty?category=WYPRZEDAZ" onClick={closeMenu} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#4caf3d] transition hover:bg-white/10">
              Wyprzedaż
            </Link>
            <Link href="/produkty?category=DOM_I_OGROD" onClick={closeMenu} className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-white/10">
              Dom i ogród
            </Link>
            <Link href="/produkty?category=MOTORYZACJA" onClick={closeMenu} className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-white/10">
              Motoryzacja
            </Link>
          </nav>

          <Link href="/" onClick={closeMenu} className="ml-auto rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-white/10">
            Start
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-white/10 bg-black md:hidden">
          {/* Mobile search */}
          <div className="px-6 py-4">
            <form action="/produkty" className="flex h-11 overflow-hidden rounded-lg bg-white">
              <input
                name="q"
                type="text"
                placeholder="Szukaj produktów..."
                className="flex-1 px-4 text-sm text-gray-700 outline-none"
              />
              <button type="submit" className="flex w-12 items-center justify-center bg-[#4caf3d] text-white">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          <nav className="pb-6">
            {mainCategories.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center border-b border-white/5 px-6 py-4 text-sm font-semibold transition hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={domOgrodCategory.href}
              onClick={closeMenu}
              className="flex items-center border-b border-white/5 px-6 py-4 text-sm font-semibold transition hover:bg-white/5"
            >
              {domOgrodCategory.label}
            </Link>
            {domOgrodCategory.subcategories.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                onClick={closeMenu}
                className="flex items-center border-b border-white/5 bg-white/5 px-10 py-3.5 text-sm font-medium text-white/70 transition hover:bg-white/10"
              >
                └ {sub.label}
              </Link>
            ))}
            <div className="mt-4 border-t border-white/10 px-6 pt-4">
              <MobileUserNavbarActions />
              <Link
                href="/koszyk"
                onClick={closeMenu}
                className="mt-3 flex items-center justify-between rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold"
              >
                Koszyk
                <span className="text-[#4caf3d]">{cartValue.toFixed(2)} zł</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
