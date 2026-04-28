import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Podaj email" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Jeśli konto istnieje, link resetujący został wysłany.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.passwordResetToken.create({
      data: {
        token,
        email,
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
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
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return NextResponse.json(
        { error: "Nie udało się wysłać maila resetującego" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Link resetujący został wysłany na email.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      { error: "Błąd resetu hasła" },
      { status: 500 }
    );
  }
}