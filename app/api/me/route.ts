import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { isValidEmail, normalizeEmail } from "@/lib/security";
import { hit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
      select: { id: true, fullName: true, email: true, role: true },
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
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json({ error: "Nieprawidłowa sesja" }, { status: 401 });
    }

    const ip = getClientIp(request);
    const limit = hit(`profile:${userId}:${ip}`, 10, 15 * 60 * 1000);

    if (!limit.ok) {
      return tooManyRequests(limit.retryAfterSeconds);
    }

    const body = await request.json().catch(() => null);
    const { fullName, email, currentPassword } = body || {};

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Uzupełnij wszystkie pola" },
        { status: 400 }
      );
    }

    const trimmedName = String(fullName).trim();

    if (trimmedName.length < 3 || trimmedName.length > 120) {
      return NextResponse.json(
        { error: "Imię i nazwisko musi mieć od 3 do 120 znaków" },
        { status: 400 }
      );
    }

    // E-mail normalizujemy tak samo jak przy rejestracji. Bez tego dałoby się
    // zapisać "JAN@x.pl" obok istniejącego "jan@x.pl" – baza traktuje je jako
    // różne (unikalność w Postgresie jest wrażliwa na wielkość liter),
    // a logowanie i reset hasła jako to samo konto.
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Podaj poprawny adres e-mail" },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, password: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Użytkownik nie istnieje" },
        { status: 404 }
      );
    }

    const isEmailChanging = normalizedEmail !== normalizeEmail(currentUser.email);

    // Zmiana adresu e-mail to zmiana loginu i celu linków resetujących hasło.
    // Jeśli ktoś przejmie niezablokowaną sesję, bez tego potwierdzenia mógłby
    // po cichu przepiąć konto na własny adres i odciąć właściciela.
    if (isEmailChanging) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Aby zmienić adres e-mail, podaj swoje obecne hasło" },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        String(currentPassword),
        currentUser.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Obecne hasło jest nieprawidłowe" },
          { status: 400 }
        );
      }

      const emailTaken = await prisma.user.findFirst({
        where: {
          email: { equals: normalizedEmail, mode: "insensitive" },
          NOT: { id: userId },
        },
        select: { id: true },
      });

      if (emailTaken) {
        return NextResponse.json(
          { error: "Ten email jest już zajęty" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: trimmedName,
        email: normalizedEmail,
      },
      select: { id: true, fullName: true, email: true },
    });

    // Zmiana loginu unieważnia stare linki resetu hasła wysłane na poprzedni adres.
    if (isEmailChanging) {
      await prisma.passwordResetToken.deleteMany({
        where: { email: normalizeEmail(currentUser.email) },
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Błąd aktualizacji profilu" },
      { status: 500 }
    );
  }
}
