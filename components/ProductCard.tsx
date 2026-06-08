import Link from "next/link";
import { ArrowUpRight, BadgePercent, Flame, Home, Leaf, Car, PawPrint, Sofa, Star } from "lucide-react";

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

const CATEGORY_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  NOWOSCI:               { label: "Nowości",              color: "text-violet-700", bg: "bg-violet-50 border-violet-100",  icon: Flame },
  WYPRZEDAZ:             { label: "Wyprzedaż",            color: "text-red-600",    bg: "bg-red-50 border-red-100",        icon: BadgePercent },
  DOM_I_OGROD:           { label: "Dom i ogród",          color: "text-green-700",  bg: "bg-green-50 border-green-100",    icon: Home },
  OGROD:                 { label: "Ogród",                color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-100",icon: Leaf },
  WYPOSAZENIE:           { label: "Wyposażenie",          color: "text-teal-700",   bg: "bg-teal-50 border-teal-100",      icon: Sofa },
  MOTORYZACJA:           { label: "Motoryzacja",          color: "text-blue-700",   bg: "bg-blue-50 border-blue-100",      icon: Car },
  AKCESORIA_DLA_ZWIERZAT:{ label: "Dla zwierząt",         color: "text-orange-700", bg: "bg-orange-50 border-orange-100",  icon: PawPrint },
};

export default function ProductCard({
  name, price, image, slug,
  category,
  stock: _stock = 0,
  stockStatus = "BRAK",
  averageRating = 0,
  reviewsCount = 0,
}: ProductCardProps) {
  const cat = category ? CATEGORY_MAP[category] : null;
  const Icon = cat?.icon;

  const isOutOfStock = stockStatus === "BRAK";
  const isLowStock = stockStatus === "MALO_SZTUK";

  return (
    <Link href={`/produkty/${slug}`} className="group block h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-[26px] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_64px_rgba(0,0,0,0.13)]"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.04)" }}>

        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-[240px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Category badge */}
          {cat && Icon && (
            <div className={`absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold backdrop-blur-sm ${cat.bg} ${cat.color}`}>
              <Icon className="h-3 w-3" />
              {cat.label}
            </div>
          )}

          {/* Stock badge */}
          {isLowStock && (
            <div className="absolute right-3.5 top-3.5 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
              Ostatnie sztuki
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute right-3.5 top-3.5 rounded-full bg-gray-800/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
              Brak
            </div>
          )}

          {/* Arrow CTA */}
          <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h2 className="line-clamp-2 text-[0.95rem] font-semibold leading-snug text-gray-900" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            {name}
          </h2>

          {/* Stars */}
          {reviewsCount > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-3 w-3 ${s <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`} />
                ))}
              </div>
              <span className="text-xs text-gray-400">{averageRating.toFixed(1)} ({reviewsCount})</span>
            </div>
          )}

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between gap-2 border-t border-gray-50 pt-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">cena</p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
                  {price.toFixed(2)}<span className="ml-0.5 text-sm font-semibold text-gray-400"> zł</span>
                </p>
              </div>

              <span className={`rounded-xl px-4 py-2.5 text-[13px] font-bold text-white transition-colors duration-300 ${isOutOfStock ? "bg-gray-300" : "bg-[#0a0a0a] group-hover:bg-[#4caf3d]"}`}>
                {isOutOfStock ? "Niedostępny" : "Szczegóły"}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
