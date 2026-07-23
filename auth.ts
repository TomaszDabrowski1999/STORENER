import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";
import { normalizeEmail, DUMMY_PASSWORD_HASH } from "./lib/security";
import { hit, reset, getClientIp } from "./lib/rate-limit";

// Sesja 7 dni zamiast 30. Skradziony token (np. z cudzego komputera
// albo przez XSS) traci ważność wielokrotnie szybciej.
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

// Co ile sekund odświeżamy rolę i istnienie konta z bazy.
// Bez tego użytkownik, któremu odebrano ADMIN-a (albo usunięto konto),
// zachowywałby uprawnienia aż do wygaśnięcia tokenu.
const ROLE_REFRESH_SECONDS = 15 * 60;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },

  jwt: {
    maxAge: SESSION_MAX_AGE,
  },

  // Ciasteczka sesji: niedostępne dla JavaScriptu (httpOnly), wysyłane
  // tylko po HTTPS na produkcji, sameSite=lax blokuje podstawowe CSRF.
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
      },

      async authorize(credentials, request) {
        const email = normalizeEmail(credentials?.email);
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        // ── Limit prób logowania ────────────────────────────────────────
        // Dwa niezależne liczniki: po IP (jeden atakujący próbujący wielu
        // kont) i po adresie e-mail (rozproszony atak na jedno konto).
        const ip = request instanceof Request ? getClientIp(request) : "unknown";

        const ipLimit = hit(`login:ip:${ip}`, 10, 10 * 60 * 1000);
        const emailLimit = hit(`login:email:${email}`, 5, 15 * 60 * 1000);

        if (!ipLimit.ok || !emailLimit.ok) {
          console.warn("AUTH: przekroczony limit prób logowania", { ip });
          return null;
        }

        // ── Wyszukanie konta ────────────────────────────────────────────
        // Wszystkie e-maile zapisujemy małymi literami, więc wystarczy
        // jedno zapytanie. Zapasowo szukamy też bez rozróżniania wielkości
        // liter – dla kont założonych przed normalizacją.
        const user =
          (await prisma.user.findUnique({ where: { email } })) ||
          (await prisma.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" } },
          }));

        // Gdy konta nie ma, i tak wykonujemy bcrypt.compare na atrapie.
        // Dzięki temu odpowiedź trwa tyle samo co przy istniejącym koncie
        // i nie da się wywnioskować, które adresy są zarejestrowane.
        const passwordHash = user?.password || DUMMY_PASSWORD_HASH;
        const isValid = await bcrypt.compare(password, passwordHash);

        if (!user || !isValid) return null;

        // Udane logowanie – zerujemy licznik dla tego konta.
        reset(`login:email:${email}`);

        return {
          id: String(user.id),
          name: user.fullName,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.checkedAt = Math.floor(Date.now() / 1000);
        return token;
      }

      // Okresowa weryfikacja w bazie: czy konto nadal istnieje i czy rola
      // się nie zmieniła. Token sam z siebie nigdy się nie "dowie", że
      // administratorowi odebrano uprawnienia.
      const now = Math.floor(Date.now() / 1000);
      const checkedAt = Number(token.checkedAt ?? 0);

      if (trigger === "update" || now - checkedAt > ROLE_REFRESH_SECONDS) {
        const userId = Number(token.id);

        if (!Number.isInteger(userId)) return null;

        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true },
        });

        // Konto usunięte → unieważniamy sesję.
        if (!dbUser) return null;

        token.role = dbUser.role;
        token.checkedAt = now;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = String(token.role ?? "USER");
      }

      return session;
    },
  },

  pages: {
    signIn: "/logowanie",
  },
});
