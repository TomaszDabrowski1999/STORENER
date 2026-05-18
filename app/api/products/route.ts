import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "newest";

  const where: any = {
    isActive: true,
  };

  if (search.trim()) {
    where.OR = [
      {
        name: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search.trim(),
          mode: "insensitive",
        },
      },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (subcategory) {
    where.subcategory = subcategory;
  }

  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.price.lte = Number(maxPrice);
    }
  }

  let orderBy: any = {
    id: "desc",
  };

  if (sort === "price_asc") {
    orderBy = { price: "asc" };
  }

  if (sort === "price_desc") {
    orderBy = { price: "desc" };
  }

  if (sort === "name_asc") {
    orderBy = { name: "asc" };
  }

  if (sort === "name_desc") {
    orderBy = { name: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  const mappedProducts = products.map((product) => {
    const reviewsCount = product.reviews.length;

    const averageRating =
      reviewsCount > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewsCount
        : 0;

    const { reviews, ...productWithoutReviews } = product;

    return {
      ...productWithoutReviews,
      averageRating,
      reviewsCount,
    };
  });

  return NextResponse.json(mappedProducts);
}