import { z } from "zod";

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
    errorMap: () => ({ message: "Wybierz metodę płatności" }),
  }),
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