import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";
import bcrypt from "bcryptjs";

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
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Uzupełnij wszystkie pola" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Nowe hasło musi mieć co najmniej 6 znaków" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Nowe hasła nie są takie same" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(session.user.id),
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Użytkownik nie istnieje" },
        { status: 404 }
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Obecne hasło jest nieprawidłowe" },
        { status: 400 }
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: Number(session.user.id),
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd zmiany hasła" },
      { status: 500 }
    );
  }
}