"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminGuard from "../../../components/AdminGuard";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  image: string;
  isActive: boolean;
  category?: string;
  subcategory?: string | null;
  stock?: number;
  stockStatus?: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "HIDDEN">("ALL");

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
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
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" ||
      (filter === "ACTIVE" && product.isActive) ||
      (filter === "HIDDEN" && !product.isActive);

    return matchesSearch && matchesFilter;
  });

  const handleHide = async (id: number, isActive: boolean) => {
    if (!isActive) {
      toast("Ten produkt jest już ukryty");
      return;
    }

    const confirmed = confirm("Na pewno ukryć produkt?");
    if (!confirmed) return;

    const toastId = toast.loading("Ukrywanie produktu...");

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Błąd ukrywania produktu", { id: toastId });
        return;
      }

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, isActive: false } : product
        )
      );

      toast.success("Produkt został ukryty", { id: toastId });
    } catch {
      toast.error("Błąd połączenia", { id: toastId });
    }
  };

  const handleRestore = async (id: number) => {
    const toastId = toast.loading("Przywracanie produktu...");

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Błąd przywracania produktu", { id: toastId });
        return;
      }

      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, isActive: true } : product
        )
      );

      toast.success("Produkt został przywrócony", { id: toastId });
    } catch {
      toast.error("Błąd połączenia", { id: toastId });
    }
  };

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gray-50">
        <section className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  panel administracyjny
                </p>
                <h1 className="mt-3 text-4xl font-bold text-gray-900">
                  Produkty w bazie
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                  Zarządzaj ofertą sklepu, edytuj produkty i ukrywaj lub przywracaj je w sprzedaży.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/admin"
                  className="rounded-xl border border-black px-5 py-3 font-medium text-black transition hover:bg-black hover:text-white"
                >
                  Dashboard
                </Link>

                <Link
                  href="/admin/produkty/dodaj"
                  className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
                >
                  Dodaj produkt
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Szukaj produktu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 md:w-80"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className="rounded-lg border px-3 py-2"
              >
                Wszystkie
              </button>

              <button
                type="button"
                onClick={() => setFilter("ACTIVE")}
                className="rounded-lg border px-3 py-2"
              >
                Aktywne
              </button>

              <button
                type="button"
                onClick={() => setFilter("HIDDEN")}
                className="rounded-lg border px-3 py-2"
              >
                Ukryte
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-gray-600">Ładowanie produktów...</p>
            </div>
          )}

          {error && (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">
                Brak produktów
              </h2>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`h-64 w-full object-cover ${
                      !product.isActive ? "opacity-60 grayscale" : ""
                    }`}
                  />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {product.name}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                          Slug: {product.slug}
                        </p>
                      </div>

                      {product.isActive ? (
                        <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          Aktywny
                        </span>
                      ) : (
                        <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                          Ukryty
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-2xl font-bold text-black">
                      {product.price.toFixed(2)} zł
                    </p>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-600">
                      {product.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/produkty/${product.slug}`}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition hover:border-black"
                      >
                        Podgląd
                      </Link>

                      <Link
                        href={`/admin/produkty/edytuj/${product.id}`}
                        className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Edytuj
                      </Link>

                      {product.isActive ? (
                        <button
                          type="button"
                          onClick={() => handleHide(product.id, product.isActive)}
                          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          Ukryj
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRestore(product.id)}
                          className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                        >
                          Przywróć
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </AdminGuard>
  );
}