import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  BCRYPT_ROUNDS,
  isValidEmail,
  normalizeEmail,
  validatePassword,
} from "@/lib/security";
import { hit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  // Limit: 5 rejestracji z jednego IP na godzinę. Blokuje masowe zakładanie
  // kont (spam opiniami, zapychanie bazy, testowanie wykradzionych e-maili).
  const ip = getClientIp(request);
  const limit = hit(`register:${ip}`, 5, 60 * 60 * 1000);

  if (!limit.ok) {
    return tooManyRequests(
      limit.retryAfterSeconds,
      "Zbyt wiele prób rejestracji z tego adresu. Spróbuj ponownie później."
    );
  }

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
    }

    const { fullName, email, password, acceptedTerms } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Uzupełnij wszystkie pola" },
        { status: 400 }
      );
    }

    // Nie ufamy samemu frontowi – wymóg akceptacji regulaminu musi być
    // wymuszony też po stronie serwera.
    if (acceptedTerms !== true) {
      return NextResponse.json(
        { error: "Musisz zaakceptować regulamin sklepu" },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const trimmedName = String(fullName).trim();

    if (trimmedName.length < 3 || trimmedName.length > 120) {
      return NextResponse.json(
        { error: "Imię i nazwisko musi mieć od 3 do 120 znaków" },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Podaj poprawny adres e-mail" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Użytkownik o takim emailu już istnieje" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(String(password), BCRYPT_ROUNDS);

    // Pola wypisane jawnie – żaden dodatkowy klucz z body (np. "role":"ADMIN")
    // nie ma szansy trafić do bazy.
    const user = await prisma.user.create({
      data: {
        fullName: trimmedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: "USER",
        termsAcceptedAt: new Date(),
      },
      select: { id: true, fullName: true, email: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json({ error: "Błąd rejestracji" }, { status: 500 });
  }
}
