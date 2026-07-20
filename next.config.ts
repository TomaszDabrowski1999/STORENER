import type { NextConfig } from "next";

const securityHeaders = [
  // Blokuje osadzanie sklepu w iframe (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Przeglądarka nie zgaduje typów MIME.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Nie wysyłamy pełnych adresów (np. z tokenami resetu hasła) do obcych domen.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Wyłączamy niepotrzebne API przeglądarki.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
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