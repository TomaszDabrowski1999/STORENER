import Link from "next/link";
import { ArrowUpRight, BadgePercent, PackageCheck, Sparkles } from "lucide-react";
import ReviewStars from "./ReviewStars";

type ProductCardProps = {
  name: string;
  price: number;
  image: string;
  slug: string;
  category?: string;
  stock?: number;
  stockStatus?: string;
  averageRating?: number;
  reviewsCount?: number;
};

export default function ProductCard({
  name,
  price,
  image,
  slug,
  category,
  stock = 0,
  stockStatus = "BRAK",
  averageRating = 0,
  reviewsCount = 0,
}: ProductCardProps) {
  const getCategoryLabel = (value?: string) => {
    if (!value) return "";
    if (value === "NOWOSCI") return "Nowości";
    if (value === "WYPRZEDAZ") return "Wyprzedaż";
    if (value === "DOM_I_OGROD") return "Dom i ogród";
    if (value === "MOTORYZACJA") return "Motoryzacja";
    if (value === "AKCESORIA_DLA_ZWIERZAT") return "Akcesoria dla zwierząt";
    return value;
  };

  const getCategoryBadgeClasses = (value?: string) => {
    if (value === "NOWOSCI") {
      return "border-black/10 bg-black text-white";
    }

    if (value === "WYPRZEDAZ") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (value === "DOM_I_OGROD") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (value === "MOTORYZACJA") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (value === "AKCESORIA_DLA_ZWIERZAT") {
      return "border-orange-200 bg-orange-50 text-orange-700";
    }

    return "border-gray-200 bg-white text-gray-700";
  };

  const getCategoryIcon = (value?: string) => {
    if (value === "NOWOSCI") return <Sparkles className="h-3.5 w-3.5" />;
    if (value === "WYPRZEDAZ") return <BadgePercent className="h-3.5 w-3.5" />;
    return <PackageCheck className="h-3.5 w-3.5" />;
  };

  const getStockLabel = () => {
    if (stockStatus === "BRAK") return "Brak w magazynie";
    if (stockStatus === "MALO_SZTUK") return `Mało sztuk: ${stock}`;
    return `Dostępny: ${stock}`;
  };

  const getStockClasses = () => {
    if (stockStatus === "BRAK") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (stockStatus === "MALO_SZTUK") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  };

  return (
    <Link href={`/produkty/${slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(0,0,0,0.12)]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 transition duration-300 group-hover:opacity-80" />

          <img
            src={image}
            alt={name}
            className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute left-4 top-4 z-20 flex max-w-[80%] flex-wrap gap-2">
            {category && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur ${getCategoryBadgeClasses(
                  category
                )}`}
              >
                {getCategoryIcon(category)}
                {getCategoryLabel(category)}
              </span>
            )}
          </div>

          <div className="absolute right-4 top-4 z-20">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-sm backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-black">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-[1.08rem] font-semibold leading-7 text-gray-950 transition group-hover:text-black">
              {name}
            </h2>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <ReviewStars rating={Math.round(averageRating)} size="sm" />
            <span className="text-sm font-medium text-gray-700">
              {reviewsCount > 0 ? averageRating.toFixed(1) : "Brak ocen"}
            </span>
            {reviewsCount > 0 && (
              <span className="text-sm text-gray-400">({reviewsCount})</span>
            )}
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                cena
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
                {price.toFixed(2)}
                <span className="ml-1 text-lg font-semibold text-gray-500">zł</span>
              </p>
            </div>
          </div>

          <div className="mt-5">
            <span
              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStockClasses()}`}
            >
              {getStockLabel()}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-3 border-t border-gray-100 pt-5">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Zobacz szczegóły produktu
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Więcej zdjęć, opis i opinie klientów
              </p>
            </div>

            <span className="rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition duration-300 group-hover:bg-gray-900">
              Szczegóły
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}