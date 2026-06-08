"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, Search, ArrowUpDown } from "lucide-react";
import ProductCard from "../../components/ProductCard";

type Product = {
  id: number; slug: string; name: string; price: number;
  description: string; image: string; category: string;
  stock: number; stockStatus: string; averageRating: number; reviewsCount: number;
};

const CATEGORIES = [
  { value: "", label: "Wszystkie kategorie" },
  { value: "NOWOSCI", label: "Nowości" },
  { value: "WYPRZEDAZ", label: "Wyprzedaż" },
  { value: "DOM_I_OGROD", label: "Dom i ogród" },
  { value: "OGROD", label: "Ogród" },
  { value: "WYPOSAZENIE", label: "Wyposażenie" },
  { value: "MOTORYZACJA", label: "Motoryzacja" },
  { value: "AKCESORIA_DLA_ZWIERZAT", label: "Akcesoria dla zwierząt" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Najnowsze" },
  { value: "price_asc", label: "Cena: rosnąco" },
  { value: "price_desc", label: "Cena: malejąco" },
  { value: "name_asc", label: "Nazwa: A–Z" },
  { value: "name_desc", label: "Nazwa: Z–A" },
];

export default function ProduktyContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadProducts = async (
    s = search, mn = minPrice, mx = maxPrice, c = category, so = sort
  ) => {
    try {
      setIsLoading(true); setError("");
      const p = new URLSearchParams();
      if (s) p.append("search", s);
      if (mn) p.append("minPrice", mn);
      if (mx) p.append("maxPrice", mx);
      if (c) p.append("category", c);
      if (so) p.append("sort", so);
      const res = await fetch(`/api/products?${p}`);
      const data = await res.json();
      if (!res.ok) { setError("Nie udało się pobrać produktów"); return; }
      setProducts(data);
    } catch { setError("Wystąpił błąd połączenia"); }
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
    loadProducts(s, mn, mx, c, so);
  }, [searchParams]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
    loadProducts(localSearch, minPrice, maxPrice, category, sort);
  };

  const clearFilters = () => {
    setSearch(""); setLocalSearch("");
    setMinPrice(""); setMaxPrice("");
    setCategory(""); setSort("newest");
    loadProducts("", "", "", "", "newest");
  };

  const hasFilters = search || minPrice || maxPrice || category;

  const getCategoryLabel = (v: string) => CATEGORIES.find(c => c.value === v)?.label || v;
  const getSortLabel = (v: string) => SORT_OPTIONS.find(s => s.value === v)?.label || v;

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)" }}>
      {/* Page header */}
      <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
            {category ? getCategoryLabel(category) : search ? `Wyniki dla "${search}"` : "Wszystkie produkty"}
          </h1>
          {products.length > 0 && !isLoading && (
            <p className="mt-1.5 text-sm text-gray-500">{products.length} produktów</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Filter toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Search */}
          <form onSubmit={handleFilter} className="flex h-10 flex-1 min-w-[200px] overflow-hidden rounded-xl border bg-white shadow-sm" style={{ borderColor: "var(--border)" }}>
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Szukaj produktów…"
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
              />
            </div>
            <button type="submit" className="px-4 text-sm font-semibold text-[#4caf3d] transition hover:bg-[#4caf3d]/5">
              Szukaj
            </button>
          </form>

          {/* Category select */}
          <div className="relative">
            <select
              value={category}
              onChange={e => { setCategory(e.target.value); loadProducts(search, minPrice, maxPrice, e.target.value, sort); }}
              className="h-10 appearance-none rounded-xl border bg-white pl-4 pr-9 text-sm font-medium text-gray-700 shadow-sm outline-none transition hover:border-gray-400 focus:border-gray-800"
              style={{ borderColor: "var(--border)" }}
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Sort select */}
          <div className="relative flex items-center gap-2 rounded-xl border bg-white px-4 py-0 shadow-sm" style={{ borderColor: "var(--border)", height: "40px" }}>
            <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); loadProducts(search, minPrice, maxPrice, category, e.target.value); }}
              className="appearance-none bg-transparent text-sm font-medium text-gray-700 outline-none pr-6"
            >
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Price filter toggle */}
          <button
            onClick={() => setFiltersOpen(p => !p)}
            className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium shadow-sm transition ${filtersOpen ? "border-gray-800 bg-gray-800 text-white" : "border-[var(--border)] bg-white text-gray-700 hover:border-gray-400"}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtry
          </button>

          {hasFilters && (
            <button onClick={clearFilters} className="flex h-10 items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-medium text-red-600 transition hover:bg-red-100">
              <X className="h-3.5 w-3.5" /> Wyczyść
            </button>
          )}
        </div>

        {/* Price filter panel */}
        {filtersOpen && (
          <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <p className="mb-3 text-sm font-semibold text-gray-800">Zakres cen (zł)</p>
            <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1.5 block text-xs text-gray-500">Od</label>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} min="0" placeholder="0" className="input-field w-28" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-gray-500">Do</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0" placeholder="9999" className="input-field w-28" />
              </div>
              <button type="submit" className="btn-primary h-11 px-5 rounded-xl text-sm">Zastosuj</button>
            </form>
          </div>
        )}

        {/* Active filters */}
        {hasFilters && (
          <div className="mb-5 flex flex-wrap gap-2">
            {category && <Chip label={getCategoryLabel(category)} onRemove={() => { setCategory(""); loadProducts(search, minPrice, maxPrice, "", sort); }} />}
            {search && <Chip label={`Szukaj: ${search}`} onRemove={() => { setSearch(""); setLocalSearch(""); loadProducts("", minPrice, maxPrice, category, sort); }} />}
            {minPrice && <Chip label={`Od: ${minPrice} zł`} onRemove={() => { setMinPrice(""); loadProducts(search, "", maxPrice, category, sort); }} />}
            {maxPrice && <Chip label={`Do: ${maxPrice} zł`} onRemove={() => { setMaxPrice(""); loadProducts(search, minPrice, "", category, sort); }} />}
          </div>
        )}

        {/* Products grid */}
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[380px] rounded-[26px] skeleton" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-red-600 text-sm font-medium">{error}</div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-[28px] bg-white p-12 text-center shadow-sm">
            <p className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>Brak produktów</p>
            <p className="mt-2 text-gray-500">Spróbuj zmienić filtry lub wyszukaj coś innego.</p>
            <button onClick={clearFilters} className="mt-5 btn-primary rounded-xl px-6 py-2.5 text-sm">Wyczyść filtry</button>
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

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm" style={{ borderColor: "var(--border)" }}>
      {label}
      <button onClick={onRemove} className="rounded-full p-0.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
