import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

// ===========================================================================
// CONTENT SECURITY POLICY
// ===========================================================================
// Najważniejszy nagłówek bezpieczeństwa dla sklepu. Nawet jeśli gdzieś
// przedostanie się XSS, CSP nie pozwoli wykonać skryptu z obcej domeny
// ani wysłać wykradzionych danych na serwer atakującego.
//
// 'unsafe-inline' w script-src jest niestety wymagane przez Next.js
// (skrypty hydracji). Docelowo można to zastąpić nonce'ami generowanymi
// w middleware – to jednak wymaga zmiany renderowania wszystkich stron.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  // Obrazy: własna domena, Cloudinary, Unsplash (produkty z seeda).
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
  // Dokąd strona może wysyłać żądania (fetch/XHR).
  "connect-src 'self' https://api.cloudinary.com",
  // Bramka Przelewy24 otwierana jest przez przekierowanie, nie w ramce.
  "frame-src 'self' https://secure.przelewy24.pl https://sandbox.przelewy24.pl",
  // Nikt nie może osadzić sklepu w swojej ramce (clickjacking).
  "frame-ancestors 'none'",
  // Formularze mogą wysyłać dane wyłącznie na własny serwer.
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Blokuje osadzanie sklepu w iframe (clickjacking) – dla starszych przeglądarek.
  { key: "X-Frame-Options", value: "DENY" },
  // Przeglądarka nie zgaduje typów MIME.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Nie wysyłamy pełnych adresów (np. z tokenami resetu hasła) do obcych domen.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Wyłączamy niepotrzebne API przeglądarki.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Izolacja od innych witryn otwartych w tej samej przeglądarce.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

// HSTS wymusza HTTPS przez 2 lata. Włączamy TYLKO na produkcji –
// na localhoście zablokowałoby to pracę po http://.
if (isProduction) {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  });
}

const nextConfig: NextConfig = {
  // Ukrywa nagłówek "X-Powered-By: Next.js" – nie ułatwiamy
  // dopasowania gotowego exploita do wersji frameworka.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Panel administratora i API nigdy nie powinny trafiać
        // do cache przeglądarki ani CDN-a.
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // obrazy przykładowych produktów z prisma/seed.ts
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
