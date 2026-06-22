"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import {
  Search, SlidersHorizontal, X, ChevronDown, ArrowUpDown,
  Sparkles, Tag, Home, Leaf, Sofa, Car, PawPrint, Grid3x3
} from "lucide-react";

type Product = {
  id: number; slug: string; name: string; price: number;
  description: string; image: string; category: string;
  stock: number; stockStatus: string; averageRating: number; reviewsCount: number;
};

const CATEGORIES = [
  { value: "",                       label: "Wszystkie",            icon: Grid3x3,   color: "text-gray-500",    bg: "bg-gray-100" },
  { value: "NOWOSCI",                label: "Nowości",              icon: Sparkles,  color: "text-violet-600",  bg: "bg-violet-50" },
  { value: "WYPRZEDAZ",              label: "Wyprzedaż",            icon: Tag,       color: "text-red-600",     bg: "bg-red-50" },
  { value: "DOM_I_OGROD",            label: "Dom i ogród",          icon: Home,      color: "text-green-700",   bg: "bg-green-50", hidden: true }, // chwilowo ukryte – nie usuwać (lookup po URL nadal działa)
  { value: "DOM",                    label: "Dom",                  icon: Home,      color: "text-green-700",   bg: "bg-green-50" },
  { value: "OGROD",                  label: "Ogród",                icon: Leaf,      color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "WYPOSAZENIE",            label: "Wyposażenie",          icon: Sofa,      color: "text-teal-600",    bg: "bg-teal-50" },
  { value: "MOTORYZACJA",            label: "Motoryzacja",          icon: Car,       color: "text-blue-600",    bg: "bg-blue-50" },
  { value: "AKCESORIA_DLA_ZWIERZAT", label: "Dla zwierząt",         icon: PawPrint,  color: "text-orange-600",  bg: "bg-orange-50" },
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Najnowsze" },
  { value: "price_asc",  label: "Cena rosnąco" },
  { value: "price_desc", label: "Cena malejąco" },
  { value: "name_asc",   label: "A – Z" },
  { value: "name_desc",  label: "Z – A" },
];

export default function ProduktyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [priceOpen, setPriceOpen] = useState(false);

  const load = async (s = search, mn = minPrice, mx = maxPrice, c = category, so = sort) => {
    setIsLoading(true); setError("");
    const p = new URLSearchParams();
    if (s) p.append("search", s);
    if (mn) p.append("minPrice", mn);
    if (mx) p.append("maxPrice", mx);
    if (c) p.append("category", c);
    if (so) p.append("sort", so);
    try {
      const res = await fetch(`/api/products?${p}`);
      const data = await res.json();
      if (!res.ok) { setError("Nie udało się pobrać produktów"); return; }
      setProducts(data);
    } catch { setError("Błąd połączenia"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    const s = searchParams.get("search") || searchParams.get("q") || "";
    const mn = searchParams.get("minPrice") || "";
    const mx = searchParams.get("maxPrice") || "";
    const c = searchParams.get("category") || "";
    const so = searchParams.get("sort") || "newest";
    setSearch(s); setLocalSearch(s);
    setMinPrice(mn); setMaxPrice(mx);
    setCategory(c); setSort(so);
    load(s, mn, mx, c, so);
  }, [searchParams]);

  const selectCategory = (c: string) => {
    setCategory(c);
    const p = new URLSearchParams(searchParams.toString());
    if (c) p.set("category", c); else p.delete("category");
    router.push(`/produkty?${p}`);
  };

  const clearAll = () => {
    setSearch(""); setLocalSearch("");
    setMinPrice(""); setMaxPrice("");
    setCategory(""); setSort("newest");
    router.push("/produkty");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
    const p = new URLSearchParams(searchParams.toString());
    if (localSearch) p.set("search", localSearch); else p.delete("search");
    router.push(`/produkty?${p}`);
  };

  const handleSort = (v: string) => {
    setSort(v);
    const p = new URLSearchParams(searchParams.toString());
    p.set("sort", v);
    router.push(`/produkty?${p}`);
  };

  const activeCat = CATEGORIES.find(c => c.value === category);
  const hasFilters = !!(search || minPrice || maxPrice || category);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)" }}>
      {/* Page header */}
      <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-6 py-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Katalog</p>
              <h1 className="mt-1.5 text-2xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>
                {activeCat && activeCat.value ? activeCat.label : "Wszystkie produkty"}
                {search && <span className="ml-2 text-lg font-normal text-gray-400">„{search}"</span>}
              </h1>
              {!isLoading && <p className="mt-1 text-sm text-gray-500">{products.length} produktów</p>}
            </div>

            {/* Sort */}
            <div className="relative flex items-center gap-1.5 rounded-xl border bg-white px-3 py-2" style={{ borderColor: "var(--border)" }}>
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
              <select
                value={sort}
                onChange={e => handleSort(e.target.value)}
                className="appearance-none bg-transparent pr-5 text-sm font-medium text-gray-700 outline-none"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Category pills */}
        <div className="mb-5 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => !c.hidden).map(({ value, label, icon: Icon, color, bg }) => (
            <button
              key={value}
              onClick={() => selectCategory(value)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                category === value
                  ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                  : `border-transparent ${bg} ${color} hover:border-current`
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Search + filters bar */}
        <div className="mb-5 flex flex-wrap gap-2">
          <form onSubmit={handleSearch} className="flex h-10 flex-1 min-w-[200px] overflow-hidden rounded-xl border bg-white" style={{ borderColor: "var(--border)" }}>
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Szukaj produktów…"
                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
              />
            </div>
            <button type="submit" className="px-4 text-sm font-semibold text-[#4caf3d] transition hover:bg-[#4caf3d]/5">
              Szukaj
            </button>
          </form>

          <button
            onClick={() => setPriceOpen(p => !p)}
            className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${priceOpen ? "border-[#0a0a0a] bg-[#0a0a0a] text-white" : "border-[var(--border)] bg-white text-gray-700 hover:border-gray-400"}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Cena
          </button>

          {hasFilters && (
            <button onClick={clearAll} className="flex h-10 items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100">
              <X className="h-3.5 w-3.5" /> Wyczyść
            </button>
          )}
        </div>

        {/* Price panel */}
        {priceOpen && (
          <div className="mb-5 rounded-2xl border bg-white p-5" style={{ borderColor: "var(--border)" }}>
            <p className="mb-3 text-sm font-semibold text-gray-800">Zakres cen (zł)</p>
            <form onSubmit={e => { e.preventDefault(); load(search, minPrice, maxPrice, category, sort); }} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1.5 block text-xs text-gray-500">Od</label>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} min="0" placeholder="0" className="input-field w-28" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-gray-500">Do</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0" placeholder="9999" className="input-field w-28" />
              </div>
              <button type="submit" className="btn-primary h-11 rounded-xl px-5 text-sm">Zastosuj</button>
              {(minPrice || maxPrice) && (
                <button type="button" onClick={() => { setMinPrice(""); setMaxPrice(""); load(search, "", "", category, sort); }} className="h-11 px-3 text-sm text-gray-500 transition hover:text-gray-800">Usuń</button>
              )}
            </form>
          </div>
        )}

        {/* Active filter chips */}
        {hasFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeCat && activeCat.value && (
              <span className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-700" style={{ borderColor: "var(--border)" }}>
                <activeCat.icon className={`h-3 w-3 ${activeCat.color}`} />
                {activeCat.label}
                <button onClick={() => selectCategory("")} className="ml-1 text-gray-400 hover:text-gray-700"><X className="h-3 w-3" /></button>
              </span>
            )}
            {search && (
              <span className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-700" style={{ borderColor: "var(--border)" }}>
                🔍 {search}
                <button onClick={() => { setSearch(""); setLocalSearch(""); load("", minPrice, maxPrice, category, sort); }} className="ml-1 text-gray-400 hover:text-gray-700"><X className="h-3 w-3" /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-700" style={{ borderColor: "var(--border)" }}>
                {minPrice && maxPrice ? `${minPrice}–${maxPrice} zł` : minPrice ? `od ${minPrice} zł` : `do ${maxPrice} zł`}
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); load(search, "", "", category, sort); }} className="ml-1 text-gray-400 hover:text-gray-700"><X className="h-3 w-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Products */}
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-[360px] rounded-[26px] skeleton" />)}
          </div>
        )}

        {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-700">{error}</div>}

        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-[28px] bg-white p-12 text-center" style={{ boxShadow: "var(--shadow-md)" }}>
            <p className="text-xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Brak produktów</p>
            <p className="mt-2 text-gray-500">Zmień filtry lub wyszukaj coś innego.</p>
            <button onClick={clearAll} className="btn-primary mt-5 rounded-xl px-6 py-2.5 text-sm">Wyczyść filtry</button>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map(p => (
              <ProductCard key={p.id} slug={p.slug} name={p.name} price={p.price} image={p.image} category={p.category} stock={p.stock} stockStatus={p.stockStatus} averageRating={p.averageRating} reviewsCount={p.reviewsCount} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
