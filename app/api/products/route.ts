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
    const subcategory = searchParams.get("subcategory") || "";
    const sort = searchParams.get("sort") || "newest";

    let orderBy:
      | { id: "asc" | "desc" }
      | { price: "asc" | "desc" }
      | { name: "asc" | "desc" } = { id: "desc" };

    if (sort === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { price: "desc" };
    } else if (sort === "name_asc") {
      orderBy = { name: "asc" };
    } else if (sort === "name_desc") {
      orderBy = { name: "desc" };
    } else {
      orderBy = { id: "desc" };
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        name: {
          contains: search,
        },
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        ...(category ? { category: category as any } : {}),
        ...(subcategory ? { subcategory: subcategory as any } : {}),
      },
      orderBy,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    const normalizedProducts = products.map((product: { reviews: any[] }) => {
      const reviewsCount = product.reviews.length;
      const averageRating =
        reviewsCount > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviewsCount
          : 0;

      return {
        ...product,
        averageRating,
        reviewsCount,
      };
    });

    return NextResponse.json(normalizedProducts);
  } catch (error) {
    console.error("PRODUCTS GET ERROR:", error);

    return NextResponse.json(
      { error: "Błąd serwera przy pobieraniu produktów" },
      { status: 500 }
    );
  }
}