import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import {
  generateResetToken,
  hashResetToken,
  isValidEmail,
  normalizeEmail,
} from "@/lib/security";
import { hit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

// Zawsze ta sama odpowiedź, niezależnie od tego, czy konto istnieje.
// Inaczej formularz "nie pamiętam hasła" staje się wyszukiwarką
// zarejestrowanych adresów e-mail.
const GENERIC_RESPONSE = {
  success: true,
  message: "Jeśli konto istnieje, link resetujący został wysłany na podany adres.",
};

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 5 prób na 15 minut z jednego IP – reset hasła wysyła maile,
  // więc bez limitu jest to gotowe narzędzie do spamowania cudzych skrzynek.
  const ipLimit = hit(`forgot:ip:${ip}`, 5, 15 * 60 * 1000);

  if (!ipLimit.ok) {
    return tooManyRequests(ipLimit.retryAfterSeconds);
  }

  try {
    const body = await request.json().catch(() => null);
    const email = normalizeEmail(body?.email);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Podaj poprawny adres e-mail" },
        { status: 400 }
      );
    }

    // Drugi licznik – na konkretny adres. Chroni jedną skrzynkę
    // przed zalewem maili z wielu adresów IP.
    const emailLimit = hit(`forgot:email:${email}`, 3, 60 * 60 * 1000);

    if (!emailLimit.ok) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(GENERIC_RESPONSE);
    }

    // Token trafia do maila w postaci jawnej, ale do bazy TYLKO jako hash.
    // Wyciek tabeli PasswordResetToken nie pozwala więc przejąć żadnego konta.
    const token = generateResetToken();
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    // Poprzednie tokeny dla tego adresu unieważniamy – aktywny powinien być
    // zawsze tylko najnowszy link resetujący.
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    await prisma.passwordResetToken.create({
      data: { token: tokenHash, email, expiresAt },
    });

    const baseUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000"
    ).replace(/\/$/, "");

    const resetUrl = `${baseUrl}/reset-hasla/${token}`;

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Sklep <onboarding@resend.dev>",
      to: email,
      subject: "Reset hasła - sklep",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Reset hasła</h2>
          <p>Otrzymaliśmy prośbę o zmianę hasła do Twojego konta.</p>
          <p>Kliknij poniższy link, aby ustawić nowe hasło:</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
              Ustaw nowe hasło
            </a>
          </p>
          <p>Jeśli przycisk nie działa, skopiuj ten adres:</p>
          <p>${resetUrl}</p>
          <p>Link wygaśnie za 30 minut.</p>
          <p style="color:#666;font-size:13px;">
            Jeśli to nie Ty prosiłeś o zmianę hasła, zignoruj tę wiadomość –
            Twoje hasło pozostanie bez zmian.
          </p>
        </div>
      `,
    });

    if (error) {
      // Błąd logujemy u siebie, ale na zewnątrz nadal ta sama odpowiedź –
      // treść błędu nie może zdradzać, czy adres istnieje w bazie.
      console.error("RESEND ERROR:", error);
    }

    return NextResponse.json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json({ error: "Błąd resetu hasła" }, { status: 500 });
  }
}
