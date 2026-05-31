"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminGuard from "../../../../../components/AdminGuard";
import AdminGalleryManager from "../../../../../components/AdminGalleryManager";
import { CATEGORY_OPTIONS, getCategoryLabel, getPublicCategoryValue, mapPublicCategoryToProductPayload } from "../../../../../lib/categories";

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

type AdminProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  image: string;
  isActive: boolean;
  category: string;
  subcategory: string | null;
  stock: number;
  stockStatus: string;
  images: {
    id: number;
    url: string;
    position: number;
  }[];
};

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditProductPage({ params }: Props) {
  const router = useRouter();

  const [productId, setProductId] = useState<number | null>(null);
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

  const [selectedMainFile, setSelectedMainFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const previewUrl = useMemo(() => {
    if (selectedMainFile) {
      return URL.createObjectURL(selectedMainFile);
    }

    if (form.image.trim()) {
      return form.image.trim();
    }

    return "";
  }, [selectedMainFile, form.image]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const resolvedParams = await params;
        const id = Number(resolvedParams.id);

        if (Number.isNaN(id)) {
          setError("Nieprawidłowe ID produktu");
          setIsPageLoading(false);
          return;
        }

        setProductId(id);

        const response = await fetch("/api/admin/products");
        const data: AdminProduct[] = await response.json();

        if (!response.ok) {
          setError("Nie udało się pobrać produktów");
          setIsPageLoading(false);
          return;
        }

        const product = data.find((item) => item.id === id);

        if (!product) {
          setError("Nie znaleziono produktu");
          setIsPageLoading(false);
          return;
        }

        setForm({
          name: product.name,
          slug: product.slug,
          price: String(product.price),
          description: product.description,
          image: product.image,
          category: getPublicCategoryValue(product.category, product.subcategory) || "NOWOSCI",
          subcategory: "",
          galleryImages: product.images
            ? product.images
                .sort((a, b) => a.position - b.position)
                .map((img) => img.url)
                .slice(0, 12)
            : [],
          stock: String(product.stock ?? 0),
        });
      } catch {
        setError("Wystąpił błąd połączenia");
      } finally {
        setIsPageLoading(false);
      }
    };

    loadProduct();
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleGenerateSlug = () => {
  const generatedSlug = form.name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

  setForm((prev) => ({
    ...prev,
    slug: generatedSlug,
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

    if (!productId) {
      const msg = "Brak ID produktu";
      setError(msg);
      toast.error(msg);
      return;
    }

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

    const toastId = toast.loading("Zapisywanie produktu...");

    try {
      setIsSaving(true);

      const mainImageUrl = await uploadMainImage();
      const categoryPayload = mapPublicCategoryToProductPayload(form.category);

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          price: Number(form.price),
          description: form.description,
          image: mainImageUrl,
          category: categoryPayload.category,
          subcategory: categoryPayload.subcategory,
          galleryImages: form.galleryImages,
          stock: Number(form.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || "Nie udało się zapisać zmian";
        setError(msg);
        toast.error(msg, { id: toastId });
        return;
      }

      setForm({
        name: data.name,
        slug: data.slug,
        price: String(data.price),
        description: data.description,
        image: data.image,
        category: data.category || form.category,
        subcategory: data.subcategory || "",
        galleryImages: data.images
          ? data.images
              .sort(
                (a: { position: number }, b: { position: number }) =>
                  a.position - b.position
              )
              .map((img: { url: string }) => img.url)
              .slice(0, 12)
          : [],
        stock: String(data.stock ?? 0),
      });

      setSelectedMainFile(null);
      setMessage("Produkt został zaktualizowany");
      toast.success("Produkt został zaktualizowany", { id: toastId });

      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Wystąpił błąd połączenia";
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsSaving(false);
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
                  Edytuj produkt
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                  Aktualizuj dane produktu, kategorię, stan magazynowy i galerię zdjęć.
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
          {isPageLoading ? (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-gray-600">Ładowanie produktu...</p>
            </div>
          ) : error && !form.name ? (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
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
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Slug
                      </label>

                      <button
                        type="button"
                        onClick={handleGenerateSlug}
                        className="text-sm font-medium text-gray-600 hover:text-black"
                      >
                        Wygeneruj z nazwy
                      </button>
                    </div>

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
                      className="min-h-36 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  <div className="rounded-2xl border border-dashed border-gray-300 p-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Nowe główne zdjęcie produktu
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainFileChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3"
                    />
                    <p className="mt-3 text-sm text-gray-500">
                      Możesz zostawić obecne zdjęcie albo podmienić je nowym plikiem.
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

                  {error && form.name && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full rounded-xl bg-black px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  >
                    {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                    podgląd
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
                        {form.price ? `${Number(form.price).toFixed(2)} zł` : "0.00 zł"}
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-600">
                        Stan magazynowy: {form.stock}
                      </p>

                      <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-600">
                        {form.description || "Tutaj pojawi się opis produktu."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                    galeria
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
          )}
        </section>
      </main>
    </AdminGuard>
  );
}