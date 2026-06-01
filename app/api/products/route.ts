import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductWhere = Record<string, any>;

function buildBaseWhere(search: string, minPrice: string, maxPrice: string) {
  const where: ProductWhere = {
    isActive: true,
    AND: [],
  };

  if (search.trim()) {
    where.AND.push({
      OR: [
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
      ],
    });
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

  return where;
}

function cleanupWhere(where: ProductWhere) {
  if (Array.isArray(where.AND) && where.AND.length === 0) {
    delete where.AND;
  }

  return where;
}

function buildWhere(params: {
  search: string;
  category: string;
  subcategory: string;
  minPrice: string;
  maxPrice: string;
  includeNewDomOgrodValues: boolean;
}) {
  const { search, category, subcategory, minPrice, maxPrice, includeNewDomOgrodValues } = params;
  const where = buildBaseWhere(search, minPrice, maxPrice);

  if (category === "DOM") {
    where.AND.push({
      OR: [
        ...(includeNewDomOgrodValues ? [{ category: "DOM" }] : []),
        { category: "DOM_I_OGROD", subcategory: "WYPOSAZENIE" },
        { category: "DOM_I_OGROD", subcategory: null },
      ],
    });
  } else if (category === "OGROD") {
    where.AND.push({
      OR: [
        ...(includeNewDomOgrodValues ? [{ category: "OGROD" }] : []),
        { category: "DOM_I_OGROD", subcategory: "OGROD" },
      ],
    });
  } else if (category) {
    where.category = category;
  }

  if (subcategory) {
    where.subcategory = subcategory;
  }

  return cleanupWhere(where);
}

function getOrderBy(sort: string) {
  if (sort === "price_asc") return { price: "asc" };
  if (sort === "price_desc") return { price: "desc" };
  if (sort === "name_asc") return { name: "asc" };
  if (sort === "name_desc") return { name: "desc" };
  return { id: "desc" };
}

async function findProducts(where: ProductWhere, orderBy: any) {
  return prisma.product.findMany({
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
}