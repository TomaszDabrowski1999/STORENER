import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getOrderPackageSize,
  getShippingOptionsForSize,
  formatPackageSize,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/shipping";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/shipping/options?ids=1,2,3
// Zwraca wielkość paczki dla podanych produktów (największa z nich)
// oraz właściwy cennik dostaw. Checkout korzysta z tego endpointu,
// żeby ceny w UI zawsze zgadzały się z tym, co policzy serwer przy zamówieniu.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids") || "";

  const ids = idsParam
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);

  let packageSize = getOrderPackageSize([]);

  if (ids.length > 0) {
    try {
      const products = await prisma.product.findMany({
        where: { id: { in: ids } },
        select: { id: true, packageSize: true } as never,
      });
      packageSize = getOrderPackageSize(
        (products as Array<{ packageSize?: string | null }>).map(
          (product) => product.packageSize
        )
      );
    } catch (error) {
      // Gdyby kolumna packageSize nie była jeszcze w bazie (brak migracji),
      // nie wywracamy checkoutu – traktujemy zamówienie jak małą paczkę.
      console.error("SHIPPING OPTIONS FALLBACK:", error);
    }
  }

  return NextResponse.json({
    packageSize,
    packageSizeLabel: formatPackageSize(packageSize),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    options: getShippingOptionsForSize(packageSize),
  });
}
