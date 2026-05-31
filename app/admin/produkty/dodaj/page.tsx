"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import AdminGuard from "../../../../components/AdminGuard";
import AdminGalleryManager from "../../../../components/AdminGalleryManager";
import { CATEGORY_OPTIONS, getCategoryLabel, mapPublicCategoryToProductPayload } from "../../../../lib/categories";

type ProductForm = {
  name: string;
  slug: string;
  price: string;
  description: string;
  productDetails: string;
  image: string;
  category: string;
  subcategory: string;
  galleryImages: string[];
  stock: string;
};

export default function AddProductPage() {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    price: "",
    description: "",
    productDetails: "",
    image: "",
    category: "NOWOSCI",
    subcategory: "",
    galleryImages: [],
    stock: "0",
  });

  const [selectedMainFile, setSelectedMainFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const previewUrl = useMemo(() => {
    if (selectedMainFile) {
      return URL.createObjectURL(selectedMainFile);
    }

    if (form.image.trim()) {
      return form.image.trim();
    }

    return "";
  }, [selectedMainFile, form.image]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNameChange = (value: string) => {
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    setForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug ? prev.slug : generatedSlug,
    }));
  };

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMainFile(e.target.files?.[0] || null);
  };

  const uploadMainImage = async () => {
    if (!selectedMainFile) return form.image;

    const data = new FormData();
    data.append("file", selectedMainFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Nie udało się wysłać głównego zdjęcia");
    }

    return result.imageUrl as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.name || !form.slug || !form.price || !form.description) {
      const msg = "Uzupełnij wszystkie wymagane pola";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!selectedMainFile && !form.image) {
      const msg = "Dodaj główne zdjęcie produktu";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (Number(form.stock) < 0) {
      const msg = "Stan magazynowy nie może być ujemny";
      setError(msg);
      toast.error(msg);
      return;
    }

    const toastId = toast.loading("Dodawanie produktu...");

    try {
      setIsLoading(true);

      const mainImageUrl = await uploadMainImage();
      const categoryPayload = mapPublicCategoryToProductPayload(form.category);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          price: Number(form.price),
          description: form.description,
          productDetails: form.productDetails,
          image: mainImageUrl,
          category: categoryPayload.category,
          subcategory: categoryPayload.subcategory,
          galleryImages: form.galleryImages,
          stock: Number(form.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || "Nie udało się dodać produktu";
        setError(msg);
        toast.error(msg, { id: toastId });
        return;
      }

      setForm({
        name: "",
        slug: "",
        price: "",
        description: "",
        productDetails: "",
        image: "",
        category: "NOWOSCI",
        subcategory: "",
        galleryImages: [],
        stock: "0",
      });

      setSelectedMainFile(null);
      setMessage("Produkt został dodany do bazy");
      toast.success("Produkt został dodany", { id: toastId });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Wystąpił błąd połączenia";
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
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
                  Panel administracyjny
                </p>
                <h1 className="mt-3 text-4xl font-bold text-gray-900">
                  Dodaj produkt
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                  Uzupełnij dane produktu, ustaw kategorię, stan magazynowy i
                  dodaj galerię zdjęć z dysku.
                </p>
              </div>

              <Link
                href="/admin/produkty"
                className="rounded-xl border border-black px-5 py-3 font-medium text-black transition hover:bg-black hover:text-white"
              >
                Wróć do produktów
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nazwa produktu
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Cena
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Stan magazynowy
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Kategoria główna
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                    >
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Opis produktu
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tutaj wpisz główny opis produktu."
                    className="min-h-36 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Dane produktu
                  </label>
                  <textarea
                    name="productDetails"
                    value={form.productDetails}
                    onChange={handleChange}
                    placeholder={`Materiał: Bawełna\nKolor: Czarny\nRozmiar: XL\nProducent: StoreNER`}
                    className="min-h-44 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Każda linia po Enterze będzie osobnym wierszem na stronie
                    produktu.
                  </p>
                </div>

                <div className="rounded-2xl border border-dashed border-gray-300 p-5">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Główne zdjęcie produktu
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainFileChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  />
                  <p className="mt-3 text-sm text-gray-500">
                    Wybierz główne zdjęcie z dysku.
                  </p>
                </div>

                <AdminGalleryManager
                  images={form.galleryImages}
                  onChange={(images) =>
                    setForm((prev) => ({ ...prev, galleryImages: images }))
                  }
                  maxImages={12}
                  title="Galeria produktu"
                />

                {message && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-black px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {isLoading ? "Dodawanie produktu..." : "Dodaj produkt"}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Podgląd
                </p>
                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  Karta produktu
                </h2>

                <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-gray-50">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={form.name || "Podgląd produktu"}
                      className="h-72 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center text-gray-400">
                      Brak zdjęcia produktu
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {form.name || "Nazwa produktu"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {getCategoryLabel(form.category)}
                    </p>

                    <p className="mt-4 text-2xl font-bold text-black">
                      {form.price
                        ? `${Number(form.price).toFixed(2)} zł`
                        : "0.00 zł"}
                    </p>

                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-600">
                      {form.description || "Tutaj pojawi się opis produktu."}
                    </p>

                    {form.productDetails && (
                      <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        {form.productDetails
                          .split("\n")
                          .filter(Boolean)
                          .map((line, index) => (
                            <div
                              key={`${line}-${index}`}
                              className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700 last:border-b-0"
                            >
                              {line}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Galeria
                </p>
                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  Podgląd zdjęć
                </h2>

                {form.galleryImages.length === 0 ? (
                  <div className="mt-6 rounded-2xl bg-gray-50 p-6 text-gray-500">
                    Nie dodano jeszcze zdjęć galerii.
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {form.galleryImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-2xl border border-gray-200"
                      >
                        <img
                          src={image}
                          alt={`Galeria ${index + 1}`}
                          className="h-28 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </AdminGuard>
  );
}