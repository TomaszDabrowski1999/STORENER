import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Lista produktów zmienia się na bieżąco – sitemapa jest generowana na żądanie,
// a nie zamrażana w czasie builda (build nie wymaga wtedy połączenia z bazą).
export const dynamic = "force-dynamic";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/produkty`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/dostawa`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/platnosci`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/zwroty`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/reklamacje`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/kontakt`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/regulamin`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/polityka-prywatnosci`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/polityka-cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
    });

    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${BASE_URL}/produkty/${p.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...productPages];
  } catch {
    // Gdy baza jest niedostępna (np. build bez połączenia) – zwróć chociaż strony statyczne.
    return staticPages;
  }
}
