import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getStockStatus(stock: number) {
  if (stock <= 0) return "BRAK";
  if (stock <= 5) return "MALO_SZTUK";
  return "DOSTEPNY";
}

export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Nieprawidłowe ID produktu" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      price,
      description,
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
        { error: "Uzupełnij wszystkie pola" },
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

    const existingProductWithSlug = await prisma.product.findFirst({
      where: {
        slug,
        NOT: {
          id: productId,
        },
      },
    });

    if (existingProductWithSlug) {
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

    await prisma.productImage.deleteMany({
      where: {
        productId,
      },
    });

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        slug,
        price: Number(price),
        description,
        image,
        category,
        subcategory: null,
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Błąd aktualizacji produktu" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Nieprawidłowe ID produktu" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produkt nie istnieje" },
        { status: 404 }
      );
    }

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Produkt został ukryty",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Błąd ukrywania produktu" },
      { status: 500 }
    );
  }
}

export async function PATCH(_: Request, context: RouteContext) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Nieprawidłowe ID produktu" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produkt nie istnieje" },
        { status: 404 }
      );
    }

    const restoredProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Produkt został przywrócony",
      product: restoredProduct,
    });
  } catch (error) {
    console.error("PATCH PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Błąd przywracania produktu" },
      { status: 500 }
    );
  }
}