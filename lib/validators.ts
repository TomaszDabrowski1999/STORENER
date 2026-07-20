import { z } from "zod";
import { getCourier, SHIPPING_METHOD_IDS } from "./shipping";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Imię i nazwisko musi mieć co najmniej 3 znaki")
    .max(120, "Imię i nazwisko jest zbyt długie"),
  email: z
    .string()
    .trim()
    .email("Podaj poprawny adres email")
    .max(200, "Adres e-mail jest zbyt długi"),
  phone: z
    .string()
    .trim()
    .min(9, "Podaj poprawny numer telefonu")
    .regex(/^[+]?[0-9\s-]{9,20}$/, "Numer telefonu może zawierać tylko cyfry, spacje, myślniki i +"),
  address: z
    .string()
    .trim()
    .min(5, "Adres musi mieć co najmniej 5 znaków")
    .max(200, "Adres jest zbyt długi"),
  city: z
    .string()
    .trim()
    .min(2, "Miasto musi mieć co najmniej 2 znaki")
    .max(100, "Nazwa miasta jest zbyt długa"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi mieć format 00-000"),
 paymentMethod: z.enum(["BLIK", "KARTA", "PRZELEW", "POBRANIE"], {
  message: "Wybierz metodę płatności",
}),
  shippingMethod: z.enum(SHIPPING_METHOD_IDS, {
    message: "Wybierz metodę dostawy",
  }),
  shippingPoint: z.string().optional(),
}).superRefine((data, ctx) => {
  const courier = getCourier(data.shippingMethod);

  if (courier?.requiresPoint && !data.shippingPoint?.trim()) {
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
    .trim()
    .min(3, "Imię i nazwisko musi mieć co najmniej 3 znaki")
    .max(120, "Imię i nazwisko jest zbyt długie"),
  email: z
    .string()
    .trim()
    .email("Podaj poprawny adres email")
    .max(200, "Adres e-mail jest zbyt długi"),
  password: z
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .max(72, "Hasło może mieć maksymalnie 72 znaki"),
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