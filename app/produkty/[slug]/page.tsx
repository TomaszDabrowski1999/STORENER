import Link from "next/link";
import { RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import AddToCartButton from "../../../components/AddToCartButton";
import ProductGallery from "../../../components/ProductGallery";
import ProductCard from "../../../components/ProductCard";
import { prisma } from "../../../lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] px-6 py-12">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-950">
            Nie znaleziono produktu
          </h1>
          <p className="mt-3 text-gray-600">
            Produkt o podanym adresie nie istnieje lub został usunięty.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-2xl bg-black px-5 py-3 font-medium text-white"
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
      NOT: { id: product.id },
    },
    orderBy: { id: "desc" },
    take: 4,
    include: {
      reviews: {
        select: { rating: true },
      },
    },
  });

  const similarProducts = similarProductsRaw.map((item: any) => {
    const reviewsCount = item.reviews.length;
    const averageRating =
      reviewsCount > 0
        ? item.reviews.reduce(
            (sum: number, review: { rating: number }) => sum + review.rating,
            0
          ) / reviewsCount
        : 0;

    return {
      ...item,
      averageRating,
      reviewsCount,
    };
  });

  const galleryImages = [
    product.image,
    ...product.images
      .map((img) => img.url)
      .filter(
        (url) =>
          url &&
          url.trim() !== "" &&
          url !== "null" &&
          url !== "undefined" &&
          !url.startsWith("/uploads")
      ),
  ];

  const productDetailsLines = (product.productDetails || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-black">
            Start
          </Link>
          <span>/</span>
          <span>{getCategoryLabel(product.category)}</span>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <ProductGallery images={galleryImages} name={product.name} />
          </div>

          <div className="space-y-6">
            <div className="rounded-[34px] border border-black/5 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
                  {getCategoryLabel(product.category)}
                </span>

                {product.subcategory && (
                  <span className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">
                    {getSubcategoryLabel(product.subcategory)}
                  </span>
                )}
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-gray-950">
                {product.name}
              </h1>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Cena produktu
                </p>
                <p className="mt-2 text-4xl font-black tracking-tight text-gray-950">
                  {product.price.toFixed(2)}
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    zł
                  </span>
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <InfoBox
                  icon={<Truck className="h-4 w-4" />}
                  title="Dostawa"
                  text="Szybka wysyłka w 24–48h."
                />
                <InfoBox
                  icon={<RefreshCcw className="h-4 w-4" />}
                  title="Zwrot"
                  text="Masz 14 dni na zwrot produktu."
                />
                <InfoBox
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Bezpieczeństwo"
                  text="Pewny zakup i bezpieczne zamówienie."
                />
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

            <div className="rounded-[30px] border border-black/5 bg-white p-7 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                Informacje
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-950">
                Dane produktu
              </h2>

              <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
                {productDetailsLines.length > 0 ? (
                  productDetailsLines.map((line, index) => (
                    <div
                      key={`${line}-${index}`}
                      className="border-b border-gray-200 px-5 py-4 text-sm font-medium text-gray-700 last:border-b-0"
                    >
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-4 text-sm text-gray-500">
                    Brak dodatkowych danych produktu.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[34px] border border-black/5 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
            Szczegóły
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-950">
            Opis produktu
          </h2>

         <div
  className="
    mt-6
    max-w-4xl
    text-[16px]
    leading-8
    text-gray-700

    [&_strong]:font-bold
    [&_b]:font-bold

    [&_h1]:text-4xl
    [&_h1]:font-black
    [&_h1]:mb-6

    [&_h2]:text-3xl
    [&_h2]:font-bold
    [&_h2]:mt-8
    [&_h2]:mb-4

    [&_h3]:text-2xl
    [&_h3]:font-bold
    [&_h3]:mt-6
    [&_h3]:mb-3

    [&_p]:mb-5

    [&_ul]:ml-6
    [&_ul]:list-disc
    [&_ul]:mb-5

    [&_ol]:ml-6
    [&_ol]:list-decimal
    [&_ol]:mb-5

    [&_li]:mb-2

    [&_table]:w-full
    [&_table]:border-collapse
    [&_table]:overflow-hidden
    [&_table]:rounded-2xl

    [&_td]:border
    [&_td]:border-gray-200
    [&_td]:p-3

    [&_th]:border
    [&_th]:border-gray-200
    [&_th]:bg-gray-100
    [&_th]:p-3
    [&_th]:text-left
  "
  dangerouslySetInnerHTML={{
    __html: product.description,
  }}
/>
        </div>
      </section>

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
                  product.subcategory
                    ? `&subcategory=${product.subcategory}`
                    : ""
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
    <div className="rounded-2xl border border-gray-100 bg-[#fafafa] p-4">
      <div className="flex items-center gap-2 text-gray-900">
        {icon}
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-gray-600">{text}</p>
    </div>
  );
}