import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET() {
  return NextResponse.json(
    { error: "Opinie nie są publicznie wyświetlane" },
    { status: 403 }
  );
}


export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Musisz być zalogowany, aby dodać opinię" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Nieprawidłowe ID produktu" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { rating, title, comment } = body;

    const numericRating = Number(rating);

    if (
      Number.isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5 ||
      !title ||
      !comment
    ) {
      return NextResponse.json(
        { error: "Uzupełnij poprawnie wszystkie pola opinii" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Nie znaleziono użytkownika" },
        { status: 404 }
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

    const review = await prisma.productReview.create({
      data: {
        rating: numericRating,
        title,
        comment,
        userId: user.id,
        productId,
      },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    return NextResponse.json(
      { error: "Nie udało się dodać opinii" },
      { status: 500 }
    );
  }
}