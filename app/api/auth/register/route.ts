import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

    if (String(password).length < 8) {
      return NextResponse.json(
        { error: "Hasło musi mieć co najmniej 8 znaków" },
        { status: 400 }
      );
    }

    // bcrypt uwzględnia tylko pierwsze 72 bajty hasła – dłuższe odrzucamy,
    // żeby nie tworzyć fałszywego poczucia bezpieczeństwa.
    if (String(password).length > 72) {
      return NextResponse.json(
        { error: "Hasło może mieć maksymalnie 72 znaki" },
        { status: 400 }
      );
    }

    if (String(fullName).trim().length > 120) {
      return NextResponse.json(
        { error: "Imię i nazwisko jest zbyt długie" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (
      normalizedEmail.length > 200 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)
    ) {
      return NextResponse.json(
        { error: "Podaj poprawny adres e-mail" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Użytkownik o takim emailu już istnieje" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: String(fullName).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        termsAcceptedAt: new Date(),
      },
    });

    return NextResponse.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Błąd rejestracji" },
      { status: 500 }
    );
  }
}