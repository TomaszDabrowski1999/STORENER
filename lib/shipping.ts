// ===========================================================================
// KONFIGURACJA DOSTAW – kurierzy + 3 cenniki wg wielkości paczki
// ===========================================================================
// Jak to działa:
//  - każdy produkt ma przypisaną wielkość paczki (MALA / SREDNIA / DUZA),
//  - wielkość całego zamówienia = największa wielkość spośród produktów w koszyku,
//  - dla każdej wielkości obowiązuje osobny cennik (SHIPPING_PRICING poniżej),
//  - kurier nieobecny w cenniku danej wielkości jest dla niej NIEDOSTĘPNY
//    (np. Orlen Paczka nie przyjmie dużego gabarytu).
//
// Dodanie nowego kuriera = 1 wpis w COURIERS + ceny w SHIPPING_PRICING.
// Zmiana ceny = edycja jednej liczby w SHIPPING_PRICING.
// ===========================================================================

export type PackageSize = "MALA" | "SREDNIA" | "DUZA";

export type ShippingMethod =
  | "INPOST_PACZKOMAT"
  | "INPOST_KURIER"
  | "DPD"
  | "DHL"
  | "ORLEN_PACZKA"
  | "ODBIOR_OSOBISTY";

export const PACKAGE_SIZES: PackageSize[] = ["MALA", "SREDNIA", "DUZA"];

export const PACKAGE_SIZE_LABELS: Record<PackageSize, string> = {
  MALA: "Mała paczka",
  SREDNIA: "Średnia paczka",
  DUZA: "Duża paczka",
};

// Wymiary i waga przekazywane do Furgonetki przy tworzeniu przesyłki
// (cm / kg – odpowiadają gabarytom A / B / C InPost, mieszczą się też
// w limitach DPD, DHL i Orlen Paczki dla danej wielkości).
export const PACKAGE_DIMENSIONS: Record<
  PackageSize,
  { length: number; width: number; height: number; weight: number }
> = {
  MALA: { length: 64, width: 38, height: 8, weight: 5 },
  SREDNIA: { length: 64, width: 38, height: 19, weight: 15 },
  DUZA: { length: 64, width: 38, height: 41, weight: 25 },
};

export type Courier = {
  id: ShippingMethod;
  name: string;
  description: string;
  estimatedDelivery: string;
  requiresPoint: boolean;
  // Nazwa usługi po stronie Furgonetki (ułatwia mapowanie w panelu Furgonetki).
  furgonetkaService: string | null;
};

export const COURIERS: Courier[] = [
  {
    id: "INPOST_PACZKOMAT",
    name: "InPost Paczkomat",
    description: "Dostawa do wybranego paczkomatu.",
    estimatedDelivery: "1-2 dni robocze",
    requiresPoint: true,
    furgonetkaService: "inpost",
  },
  {
    id: "ORLEN_PACZKA",
    name: "ORLEN Paczka",
    description: "Odbiór w punkcie ORLEN Paczka.",
    estimatedDelivery: "2-3 dni robocze",
    requiresPoint: true,
    furgonetkaService: "orlen",
  },
  {
    id: "INPOST_KURIER",
    name: "InPost Kurier",
    description: "Dostawa kurierem pod wskazany adres.",
    estimatedDelivery: "1-2 dni robocze",
    requiresPoint: false,
    furgonetkaService: "inpostkurier",
  },
  {
    id: "DPD",
    name: "DPD Kurier",
    description: "Dostawa kurierem DPD pod wskazany adres.",
    estimatedDelivery: "1-2 dni robocze",
    requiresPoint: false,
    furgonetkaService: "dpd",
  },
  {
    id: "DHL",
    name: "DHL Kurier",
    description: "Dostawa kurierem DHL pod wskazany adres.",
    estimatedDelivery: "1-2 dni robocze",
    requiresPoint: false,
    furgonetkaService: "dhl",
  },
  {
    id: "ODBIOR_OSOBISTY",
    name: "Odbiór osobisty",
    description: "Odbiór zamówienia bez kosztu dostawy.",
    estimatedDelivery: "Po przygotowaniu zamówienia",
    requiresPoint: false,
    furgonetkaService: null,
  },
];

// ===========================================================================
// 3 CENNIKI – ceny w zł. Brak kuriera w cenniku = kurier niedostępny
// dla tej wielkości paczki. Odbiór osobisty jest zawsze darmowy.
// ===========================================================================
export const SHIPPING_PRICING: Record<
  PackageSize,
  Partial<Record<ShippingMethod, number>>
> = {
  // CENNIK 1 – mała paczka (gabaryt A)
  MALA: {
    ORLEN_PACZKA: 11.99,
    INPOST_PACZKOMAT: 13.99,
    INPOST_KURIER: 15.99,
    DPD: 16.99,
    ODBIOR_OSOBISTY: 0,
  },
  // CENNIK 2 – średnia paczka (gabaryt B)
  SREDNIA: {
    INPOST_PACZKOMAT: 16.99,
    INPOST_KURIER: 18.99,
    DPD: 19.99,
    DHL: 21.99,
    ODBIOR_OSOBISTY: 0,
  },
  // CENNIK 3 – duża paczka (gabaryt C)
  DUZA: {
    INPOST_KURIER: 24.99,
    DPD: 26.99,
    DHL: 29.99,
    ODBIOR_OSOBISTY: 0,
  },
};

// Próg darmowej dostawy – jedna stała dla całego sklepu
// (navbar, koszyk, checkout i API zamówień korzystają z tej samej wartości).
export const FREE_SHIPPING_THRESHOLD = 1000;

// ===========================================================================
// Typy i helpery
// ===========================================================================

export type ShippingOption = {
  id: ShippingMethod;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
  requiresPoint: boolean;
  packageSize: PackageSize;
};

const SIZE_ORDER: Record<PackageSize, number> = { MALA: 0, SREDNIA: 1, DUZA: 2 };

// Bezpieczna normalizacja wartości z bazy / requestu do PackageSize.
export function normalizePackageSize(value: unknown): PackageSize {
  return value === "SREDNIA" || value === "DUZA" ? value : "MALA";
}

// Wielkość paczki dla całego zamówienia = największa wielkość produktu.
export function getOrderPackageSize(
  sizes: Array<string | null | undefined>
): PackageSize {
  let result: PackageSize = "MALA";
  for (const raw of sizes) {
    const size = normalizePackageSize(raw);
    if (SIZE_ORDER[size] > SIZE_ORDER[result]) result = size;
  }
  return result;
}

export function getCourier(method: string | null | undefined) {
  return COURIERS.find((courier) => courier.id === method);
}

// Lista opcji dostawy dostępnych dla danej wielkości paczki (jeden z 3 cenników).
export function getShippingOptionsForSize(size: PackageSize): ShippingOption[] {
  const pricing = SHIPPING_PRICING[size];

  return COURIERS.filter((courier) => pricing[courier.id] !== undefined).map(
    (courier) => ({
      id: courier.id,
      name: courier.name,
      description: courier.description,
      price: pricing[courier.id] as number,
      estimatedDelivery: courier.estimatedDelivery,
      requiresPoint: courier.requiresPoint,
      packageSize: size,
    })
  );
}

// Pojedyncza opcja dostawy dla metody + wielkości paczki.
// Zwraca undefined, gdy kurier nie obsługuje tej wielkości.
export function getShippingOption(
  method: string | null | undefined,
  size: PackageSize = "MALA"
): ShippingOption | undefined {
  return getShippingOptionsForSize(size).find((option) => option.id === method);
}

export function isMethodAvailableForSize(
  method: string | null | undefined,
  size: PackageSize
) {
  return getShippingOption(method, size) !== undefined;
}

// Zwraca rzeczywisty koszt dostawy z uwzględnieniem darmowej dostawy od progu.
export function computeShippingPrice(
  subtotal: number,
  option: Pick<ShippingOption, "price"> | null | undefined
) {
  if (!option) return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return option.price;
}

export function formatShippingMethod(method: string | null | undefined) {
  return getCourier(method)?.name || method || "Nie wybrano";
}

export function formatPackageSize(size: string | null | undefined) {
  return PACKAGE_SIZE_LABELS[normalizePackageSize(size)];
}

// Wszystkie ID metod dostawy (np. dla walidatora Zod).
export const SHIPPING_METHOD_IDS = COURIERS.map((courier) => courier.id) as [
  ShippingMethod,
  ...ShippingMethod[]
];
