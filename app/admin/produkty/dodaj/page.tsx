"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import AdminGuard from "../../../../components/AdminGuard";
import AdminGalleryManager from "../../../../components/AdminGalleryManager";

type ProductForm = {
  name: string;
  slug: string;
  price: string;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  galleryImages: string[];
  stock: string;
};

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AddProductPage() {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    slug: "",
    price: "",
    description: "",
    image: "",
    category: "NOWOSCI",
    subcategory: "",
    galleryImages: [],
    stock: "0",
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      setForm((prev) => ({
        ...prev,
        category: value,
        subcategory: value === "DOM_I_OGROD" ? prev.subcategory : "",
      }));
      return;
    }

    if (name === "slug") {
      setSlugManuallyEdited(true);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameChange = (value: string) => {
    const generatedSlug = generateSlug(value);
    setForm((prev) => ({
      ...prev,
      name: value,
      // Only auto-update slug if user hasn't manually customized it
      slug: slugManuallyEdited ? prev.slug : generatedSlug,
    }));
  };

  const handleRegenerateSlug = () => {
    const generatedSlug = generateSlug(form.name);
    setForm((prev) => ({ ...prev, slug: generatedSlug }));
    setSlugManuallyEdited(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.name.trim() || !form.slug.trim() || !form.price || !form.description.trim()) {
      const msg = "Uzupełnij wszystkie wymagane pola";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!selectedMainFile && !form.image.trim()) {
      const msg = "Dodaj główne zdjęcie produktu";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (form.category === "DOM_I_OGROD" && !form.subcategory) {
      const msg = "Dla kategorii Dom i ogród wybierz podkategorię";
      setError(msg);
      toast.error(msg);
      return;
    }

    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      const msg = "Cena musi być większa niż 0";
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

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          price: Number(form.price),
          description: form.description.trim(),
          image: mainImageUrl,
          category: form.category,
          subcategory: form.category === "DOM_I_OGROD" ? form.subcategory : null,
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
        image: "",
        category: "NOWOSCI",
        subcategory: "",
        galleryImages: [],
        stock: "0",
      });
      setSelectedMainFile(null);
      setSlugManuallyEdited(false);

      setMessage("Produkt został dodany do bazy");
      toast.success("Produkt został dodany ✓", { id: toastId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Wystąpił błąd połączenia";
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
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  panel administracyjny
                </p>
                <h1 className="mt-3 text-4xl font-bold text-gray-900">
                  Dodaj produkt
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                  Uzupełnij dane produktu, ustaw kategorię, stan magazynowy i dodaj galerię zdjęć.
                </p>
              </div>
              <Link
                href="/admin/produkty"
                className="rounded-xl border border-black px-5 py-3 font-medium text-black transition hover:bg-black hover:text-white"
              >
                ← Wróć do produktów
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            {/* Form */}
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nazwa */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nazwa produktu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="np. Stół ogrodowy drewniany"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Slug URL <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="np. stol-ogrodowy-drewniany"
                      className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
                    />
                    <button
                      type="button"
                      onClick={handleRegenerateSlug}
                      title="Wygeneruj slug z nazwy"
                      className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-black hover:text-black"
                    >
                      ↺ Generuj
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400">
                    Unikalny identyfikator URL, np. /produkty/<strong>{form.slug || "slug-produktu"}</strong>
                  </p>
                </div>

                {/* Cena i stan magazynowy */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Cena (zł) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
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
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                </div>

                {/* Kategorie */}
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
                      <option value="NOWOSCI">Nowości</option>
                      <option value="WYPRZEDAZ">Wyprzedaż</option>
                      <option value="DOM_I_OGROD">Dom i ogród</option>
                      <option value="MOTORYZACJA">Motoryzacja</option>
                      <option value="AKCESORIA_DLA_ZWIERZAT">Akcesoria dla zwierząt</option>
                    </select>
                  </div>

                  {form.category === "DOM_I_OGROD" && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Podkategoria <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="subcategory"
                        value={form.subcategory}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                      >
                        <option value="">Wybierz podkategorię</option>
                        <option value="OGROD">Ogród</option>
                        <option value="WYPOSAZENIE">Wyposażenie</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Opis */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Opis produktu <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Szczegółowy opis produktu..."
                    className="min-h-36 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
                  />
                </div>

                {/* Główne zdjęcie */}
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Główne zdjęcie produktu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainFileChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                  />
                  {selectedMainFile && (
                    <p className="mt-2 text-xs text-green-600 font-medium">
                      ✓ Wybrano: {selectedMainFile.name}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Obsługiwane formaty: JPG, PNG, WebP. Zdjęcie zostanie zapisane w chmurze.
                  </p>
                </div>

                {/* Galeria */}
                <AdminGalleryManager
                  images={form.galleryImages}
                  onChange={(images) =>
                    setForm((prev) => ({ ...prev, galleryImages: images }))
                  }
                  maxImages={12}
                  title="Galeria produktu"
                />

                {/* Messages */}
                {message && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    ✓ {message}
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    ✕ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-black px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Dodawanie...
                    </span>
                  ) : (
                    "Dodaj produkt"
                  )}
                </button>
              </form>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  podgląd
                </p>
                <h2 className="mt-3 text-2xl font-bold text-gray-900">
                  Karta produktu
                </h2>

                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={form.name || "Podgląd produktu"}
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-64 flex-col items-center justify-center gap-2 text-gray-400">
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Brak zdjęcia produktu</span>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {form.name || "Nazwa produktu"}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {getCategoryLabel(form.category)}
                      {form.category === "DOM_I_OGROD" && form.subcategory
                        ? ` / ${getSubcategoryLabel(form.subcategory)}`
                        : ""}
                    </p>

                    <p className="mt-3 text-2xl font-bold text-black">
                      {form.price ? `${Number(form.price).toFixed(2)} zł` : "0.00 zł"}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                        Number(form.stock) > 5
                          ? "bg-green-100 text-green-700"
                          : Number(form.stock) > 0
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {Number(form.stock) > 5
                          ? `✓ Dostępny (${form.stock} szt.)`
                          : Number(form.stock) > 0
                          ? `⚠ Mało sztuk (${form.stock})`
                          : "✕ Brak"}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                      {form.description || "Tutaj pojawi się opis produktu."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery preview */}
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  galeria
                </p>
                <h2 className="mt-3 text-2xl font-bold text-gray-900">
                  Podgląd zdjęć ({form.galleryImages.length}/12)
                </h2>

                {form.galleryImages.length === 0 ? (
                  <div className="mt-6 rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-400">
                    Nie dodano jeszcze zdjęć galerii.
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {form.galleryImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-xl border border-gray-200"
                      >
                        <img
                          src={image}
                          alt={`Galeria ${index + 1}`}
                          className="h-24 w-full object-cover"
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
