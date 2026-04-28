import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Brak autoryzacji" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(session.user.id),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Użytkownik nie istnieje" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd pobierania profilu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Brak autoryzacji" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, email } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Uzupełnij wszystkie pola" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: Number(session.user.id),
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ten email jest już zajęty" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(session.user.id),
      },
      data: {
        fullName,
        email,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd aktualizacji profilu" },
      { status: 500 }
    );
  }
}