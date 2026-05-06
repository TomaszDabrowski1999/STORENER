import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function getStockStatus(stock: number) {
  if (stock <= 0) return "BRAK";
  if (stock <= 5) return "MALO_SZTUK";
  return "DOSTEPNY";
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Nie udało się pobrać produktów admina" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      price,
      description,
      productDetails,
      image,
      category,
      subcategory,
      galleryImages,
      stock,
    } = body;

    if (
      !name ||
      !slug ||
      price === undefined ||
      !description ||
      !image ||
      !category ||
      stock === undefined
    ) {
      return NextResponse.json(
        { error: "Uzupełnij wszystkie wymagane pola" },
        { status: 400 }
      );
    }

    if (category === "DOM_I_OGROD" && !subcategory) {
      return NextResponse.json(
        { error: "Dla kategorii Dom i ogród wybierz podkategorię" },
        { status: 400 }
      );
    }

    const stockValue = Number(stock);

    if (Number.isNaN(stockValue) || stockValue < 0) {
      return NextResponse.json(
        { error: "Stan magazynowy musi być liczbą 0 lub większą" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Produkt z takim slugiem już istnieje" },
        { status: 400 }
      );
    }

    const validGalleryImages = Array.isArray(galleryImages)
      ? galleryImages
          .filter((url: string) => typeof url === "string" && url.trim() !== "")
          .slice(0, 12)
      : [];

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: Number(price),
        description,
        productDetails: productDetails || "",
        image,
        isActive: true,
        category,
        subcategory: category === "DOM_I_OGROD" ? subcategory : null,
        stock: stockValue,
        stockStatus: getStockStatus(stockValue),
        images: {
          create: validGalleryImages.map((url: string, index: number) => ({
            url,
            position: index,
          })),
        },
      },
      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd dodawania produktu" },
      { status: 500 }
    );
  }
}