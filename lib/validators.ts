import { z } from "zod";
import { shippingOptions } from "./shipping";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, "Imię i nazwisko musi mieć co najmniej 3 znaki"),
  email: z
    .string()
    .email("Podaj poprawny adres email"),
  address: z
    .string()
    .min(5, "Adres musi mieć co najmniej 5 znaków"),
  city: z
    .string()
    .min(2, "Miasto musi mieć co najmniej 2 znaki"),
  postalCode: z
    .string()
    .min(5, "Kod pocztowy jest za krótki"),
 paymentMethod: z.enum(["BLIK", "KARTA", "PRZELEW", "POBRANIE"], {
  message: "Wybierz metodę płatności",
}),
  shippingMethod: z.enum([
    "INPOST_PACZKOMAT",
    "INPOST_KURIER",
    "DPD",
    "DHL",
    "ORLEN_PACZKA",
    "ODBIOR_OSOBISTY",
  ], {
    message: "Wybierz metodę dostawy",
  }),
  shippingPoint: z.string().optional(),
}).superRefine((data, ctx) => {
  const option = shippingOptions.find((item) => item.id === data.shippingMethod);

  if (option?.requiresPoint && !data.shippingPoint?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["shippingPoint"],
      message: "Podaj punkt odbioru lub numer paczkomatu",
    });
  }
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Imię i nazwisko musi mieć co najmniej 3 znaki"),
  email: z
    .string()
    .email("Podaj poprawny adres email"),
  password: z
    .string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email("Podaj poprawny adres email"),
  password: z
    .string()
    .min(1, "Podaj hasło"),
});

export type LoginFormData = z.infer<typeof loginSchema>;