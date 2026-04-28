import Link from "next/link";
import {
  BadgeCheck,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import AddToCartButton from "../../../components/AddToCartButton";
import ProductGallery from "../../../components/ProductGallery";
import ProductCard from "../../../components/ProductCard";
import ProductReviews from "../../../components/ProductReviews";
import { prisma } from "../../../lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] p-10">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <h1 className="text-3xl font-bold text-gray-950">
            Nie znaleziono produktu
          </h1>
          <p className="mt-3 text-gray-600">
            Produkt o podanym adresie nie istnieje lub został usunięty.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-2xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
          >
            Wróć na stronę główną
          </Link>
        </div>
      </main>
    );
  }

  const similarProductsRaw = await prisma.product.findMany({
    where: {
      isActive: true,
      category: product.category,
      NOT: {
        id: product.id,
      },
    },
    orderBy: {
      id: "desc",
    },
    take: 4,
    include: {
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  const similarProducts = similarProductsRaw.map((item: any) => {
    const reviewsCount = item.reviews.length;
    const averageRating =
      reviewsCount > 0
        ? item.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewsCount
        : 0;

    return {
      ...item,
      averageRating,
      reviewsCount,
    };
  });

  const galleryImages = [
    product.image,
    ...product.images.map((img) => img.url),
  ].filter(Boolean);

  const getCategoryLabel = (value: string) => {
    if (value === "NOWOSCI") return "Nowości";
    if (value === "WYPRZEDAZ") return "Wyprzedaż";
    if (value === "DOM_I_OGROD") return "Dom i ogród";
    if (value === "MOTORYZACJA") return "Motoryzacja";
    if (value === "AKCESORIA_DLA_ZWIERZAT") return "Akcesoria dla zwierząt";
    return value;
  };

  const getSubcategoryLabel = (value: string | null) => {
    if (!value) return null;
    if (value === "OGROD") return "Ogród";
    if (value === "WYPOSAZENIE") return "Wyposażenie";
    return value;
  };

  const getStockLabel = () => {
    if (product.stockStatus === "BRAK") return "Brak w magazynie";
    if (product.stockStatus === "MALO_SZTUK") return `Mało sztuk (${product.stock})`;
    return `Dostępny (${product.stock})`;
  };

  const getStockClasses = () => {
    if (product.stockStatus === "BRAK") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (product.stockStatus === "MALO_SZTUK") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="transition hover:text-black">
              Start
            </Link>
            <span>/</span>
            <span>{getCategoryLabel(product.category)}</span>
            <span>/</span>
            <span className="text-black">{product.name}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[34px] bg-white">
              <ProductGallery images={galleryImages.slice(0, 12)} name={product.name} />
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-[34px] border border-black/5 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
                    {getCategoryLabel(product.category)}
                  </span>

                  {product.subcategory && (
                    <span className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
                      {getSubcategoryLabel(product.subcategory)}
                    </span>
                  )}
                </div>

                <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
                  {product.name}
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
                  {product.description}
                </p>

                <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      cena produktu
                    </p>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-950">
                      {product.price.toFixed(2)}
                      <span className="ml-1 text-xl font-semibold text-gray-500">
                        zł
                      </span>
                    </p>
                  </div>

                  <div
                    className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${getStockClasses()}`}
                  >
                    {getStockLabel()}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-gray-100 bg-[#fafafa] p-4">
                    <div className="flex items-center gap-2 text-gray-900">
                      <Truck className="h-4 w-4" />
                      <p className="text-sm font-semibold">Dostawa</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Szybka wysyłka w 24–48h.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-[#fafafa] p-4">
                    <div className="flex items-center gap-2 text-gray-900">
                      <RefreshCcw className="h-4 w-4" />
                      <p className="text-sm font-semibold">Zwrot</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Masz 14 dni na zwrot produktu.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-[#fafafa] p-4">
                    <div className="flex items-center gap-2 text-gray-900">
                      <ShieldCheck className="h-4 w-4" />
                      <p className="text-sm font-semibold">Bezpieczeństwo</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Pewny zakup i bezpieczny proces zamówienia.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <AddToCartButton
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Szczegóły
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-gray-950">
                    O produkcie
                  </h2>

                  <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600">
                    <p>{product.description}</p>
                    <p>
                      Produkt został przygotowany jako część nowoczesnej oferty
                      sklepu, łączącej estetykę, wygodę użytkowania i prosty proces
                      zakupowy.
                    </p>
                    <p>
                      Sprawdzi się zarówno jako praktyczny wybór na co dzień, jak i
                      element bardziej dopracowanej kolekcji zakupowej.
                    </p>
                  </div>
                </div>

                <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Informacje
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-gray-950">
                    Dane produktu
                  </h2>

                  <div className="mt-5 space-y-4 text-sm text-gray-700">
                    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <span className="text-gray-500">ID</span>
                      <span className="font-semibold text-black">{product.id}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <span className="text-gray-500">Slug</span>
                      <span className="font-semibold text-black">{product.slug}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <span className="text-gray-500">Kategoria</span>
                      <span className="font-semibold text-black">
                        {getCategoryLabel(product.category)}
                      </span>
                    </div>

                    {product.subcategory && (
                      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                        <span className="text-gray-500">Podkategoria</span>
                        <span className="font-semibold text-black">
                          {getSubcategoryLabel(product.subcategory)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <span className="text-gray-500">Stan magazynowy</span>
                      <span className="font-semibold text-black">
                        {product.stock}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-500">Status</span>
                      <span className="inline-flex items-center gap-2 font-semibold text-black">
                        <BadgeCheck className="h-4 w-4" />
                        {getStockLabel()}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="mt-8 inline-block rounded-2xl border border-black px-5 py-3 font-medium text-black transition hover:bg-black hover:text-white"
                  >
                    Wróć na stronę główną
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductReviews productId={product.id} />

      {similarProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-[34px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Podobne produkty
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-950">
                  Więcej z kategorii {getCategoryLabel(product.category)}
                </h2>
              </div>

              <Link
                href={`/?category=${product.category}${
                  product.subcategory ? `&subcategory=${product.subcategory}` : ""
                }`}
                className="rounded-2xl border border-black px-5 py-3 font-medium text-black transition hover:bg-black hover:text-white"
              >
                Zobacz więcej
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {similarProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  slug={item.slug}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  category={item.category}
                  stock={item.stock}
                  stockStatus={item.stockStatus}
                  averageRating={item.averageRating}
                  reviewsCount={item.reviewsCount}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}