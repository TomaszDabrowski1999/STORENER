"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import ProductCard from "../components/ProductCard";
import HomeBannerSlider from "../components/HomeBannerSlider";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  subcategory: string | null;
  stock: number;
  stockStatus: string;
  averageRating: number;
  reviewsCount: number;
};

export default function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async (
    nextSearch = search,
    nextCategory = category,
    nextSubcategory = subcategory,
    nextSort = sort
  ) => {
    try {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (nextSearch) params.append("search", nextSearch);
      if (nextCategory) params.append("category", nextCategory);
      if (nextSubcategory) params.append("subcategory", nextSubcategory);
      if (nextSort) params.append("sort", nextSort);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError("Nie udało się pobrać produktów");
        return;
      }

      setProducts(data);
    } catch {
      setError("Wystąpił błąd połączenia");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlSearch = searchParams.get("search") || searchParams.get("q") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlSubcategory = searchParams.get("subcategory") || "";
    const urlSort = searchParams.get("sort") || "newest";

    setSearch(urlSearch);
    setCategory(urlCategory);
    setSubcategory(urlSubcategory);
    setSort(urlSort);

    loadProducts(urlSearch, urlCategory, urlSubcategory, urlSort);
  }, [searchParams]);

  const updateUrl = (
    nextSearch: string,
    nextCategory: string,
    nextSubcategory: string,
    nextSort: string
  ) => {
    const params = new URLSearchParams();

    if (nextSearch) params.set("search", nextSearch);
    if (nextCategory) params.set("category", nextCategory);
    if (nextSubcategory) params.set("subcategory", nextSubcategory);
    if (nextSort) params.set("sort", nextSort);

    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  const selectCategory = (nextCategory: string, nextSubcategory = "") => {
    setCategory(nextCategory);
    setSubcategory(nextSubcategory);
    updateUrl(search, nextCategory, nextSubcategory, sort);
  };

  const featuredNew = useMemo(
    () => products.filter((p) => p.category === "NOWOSCI").slice(0, 4),
    [products]
  );

  const featuredSale = useMemo(
    () => products.filter((p) => p.category === "WYPRZEDAZ").slice(0, 4),
    [products]
  );

  const featuredHome = useMemo(
    () => products.filter((p) => p.category === "DOM_I_OGROD").slice(0, 4),
    [products]
  );

  const showFeatured = !category && !search;

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <section className="border-b border-black/5 bg-white">
        <HomeBannerSlider
          onSaleClick={() => selectCategory("WYPRZEDAZ")}
          onNewClick={() => selectCategory("NOWOSCI")}
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-8">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoBox
            icon={<Truck className="h-5 w-5" />}
            title="Szybka wysyłka"
            text="Sprawna realizacja zamówień"
          />
          <InfoBox
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Bezpieczne zakupy"
            text="Wygodne płatności i wsparcie"
          />
          <InfoBox
            icon={<Sparkles className="h-5 w-5" />}
            title="Starannie wybrane produkty"
            text="Nowości, okazje i bestsellery"
          />
        </div>
      </section>

      {showFeatured && (
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="space-y-10">
            {featuredNew.length > 0 && (
              <ProductSection
                eyebrow="Kolekcja"
                title="Nowości"
                products={featuredNew}
                onClick={() => selectCategory("NOWOSCI")}
              />
            )}

            {featuredSale.length > 0 && (
              <ProductSection
                eyebrow="Promocje"
                title="Wyprzedaż"
                products={featuredSale}
                onClick={() => selectCategory("WYPRZEDAZ")}
              />
            )}

            {featuredHome.length > 0 && (
              <ProductSection
                eyebrow="Inspiracje"
                title="Dom i ogród"
                products={featuredHome}
                onClick={() => selectCategory("DOM_I_OGROD")}
              />
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-6">
        {isLoading && (
          <div className="rounded-[32px] bg-white p-8 text-gray-600 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            Ładowanie produktów...
          </div>
        )}

        {error && (
          <div className="rounded-[32px] bg-white p-8 text-red-600 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            {error}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl font-bold text-gray-950">Brak wyników</h2>
            <p className="mt-3 text-gray-600">
              Nie znaleziono produktów spełniających podane kryteria.
            </p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && !showFeatured && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                stock={product.stock}
                stockStatus={product.stockStatus}
                averageRating={product.averageRating}
                reviewsCount={product.reviewsCount}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function InfoBox({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-black p-3 text-white">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ProductSection({
  eyebrow,
  title,
  products,
  onClick,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
  onClick: () => void;
}) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-950">{title}</h2>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="rounded-2xl border border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
        >
          Zobacz więcej
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={product.image}
            category={product.category}
            stock={product.stock}
            stockStatus={product.stockStatus}
            averageRating={product.averageRating}
            reviewsCount={product.reviewsCount}
          />
        ))}
      </div>
    </div>
  );
}