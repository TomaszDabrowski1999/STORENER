import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// ===========================================================================
// MIDDLEWARE – OCHRONA TRAS NA POZIOMIE SERWERA
// ===========================================================================
// Do tej pory panel administratora chroniony był WYŁĄCZNIE komponentem
// <AdminGuard> po stronie przeglądarki. To zabezpieczenie kosmetyczne:
// wystarczyło wyłączyć JavaScript albo podmienić stan w React DevTools,
// żeby zobaczyć interfejs panelu.
//
// Middleware działa przed wyrenderowaniem czegokolwiek – żądanie bez
// poprawnego, podpisanego tokenu sesji nigdy nie dociera do strony.
// AdminGuard zostaje jako druga warstwa (UX + ochrona przed migotaniem),
// a API dodatkowo sprawdza rolę przez requireAdmin().
// ===========================================================================

const ADMIN_PREFIXES = ["/admin", "/api/admin"];

const USER_PREFIXES = ["/konto", "/moje-zamowienia", "/zamowienia", "/api/me", "/api/my-orders"];

function isProtected(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const needsAdmin = isProtected(pathname, ADMIN_PREFIXES);
  const needsUser = isProtected(pathname, USER_PREFIXES);

  if (!needsAdmin && !needsUser) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

  // Bez sekretu nie da się zweryfikować żadnego tokenu – bezpieczniej
  // zablokować dostęp niż wpuścić kogokolwiek.
  if (!secret) {
    console.error("MIDDLEWARE: brak NEXTAUTH_SECRET / AUTH_SECRET");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const useSecureCookie = request.nextUrl.protocol === "https:";
  const cookieName = useSecureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token = await getToken({
    req: request,
    secret,
    salt: cookieName,
    cookieName,
    secureCookie: useSecureCookie,
  });

  const isApi = pathname.startsWith("/api/");

  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const loginUrl = new URL("/logowanie", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (needsAdmin && token.role !== "ADMIN") {
    if (isApi) {
      return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
    }

    // Zalogowany, ale bez uprawnień – nie zdradzamy, że panel istnieje.
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/konto/:path*",
    "/moje-zamowienia/:path*",
    "/zamowienia/:path*",
    "/api/me/:path*",
    "/api/my-orders/:path*",
  ],
};
