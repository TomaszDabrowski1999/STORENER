"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../components/ProductCard";

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

export default function ProduktyPage() {
  const searchParams = useSearchParams();

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

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("");
    setSubcategory("");
    setSort("newest");
    loadProducts("", "", "", "", "", "newest");
  };

  const getCategoryLabel = (value: string) => {
    if (value === "NOWOSCI") return "Nowości";
    if (value === "WYPRZEDAZ") return "Wyprzedaż";
    if (value === "DOM_I_OGROD") return "Dom i ogród";
    if (value === "MOTORYZACJA") return "Motoryzacja";
    if (value === "AKCESORIA_DLA_ZWIERZAT") return "Akcesoria dla zwierząt";
    return value;
  };

  const getSubcategoryLabel = (value: string) => {
    if (value === "OGROD") return "Ogród";
    if (value === "WYPOSAZENIE") return "Wyposażenie";
    return value;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Katalog
          </p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">Produkty</h1>

          {(category || subcategory) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {category && (
                <span className="rounded-full border border-black px-4 py-2 text-sm font-medium text-black">
                  {getCategoryLabel(category)}
                </span>
              )}

              {subcategory && (
                <span className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
                  {getSubcategoryLabel(subcategory)}
                </span>
              )}
            </div>
          )}

          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            Przeglądaj ofertę sklepu według kategorii i podkategorii.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="sticky top-24 z-30 rounded-3xl bg-white p-5 shadow-sm">
          <form onSubmit={handleFilter}>
            <div className="grid gap-4 xl:grid-cols-6">
              <input
                type="text"
                placeholder="Szukaj po nazwie"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
              />

              <input
                type="number"
                placeholder="Cena od"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
              />

              <input
                type="number"
                placeholder="Cena do"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
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
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
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
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
              >
                <option value="newest">Najnowsze</option>
                <option value="price_asc">Cena rosnąco</option>
                <option value="price_desc">Cena malejąco</option>
                <option value="name_asc">Nazwa A–Z</option>
                <option value="name_desc">Nazwa Z–A</option>
              </select>

              <button
                type="submit"
                className="rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                Filtruj
              </button>
            </div>

            {category === "DOM_I_OGROD" && (
              <div className="mt-4">
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black md:w-80"
                >
                  <option value="">Wszystkie podkategorie</option>
                  <option value="OGROD">Ogród</option>
                  <option value="WYPOSAZENIE">Wyposażenie</option>
                </select>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Znaleziono:{" "}
                <span className="font-semibold text-black">{products.length}</span>
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-gray-600 transition hover:text-black"
              >
                Wyczyść filtry
              </button>
            </div>
          </form>
        </div>

        {isLoading && (
          <div className="mt-10 rounded-2xl bg-white p-8 text-gray-600 shadow-sm">
            Ładowanie produktów...
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-2xl bg-white p-8 text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Brak wyników</h2>
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