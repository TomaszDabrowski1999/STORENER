import Link from "next/link";
import { RefreshCcw, ShieldCheck, Truck, Star, ChevronRight, Package, Heart } from "lucide-react";
import AddToCartButton from "../../../components/AddToCartButton";
import ProductGallery from "../../../components/ProductGallery";
import ProductCard from "../../../components/ProductCard";
import { prisma } from "../../../lib/prisma";
import { getCategoryLabel } from "../../../lib/categories";
import { formatDescriptionHtml } from "../../../lib/format";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      reviews: { include: { user: { select: { fullName: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) {
    return (
      <main className="min-h-screen" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-200" />
          <h1 className="text-2xl font-bold text-gray-950">Nie znaleziono produktu</h1>
          <p className="mt-2 text-gray-500">Produkt nie istnieje lub został usunięty.</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0a0a0a] px-6 py-3 font-semibold text-white transition hover:bg-[#1a1a1a]">
            Wróć na stronę główną
          </Link>
        </div>
      </main>
    );
  }

  const [similarProductsRaw] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, category: product.category, NOT: { id: product.id } },
      orderBy: { id: "desc" }, take: 4,
      include: { reviews: { select: { rating: true } } },
    }),
  ]);

  const similarProducts = similarProductsRaw.map((item: any) => {
    const count = item.reviews.length;
    return { ...item, averageRating: count > 0 ? item.reviews.reduce((s: number, r: any) => s + r.rating, 0) / count : 0, reviewsCount: count };
  });

  const galleryImages = [product.image, ...product.images.map(img => img.url).filter(url => url && url.trim() && url !== "null" && !url.startsWith("/uploads"))];
  const productDetailsLines = (product.productDetails || "").split("\n").map(l => l.trim()).filter(Boolean);
  const reviewCount = product.reviews.length;
  const avgRating = reviewCount > 0 ? product.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount : 0;
  const isOutOfStock = product.stockStatus === "BRAK";
  const isLowStock = product.stockStatus === "MALO_SZTUK";

  return (
    <main className="min-h-screen" style={{ background: "var(--surface)" }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-6 py-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="transition hover:text-gray-700">Start</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/produkty" className="transition hover:text-gray-700">Produkty</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/produkty?category=${product.category}`} className="transition hover:text-gray-700">{getCategoryLabel(product.category)}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-700 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Gallery */}
          <div className="rounded-[28px] overflow-hidden bg-white" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
            <ProductGallery images={galleryImages} name={product.name} />
          </div>

          {/* Info panel */}
          <div className="space-y-4">
            {/* Main card */}
            <div className="rounded-[28px] bg-white p-7" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
              {/* Category + stock */}
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/produkty?category=${product.category}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-200">
                  {getCategoryLabel(product.category)}
                </Link>
                {isLowStock && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Ostatnie sztuki</span>}
                {isOutOfStock && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">Brak w magazynie</span>}
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
                {product.name}
              </h1>

              {/* Rating */}
              {reviewCount > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />)}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{avgRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({reviewCount} {reviewCount === 1 ? "opinia" : "opinii"})</span>
                </div>
              )}

              {/* Price */}
              <div className="mt-5 flex items-end gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cena</p>
                  <p className="mt-1 text-4xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>
                    {product.price.toFixed(2)} <span className="text-xl font-semibold text-gray-400">zł</span>
                  </p>
                </div>
              </div>

              {/* Trust mini-badges */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { icon: Truck, label: "Dostawa 24–48h" },
                  { icon: RefreshCcw, label: "14 dni zwrotu" },
                  { icon: ShieldCheck, label: "Bezpieczny zakup" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <Icon className="h-4 w-4 text-[#4caf3d]" />
                    <p className="text-[11px] font-medium text-gray-600">{label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6">
                <AddToCartButton id={product.id} name={product.name} price={product.price} image={product.image} stock={product.stock} />
              </div>

              {product.stock > 0 && (
                <p className="mt-3 text-center text-xs text-gray-400">
                  {product.stock > 5 ? `✓ W magazynie (${product.stock} szt.)` : `⚠ Zostało tylko ${product.stock} szt.`}
                </p>
              )}
            </div>

            {/* Product details table */}
            {productDetailsLines.length > 0 && (
              <div className="rounded-[24px] bg-white" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                <div className="border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dane produktu</p>
                  <h2 className="mt-1 font-bold text-gray-950">Specyfikacja</h2>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {productDetailsLines.map((line, i) => {
                    const [key, ...rest] = line.split(":");
                    const val = rest.join(":").trim();
                    return (
                      <div key={i} className="flex items-center justify-between px-6 py-3 text-sm">
                        <span className="font-medium text-gray-500">{key.trim()}</span>
                        <span className="font-semibold text-gray-900">{val || line}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 rounded-[28px] bg-white p-8" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Szczegóły</p>
          <h2 className="mt-1 mb-6 text-2xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Opis produktu</h2>
          <div
            className="max-w-4xl text-[15px] leading-8 text-gray-700 [&_strong]:font-bold [&_b]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:mb-4 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:mb-4 [&_li]:mb-1.5 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-3 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-3 [&_th]:text-left"
            dangerouslySetInnerHTML={{ __html: formatDescriptionHtml(product.description) }}
          />
        </div>

        {/* Reviews */}
        {reviewCount > 0 && (
          <div className="mt-6 rounded-[28px] bg-white p-8" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Opinie klientów</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>
                  {avgRating.toFixed(1)} / 5
                </h2>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className={`h-6 w-6 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />)}
              </div>
            </div>
            <div className="space-y-4">
              {product.reviews.slice(0, 5).map(review => (
                <div key={review.id} className="rounded-2xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a0a0a] text-xs font-bold text-white">
                        {review.user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{review.user.fullName}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />)}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-800">{review.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                  <p className="mt-2 text-xs text-gray-400">{new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "long", year: "numeric" }).format(review.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="rounded-[28px] bg-white p-6" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Może ci się spodobać</p>
                <h2 className="mt-1 text-xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Podobne produkty</h2>
              </div>
              <Link href={`/produkty?category=${product.category}`} className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-800 hover:text-gray-900" style={{ borderColor: "var(--border)" }}>
                Zobacz więcej <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {similarProducts.map((item: any) => (
                <ProductCard key={item.id} slug={item.slug} name={item.name} price={item.price} image={item.image} category={item.category} stock={item.stock} stockStatus={item.stockStatus} averageRating={item.averageRating} reviewsCount={item.reviewsCount} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
