"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X, ShoppingCart, ChevronDown, Sparkles, Tag, Home, Car, PawPrint, Leaf, Sofa } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UserNavbarActions from "./UserNavbarActions";
import MobileUserNavbarActions from "./MobileUserNavbarActions";

type CartItem = { id: number; price: number; quantity: number };

const categories = [
  { label: "Wszystkie produkty", href: "/produkty", icon: null },
  { label: "Nowości", href: "/produkty?category=NOWOSCI", icon: Sparkles, color: "text-violet-500" },
  { label: "Wyprzedaż", href: "/produkty?category=WYPRZEDAZ", icon: Tag, color: "text-red-500" },
  // { label: "Dom", href: "/produkty?category=DOM", icon: Home, color: "text-green-600" }, // ukryte w menu – nie usuwać (link i panel admina nadal działają)
  { label: "Ogród", href: "/produkty?category=OGROD", icon: Leaf, color: "text-emerald-500" },
  { label: "Wyposażenie", href: "/produkty?category=WYPOSAZENIE", icon: Sofa, color: "text-teal-500" },
  { label: "Motoryzacja", href: "/produkty?category=MOTORYZACJA", icon: Car, color: "text-blue-500" },
  { label: "Akcesoria dla zwierząt", href: "/produkty?category=AKCESORIA_DLA_ZWIERZAT", icon: PawPrint, color: "text-orange-500" },
];

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [cartValue, setCartValue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCart = () => {
      const saved = localStorage.getItem("cart");
      const cart: CartItem[] = saved ? JSON.parse(saved) : [];
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
      setCartValue(cart.reduce((s, i) => s + i.price * i.quantity, 0));
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const close = () => { setIsOpen(false); setCategoriesOpen(false); };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/98 backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.32)]" : "bg-black"
      }`}
    >
      {/* Top strip */}
      <div className="hidden border-b border-white/5 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs text-white/40">
          <span>Darmowa dostawa od 199 zł</span>
          <div className="flex items-center gap-4">
            <Link href="/kontakt" className="transition hover:text-white/70">Kontakt</Link>
            <Link href="/faq" className="transition hover:text-white/70">FAQ</Link>
            <Link href="/status-zamowienia" className="transition hover:text-white/70">Śledzenie zamówienia</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Main row */}
        <div className="flex h-16 items-center gap-6 md:h-[72px]">
          <Link href="/" onClick={close} className="shrink-0">
            <Image
              src="/storener-logo.png"
              alt="STORENER"
              width={200}
              height={52}
              className="h-auto w-[140px] object-contain md:w-[170px]"
              priority
            />
          </Link>

          {/* Search bar */}
          <form action="/produkty" className="hidden h-11 flex-1 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10 transition focus-within:bg-white/15 focus-within:ring-white/20 md:flex">
            <input
              name="q"
              type="text"
              placeholder="Szukaj produktów, kategorii…"
              className="flex-1 bg-transparent px-4 text-sm text-white placeholder-white/40 outline-none"
            />
            <button type="submit" className="flex w-12 items-center justify-center bg-[#4caf3d] text-white transition hover:bg-[#3a9a2c]" aria-label="Szukaj">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex">
              <UserNavbarActions />
            </div>
            <Link href="/koszyk" className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-white transition hover:bg-white/15">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4caf3d] text-[10px] font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(p => !p)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-white transition hover:bg-white/15 md:hidden"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Categories bar */}
        <div className="hidden items-center gap-0.5 border-t border-white/6 py-2 md:flex">
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCategoriesOpen(p => !p)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/80 transition hover:bg-white/8 hover:text-white ${categoriesOpen ? "bg-white/8 text-white" : ""}`}
            >
              <Menu className="h-4 w-4" />
              Kategorie
              <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-white/8 bg-white shadow-2xl">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={close}
                      className="flex items-center gap-3 border-b border-gray-50 px-5 py-3.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                    >
                      {Icon && <Icon className={`h-4 w-4 ${cat.color}`} />}
                      {!Icon && <div className="h-4 w-4" />}
                      {cat.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mx-2 h-4 w-px bg-white/10" />

          <nav className="flex items-center gap-0.5 text-[13px] font-semibold text-white/70">
            {categories
              .filter((cat) => cat.href !== "/produkty")
              .map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={close}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition hover:bg-white/8 hover:text-white"
                  >
                    {Icon && <Icon className={`h-3.5 w-3.5 ${cat.color}`} />}
                    {cat.label}
                  </Link>
                );
              })}
          </nav>

          <div className="ml-auto flex items-center gap-3 text-xs text-white/40">
            <span>Koszyk:</span>
            <Link href="/koszyk" className="font-bold text-white/80 transition hover:text-white">{cartValue.toFixed(2)} zł</Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-white/8 bg-black md:hidden">
          <div className="px-4 py-3">
            <form action="/produkty" className="flex h-10 overflow-hidden rounded-xl bg-white/10">
              <input name="q" type="text" placeholder="Szukaj…" className="flex-1 bg-transparent px-4 text-sm text-white placeholder-white/40 outline-none" />
              <button type="submit" className="flex w-11 items-center justify-center bg-[#4caf3d] text-white">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          <nav className="pb-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={close}
                  className="flex items-center gap-3 border-b border-white/5 px-6 py-3.5 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  {Icon && <Icon className={`h-4 w-4 ${cat.color}`} />}
                  {!Icon && <div className="h-4 w-4 rounded-sm bg-white/20" />}
                  {cat.label}
                </Link>
              );
            })}
            <div className="border-t border-white/8 px-4 pt-4">
              <MobileUserNavbarActions onNavigate={close} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
