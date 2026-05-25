export type ShippingMethod =
  | "INPOST_PACZKOMAT"
  | "INPOST_KURIER"
  | "DPD"
  | "DHL"
  | "ORLEN_PACZKA"
  | "ODBIOR_OSOBISTY";

export type ShippingOption = {
  id: ShippingMethod;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
  requiresPoint: boolean;
};

export const shippingOptions: ShippingOption[] = [
  {
    id: "INPOST_PACZKOMAT",
    name: "InPost Paczkomat",
    description: "Dostawa do wybranego paczkomatu.",
    price: 14.99,
    estimatedDelivery: "1-2 dni robocze",
    requiresPoint: true,
  },
  {
    id: "INPOST_KURIER",
    name: "InPost Kurier",
    description: "Dostawa kurierem pod wskazany adres.",
    price: 16.99,
    estimatedDelivery: "1-2 dni robocze",
    requiresPoint: false,
  },
  {
    id: "DPD",
    name: "DPD Kurier",
    description: "Dostawa kurierem DPD pod wskazany adres.",
    price: 17.99,
    estimatedDelivery: "1-2 dni robocze",
    requiresPoint: false,
  },
  {
    id: "DHL",
    name: "DHL Kurier",
    description: "Dostawa kurierem DHL pod wskazany adres.",
    price: 19.99,
    estimatedDelivery: "1-2 dni robocze",
    requiresPoint: false,
  },
  {
    id: "ORLEN_PACZKA",
    name: "ORLEN Paczka",
    description: "Odbiór w punkcie ORLEN Paczka.",
    price: 12.99,
    estimatedDelivery: "2-3 dni robocze",
    requiresPoint: true,
  },
  {
    id: "ODBIOR_OSOBISTY",
    name: "Odbiór osobisty",
    description: "Odbiór zamówienia bez kosztu dostawy.",
    price: 0,
    estimatedDelivery: "Po przygotowaniu zamówienia",
    requiresPoint: false,
  },
];

export function getShippingOption(method: string | null | undefined) {
  return shippingOptions.find((option) => option.id === method);
}

export function formatShippingMethod(method: string | null | undefined) {
  return getShippingOption(method)?.name || method || "Nie wybrano";
}
