import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { BCRYPT_ROUNDS, hashResetToken, validatePassword } from "@/lib/security";
import { hit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // Bez limitu można by zgadywać tokeny resetu metodą siłową.
  const limit = hit(`reset:${ip}`, 10, 15 * 60 * 1000);

  if (!limit.ok) {
    return tooManyRequests(limit.retryAfterSeconds);
  }

  try {
    const body = await request.json().catch(() => null);
    const { token, password, confirmPassword } = body || {};

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Uzupełnij wszystkie pola" },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Hasła nie są takie same" },
        { status: 400 }
      );
    }

    // W bazie leży hash tokenu, więc szukamy po hashu wartości z linku.
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashResetToken(String(token)) },
    });

    // Ten sam komunikat dla nieistniejącego i wygasłego tokenu –
    // nie podpowiadamy atakującemu, czy trafił w istniejący token.
    if (!resetToken || resetToken.expiresAt < new Date()) {
      if (resetToken) {
        await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      }

      return NextResponse.json(
        { error: "Link resetujący jest nieprawidłowy lub wygasł. Poproś o nowy." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(String(password), BCRYPT_ROUNDS);

    // Zmiana hasła i unieważnienie tokenów w jednej transakcji – żeby nie
    // dało się użyć tego samego linku dwa razy przy równoległych żądaniach.
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword },
      }),
      // Po udanym resecie unieważniamy WSZYSTKIE tokeny tego adresu,
      // nie tylko użyty – starsze linki z maili nie mogą dalej działać.
      prisma.passwordResetToken.deleteMany({
        where: { email: resetToken.email },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Hasło zostało zmienione",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return NextResponse.json({ error: "Błąd zmiany hasła" }, { status: 500 });
  }
}
