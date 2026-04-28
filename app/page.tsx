"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgePercent,
  House,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
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

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async (
    nextSearch = search,
    nextMinPrice = minPrice,
    nextMaxPrice = maxPrice,
    nextCategory = category,
    nextSubcategory = subcategory,
    nextSort = sort
  ) => {
    try {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (nextSearch) params.append("search", nextSearch);
      if (nextMinPrice) params.append("minPrice", nextMinPrice);
      if (nextMaxPrice) params.append("maxPrice", nextMaxPrice);
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
    const urlSearch = searchParams.get("search") || "";
    const urlMinPrice = searchParams.get("minPrice") || "";
    const urlMaxPrice = searchParams.get("maxPrice") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlSubcategory = searchParams.get("subcategory") || "";
    const urlSort = searchParams.get("sort") || "newest";

    setSearch(urlSearch);
    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);
    setCategory(urlCategory);
    setSubcategory(urlSubcategory);
    setSort(urlSort);

    loadProducts(
      urlSearch,
      urlMinPrice,
      urlMaxPrice,
      urlCategory,
      urlSubcategory,
      urlSort
    );
  }, [searchParams]);

  const updateUrl = (
    nextSearch: string,
    nextMinPrice: string,
    nextMaxPrice: string,
    nextCategory: string,
    nextSubcategory: string,
    nextSort: string
  ) => {
    const params = new URLSearchParams();

    if (nextSearch) params.set("search", nextSearch);
    if (nextMinPrice) params.set("minPrice", nextMinPrice);
    if (nextMaxPrice) params.set("maxPrice", nextMaxPrice);
    if (nextCategory) params.set("category", nextCategory);
    if (nextSubcategory) params.set("subcategory", nextSubcategory);
    if (nextSort) params.set("sort", nextSort);

    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(search, minPrice, maxPrice, category, subcategory, sort);
  };

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("");
    setSubcategory("");
    setSort("newest");
    router.push("/");
  };

  const selectCategory = (nextCategory: string, nextSubcategory = "") => {
    setCategory(nextCategory);
    setSubcategory(nextSubcategory);
    updateUrl(search, minPrice, maxPrice, nextCategory, nextSubcategory, sort);
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

  const showFeatured = !category && !search && !minPrice && !maxPrice;

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
          <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-black p-3 text-white">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Szybka wysyłka
                </p>
                <p className="text-sm text-gray-500">Sprawna realizacja zamówień</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-black p-3 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Bezpieczne zakupy
                </p>
                <p className="text-sm text-gray-500">Wygodne płatności i wsparcie</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-black p-3 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Starannie wybrane produkty
                </p>
                <p className="text-sm text-gray-500">Nowości, okazje i bestsellery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Odkrywaj ofertę
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                Kategorie sklepu
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
                Szybko przejdź do wybranej sekcji i przeglądaj produkty w bardziej
                uporządkowany sposób.
              </p>
            </div>

            {(category || subcategory) && (
              <div className="flex flex-wrap gap-2">
                {category && (
                  <span className="rounded-full border border-black px-4 py-2 text-sm font-medium text-black">
                    {category === "NOWOSCI" && "Nowości"}
                    {category === "WYPRZEDAZ" && "Wyprzedaż"}
                    {category === "DOM_I_OGROD" && "Dom i ogród"}
                    {category === "MOTORYZACJA" && "Motoryzacja"}
                    {category === "AKCESORIA_DLA_ZWIERZAT" &&
                      "Akcesoria dla zwierząt"}
                  </span>
                )}

                {subcategory && (
                  <span className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
                    {subcategory === "OGROD" && "Ogród"}
                    {subcategory === "WYPOSAZENIE" && "Wyposażenie"}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              onClick={() => selectCategory("NOWOSCI")}
              className={`group rounded-[28px] border p-5 text-left transition ${
                category === "NOWOSCI"
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-[#fafafa] hover:border-black hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-black/10 p-3 text-current">
                  <Sparkles className="h-5 w-5" />
                </div>
                <ArrowRight className="h-5 w-5 opacity-60 transition group-hover:translate-x-1" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Nowości</h3>
              <p className="mt-2 text-sm leading-6 opacity-70">
                Najświeższe produkty dodane do sklepu.
              </p>
            </button>

            <button
              type="button"
              onClick={() => selectCategory("WYPRZEDAZ")}
              className={`group rounded-[28px] border p-5 text-left transition ${
                category === "WYPRZEDAZ"
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-[#fafafa] hover:border-black hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-black/10 p-3 text-current">
                  <BadgePercent className="h-5 w-5" />
                </div>
                <ArrowRight className="h-5 w-5 opacity-60 transition group-hover:translate-x-1" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Wyprzedaż</h3>
              <p className="mt-2 text-sm leading-6 opacity-70">
                Najlepsze okazje i promocyjne ceny.
              </p>
            </button>

            <button
              type="button"
              onClick={() => selectCategory("DOM_I_OGROD")}
              className={`group rounded-[28px] border p-5 text-left transition ${
                category === "DOM_I_OGROD" && !subcategory
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-[#fafafa] hover:border-black hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-black/10 p-3 text-current">
                  <House className="h-5 w-5" />
                </div>
                <ArrowRight className="h-5 w-5 opacity-60 transition group-hover:translate-x-1" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Dom i ogród</h3>
              <p className="mt-2 text-sm leading-6 opacity-70">
                Produkty do wnętrz, ogrodu i codziennego wyposażenia.
              </p>
            </button>

            <div className="rounded-[28px] border border-black/10 bg-[#fafafa] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-500">
                Podkategorie
              </p>

              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => selectCategory("DOM_I_OGROD", "OGROD")}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    category === "DOM_I_OGROD" && subcategory === "OGROD"
                      ? "bg-black text-white"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span>Ogród</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => selectCategory("DOM_I_OGROD", "WYPOSAZENIE")}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    category === "DOM_I_OGROD" && subcategory === "WYPOSAZENIE"
                      ? "bg-black text-white"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span>Wyposażenie</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => selectCategory("MOTORYZACJA")}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    category === "MOTORYZACJA"
                      ? "bg-black text-white"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span>Motoryzacja</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => selectCategory("AKCESORIA_DLA_ZWIERZAT")}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    category === "AKCESORIA_DLA_ZWIERZAT"
                      ? "bg-black text-white"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span>Akcesoria dla zwierząt</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showFeatured && (
        <section className="mx-auto max-w-6xl px-6 pb-4">
          <div className="space-y-10">
            {featuredNew.length > 0 && (
              <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Kolekcja
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-950">
                      Nowości
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => selectCategory("NOWOSCI")}
                    className="rounded-2xl border border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                  >
                    Zobacz więcej
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {featuredNew.map((product) => (
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
            )}

            {featuredSale.length > 0 && (
              <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Promocje
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-950">
                      Wyprzedaż
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => selectCategory("WYPRZEDAZ")}
                    className="rounded-2xl border border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                  >
                    Zobacz więcej
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {featuredSale.map((product) => (
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
            )}

            {featuredHome.length > 0 && (
              <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Inspiracje
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-950">
                      Dom i ogród
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => selectCategory("DOM_I_OGROD")}
                    className="rounded-2xl border border-black px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                  >
                    Zobacz więcej
                  </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {featuredHome.map((product) => (
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
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-6">
        <div className="sticky top-24 z-30 rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur">
          <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Katalog produktów
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-950">
                Znajdź to, czego szukasz
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              Znaleziono:{" "}
              <span className="font-semibold text-black">{products.length}</span>
            </p>
          </div>

          <form onSubmit={handleFilter}>
            <div className="grid gap-4 xl:grid-cols-6">
              <input
                type="text"
                placeholder="Szukaj po nazwie"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 outline-none transition focus:border-black focus:bg-white"
              />

              <input
                type="number"
                placeholder="Cena od"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 outline-none transition focus:border-black focus:bg-white"
              />

              <input
                type="number"
                placeholder="Cena do"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 outline-none transition focus:border-black focus:bg-white"
              />

              <select
                value={category}
                onChange={(e) => {
                  const nextCategory = e.target.value;
                  setCategory(nextCategory);
                  if (nextCategory !== "DOM_I_OGROD") {
                    setSubcategory("");
                  }
                }}
                className="rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 outline-none transition focus:border-black focus:bg-white"
              >
                <option value="">Wszystkie kategorie</option>
                <option value="NOWOSCI">Nowości</option>
                <option value="WYPRZEDAZ">Wyprzedaż</option>
                <option value="DOM_I_OGROD">Dom i ogród</option>
                <option value="MOTORYZACJA">Motoryzacja</option>
                <option value="AKCESORIA_DLA_ZWIERZAT">
                  Akcesoria dla zwierząt
                </option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 outline-none transition focus:border-black focus:bg-white"
              >
                <option value="newest">Najnowsze</option>
                <option value="price_asc">Cena rosnąco</option>
                <option value="price_desc">Cena malejąco</option>
                <option value="name_asc">Nazwa A–Z</option>
                <option value="name_desc">Nazwa Z–A</option>
              </select>

              <button
                type="submit"
                className="rounded-2xl bg-black px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                Filtruj
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {category === "DOM_I_OGROD" ? (
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 outline-none transition focus:border-black focus:bg-white md:w-80"
                >
                  <option value="">Wszystkie podkategorie</option>
                  <option value="OGROD">Ogród</option>
                  <option value="WYPOSAZENIE">Wyposażenie</option>
                </select>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-2xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-black hover:text-black"
              >
                Wyczyść filtry
              </button>
            </div>
          </form>
        </div>

        {isLoading && (
          <div className="mt-10 rounded-[32px] bg-white p-8 text-gray-600 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            Ładowanie produktów...
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-[32px] bg-white p-8 text-red-600 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            {error}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="mt-10 rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl font-bold text-gray-950">Brak wyników</h2>
            <p className="mt-3 text-gray-600">
              Nie znaleziono produktów spełniających podane kryteria.
            </p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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