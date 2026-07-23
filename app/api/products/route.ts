import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ProductCategory } from "@/generated/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parametry z URL-a są w pełni kontrolowane przez użytkownika.
    // Number("abc") daje NaN, co przy Prismie kończy się błędem 500 –
    // dlatego każdą wartość sprowadzamy do bezpiecznego zakresu.
    const toPrice = (value: string | null, fallback: number) => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < 0) return fallback;
      return Math.min(parsed, 1_000_000_000);
    };

    // Ograniczenie długości frazy: bardzo długie zapytania LIKE potrafią
    // mocno obciążyć bazę (prosty wektor DoS).
    const search = (searchParams.get("search") || "").trim().slice(0, 100);
    const minPrice = toPrice(searchParams.get("minPrice"), 0);
    const maxPrice = toPrice(searchParams.get("maxPrice"), 1_000_000_000);
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

    // Kategoria musi być jedną ze znanych wartości enuma, inaczej Prisma
    // rzuca wyjątkiem na losowym ciągu z URL-a.
    const ALLOWED_CATEGORIES = [
      "NOWOSCI", "WYPRZEDAZ", "DOM_I_OGROD", "DOM",
      "MOTORYZACJA", "AKCESORIA_DLA_ZWIERZAT", "OGROD", "WYPOSAZENIE",
    ];
    const safeCategory = ALLOWED_CATEGORIES.includes(category) ? category : "";

    // Sortowanie tylko po znanych wartościach – parametr "sort" pochodzi
    // z URL-a, więc nie może trafić do zapytania bez sprawdzenia.
    const SORT_OPTIONS = {
      newest: { id: "desc" },
      price_asc: { price: "asc" },
      price_desc: { price: "desc" },
      name_asc: { name: "asc" },
      name_desc: { name: "desc" },
    } as const;

    const orderBy =
      SORT_OPTIONS[sort as keyof typeof SORT_OPTIONS] ?? SORT_OPTIONS.newest;

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
        price: { gte: Math.min(minPrice, maxPrice), lte: Math.max(minPrice, maxPrice) },
        ...(safeCategory
          ? { category: safeCategory as ProductCategory }
          : {}),
      },
      orderBy,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
      },
    });

    const enriched = products.map((p) => {
      const count = p.reviews.length;
      const avg = count > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / count
        : 0;
      // Surowe listy opinii i zdjęć nie są potrzebne na liście produktów –
      // zwracamy tylko wyliczoną średnią ocen i liczbę opinii.
      const { reviews: _reviews, images: _images, ...rest } = p;
      void _reviews;
      void _images;

      return {
        ...rest,
        averageRating: Math.round(avg * 10) / 10,
        reviewsCount: count,
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("PRODUCTS GET ERROR:", error);
    return NextResponse.json(
      { error: "Błąd serwera przy pobieraniu produktów" },
      { status: 500 }
    );
  }
}