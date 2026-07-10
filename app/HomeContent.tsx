"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, Sparkles, Truck, ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import HomeBannerSlider from "../components/HomeBannerSlider";
import Link from "next/link";

type Product = {
  id: number; slug: string; name: string; price: number;
  description: string; image: string; category: string;
  stock: number; stockStatus: string; averageRating: number; reviewsCount: number;
};

const CATEGORY_SECTIONS = [
  { key: "NOWOSCI",     eyebrow: "Świeże dodania",  title: "Nowości",         accent: "bg-violet-500", href: "/produkty?category=NOWOSCI" },
  { key: "WYPRZEDAZ",   eyebrow: "Okazje cenowe",   title: "Wyprzedaż",       accent: "bg-red-500",    href: "/produkty?category=WYPRZEDAZ" },
  // { key: "DOM_I_OGROD", eyebrow: "Inspiracje",      title: "Dom i ogród",     accent: "bg-green-500",  href: "/produkty?category=DOM_I_OGROD" }, // chwilowo ukryte
  { key: "MOTORYZACJA", eyebrow: "Dla kierowców",   title: "Motoryzacja",     accent: "bg-blue-500",   href: "/produkty?category=MOTORYZACJA" },
];

export default function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async (nextSearch = search, nextCategory = category, nextSort = sort) => {
    try {
      setIsLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (nextSearch) params.append("search", nextSearch);
      if (nextCategory) params.append("category", nextCategory);
      if (nextSort) params.append("sort", nextSort);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (!res.ok) { setError("Nie udało się pobrać produktów"); return; }
      setProducts(data);
    } catch { setError("Wystąpił błąd połączenia"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    const s = searchParams.get("search") || searchParams.get("q") || "";
    const c = searchParams.get("category") || "";
    const so = searchParams.get("sort") || "newest";
    setSearch(s); setCategory(c); setSort(so);
    loadProducts(s, c, so);
  }, [searchParams]);

  const updateUrl = (s: string, c: string, so: string) => {
    const p = new URLSearchParams();
    if (s) p.set("search", s);
    if (c) p.set("category", c);
    if (so) p.set("sort", so);
    router.push(p.toString() ? `/?${p}` : "/");
  };

  const selectCategory = (c: string) => {
    setCategory(c);
    updateUrl(search, c, sort);
  };

  const showFeatured = !category && !search;

  const sectionProducts = useMemo(() => {
    const map: Record<string, Product[]> = {};
    CATEGORY_SECTIONS.forEach(s => {
      map[s.key] = products.filter(p => p.category === s.key).slice(0, 4);
    });
    return map;
  }, [products]);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)" }}>
      {/* Hero banner */}
      <section className="bg-white">
        <HomeBannerSlider
          onSaleClick={() => selectCategory("WYPRZEDAZ")}
          onNewClick={() => selectCategory("NOWOSCI")}
        />
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: <Truck className="h-5 w-5" />, title: "Szybka wysyłka", text: "Realizacja w 24–48h roboczych" },
              { icon: <ShieldCheck className="h-5 w-5" />, title: "Bezpieczne zakupy", text: "Szyfrowane połączenie SSL" },
              { icon: <Sparkles className="h-5 w-5" />, title: "Świeża oferta", text: "Regularnie dodawane nowości" },
            ].map(({ icon, title, text }) => (
              <div key={title} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4caf3d]/10 text-[#4caf3d]">{icon}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category quick links */}
      {showFeatured && (
        <section className="mx-auto max-w-6xl px-6 pt-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Nowości",     href: "/produkty?category=NOWOSCI",     emoji: "✨", bg: "from-violet-50 to-violet-100/60", border: "border-violet-100" },
              { label: "Wyprzedaż",  href: "/produkty?category=WYPRZEDAZ",   emoji: "🏷️", bg: "from-red-50 to-red-100/60",      border: "border-red-100" },
              { label: "Ogród",      href: "/produkty?category=OGROD",      emoji: "🌿", bg: "from-green-50 to-green-100/60",  border: "border-green-100" },
              { label: "Motoryzacja",href: "/produkty?category=MOTORYZACJA", emoji: "🚗", bg: "from-blue-50 to-blue-100/60",   border: "border-blue-100" },
            ].map(({ label, href, emoji, bg, border }) => (
              <Link
                key={href}
                href={href}
                className={`group flex items-center justify-between rounded-2xl border bg-gradient-to-br px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${bg} ${border}`}
              >
                <div>
                  <span className="text-xl">{emoji}</span>
                  <p className="mt-1.5 text-sm font-bold text-gray-800">{label}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-700" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured sections */}
      {showFeatured && !isLoading && (
        <section className="mx-auto max-w-6xl space-y-10 px-6 py-10">
          {CATEGORY_SECTIONS.map(({ key, eyebrow, title, accent, href }) => {
            const items = sectionProducts[key];
            if (!items?.length) return null;
            return (
              <div key={key} className="overflow-hidden rounded-[32px] bg-white" style={{ boxShadow: "var(--shadow-md)" }}>
                <div className="flex items-center justify-between border-b px-7 py-5" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-1.5 rounded-full ${accent}`} />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">{eyebrow}</p>
                      <h2 className="text-xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>{title}</h2>
                    </div>
                  </div>
                  <Link href={href} className="group flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-gray-950 hover:text-white hover:border-gray-950" style={{ borderColor: "var(--border)" }}>
                    Wszystkie
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-4">
                  {items.map(p => (
                    <ProductCard key={p.id} slug={p.slug} name={p.name} price={p.price} image={p.image} category={p.category} stock={p.stock} stockStatus={p.stockStatus} averageRating={p.averageRating} reviewsCount={p.reviewsCount} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Search results */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        {isLoading && (
          <div className="grid gap-5 pt-10 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-[360px] rounded-[26px] skeleton" />)}
          </div>
        )}
        {error && (
          <div className="rounded-[28px] bg-white p-8 text-red-600" style={{ boxShadow: "var(--shadow-md)" }}>
            {error}
          </div>
        )}
        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-[28px] bg-white p-10 text-center" style={{ boxShadow: "var(--shadow-md)" }}>
            <p className="text-2xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>Brak wyników</p>
            <p className="mt-2 text-gray-500">Nie znaleziono produktów spełniających podane kryteria.</p>
          </div>
        )}
        {!isLoading && !error && products.length > 0 && !showFeatured && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map(p => (
              <ProductCard key={p.id} slug={p.slug} name={p.name} price={p.price} image={p.image} category={p.category} stock={p.stock} stockStatus={p.stockStatus} averageRating={p.averageRating} reviewsCount={p.reviewsCount} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
