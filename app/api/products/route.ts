import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 999999999);
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

    let orderBy: any = { id: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    else if (sort === "price_desc") orderBy = { price: "desc" };
    else if (sort === "name_asc") orderBy = { name: "asc" };
    else if (sort === "name_desc") orderBy = { name: "desc" };

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
        price: { gte: minPrice, lte: maxPrice },
        ...(category ? { category: category as any } : {}),
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
      const { reviews, images, ...rest } = p;
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