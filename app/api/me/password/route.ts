import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { BCRYPT_ROUNDS, validatePassword } from "@/lib/security";
import { hit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json({ error: "Nieprawidłowa sesja" }, { status: 401 });
    }

    // Limit zgadywania obecnego hasła – istotne, gdy ktoś dorwał się
    // do niezablokowanego komputera z aktywną sesją.
    const ip = getClientIp(request);
    const limit = hit(`change-password:${userId}:${ip}`, 5, 15 * 60 * 1000);

    if (!limit.ok) {
      return tooManyRequests(limit.retryAfterSeconds);
    }

    const body = await request.json().catch(() => null);
    const { currentPassword, newPassword, confirmPassword } = body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Uzupełnij wszystkie pola" },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(newPassword);

    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Nowe hasła nie są takie same" },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "Nowe hasło musi różnić się od obecnego" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json(
        { error: "Użytkownik nie istnieje" },
        { status: 404 }
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      String(currentPassword),
      user.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Obecne hasło jest nieprawidłowe" },
        { status: 400 }
      );
    }

    const hashedNewPassword = await bcrypt.hash(
      String(newPassword),
      BCRYPT_ROUNDS
    );

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      }),
      // Zmiana hasła unieważnia wszystkie oczekujące linki resetujące.
      prisma.passwordResetToken.deleteMany({ where: { email: user.email } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Błąd zmiany hasła" }, { status: 500 });
  }
}
