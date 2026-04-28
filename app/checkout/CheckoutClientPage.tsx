"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCart, saveCart } from "../../lib/cart";
import { CartItem } from "../../types/cart";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "../../lib/validators";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import SectionHeader from "../../components/ui/SectionHeader";

type SessionUser = {
  id: string;
  fullName: string;
  email: string;
};

type Props = {
  sessionUser: SessionUser;
};

export default function CheckoutClientPage({ sessionUser }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: sessionUser.fullName,
      email: sessionUser.email,
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "KARTA",
    },
  });

  useEffect(() => {
    setCart(getCart());
    setValue("fullName", sessionUser.fullName);
    setValue("email", sessionUser.email);
    setValue("paymentMethod", "KARTA");
  }, [sessionUser, setValue]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const onSubmit = async (values: CheckoutFormData) => {
    setServerError("");

    if (cart.length === 0) {
      setServerError("Koszyk jest pusty");
      toast.error("Koszyk jest pusty");
      return;
    }

    const toastId = toast.loading("Tworzenie zamówienia...");

    try {
      setIsSaving(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          ...values,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || "Nie udało się utworzyć zamówienia");
        toast.error(data.error || "Nie udało się utworzyć zamówienia", {
          id: toastId,
        });
        return;
      }

      saveCart([]);
      window.dispatchEvent(new Event("storage"));
      setCart([]);

      reset({
        fullName: sessionUser.fullName,
        email: sessionUser.email,
        address: "",
        city: "",
        postalCode: "",
        paymentMethod: "KARTA",
      });

      toast.success("Zamówienie zostało utworzone", { id: toastId });
      window.location.href = `/zamowienie/${data.id}`;
    } catch {
      setServerError("Wystąpił błąd połączenia");
      toast.error("Wystąpił błąd połączenia", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <SectionHeader
            eyebrow="finalizacja zamówienia"
            title="Checkout"
            subtitle="Uzupełnij dane i sfinalizuj zamówienie w kilku prostych krokach."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                dane zamówienia
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Informacje klienta
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                type="text"
                placeholder="Imię i nazwisko"
                error={errors.fullName?.message}
                {...register("fullName")}
              />

              <Input
                type="email"
                placeholder="Email"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                type="text"
                placeholder="Adres"
                error={errors.address?.message}
                {...register("address")}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="text"
                  placeholder="Miasto"
                  error={errors.city?.message}
                  {...register("city")}
                />

                <Input
                  type="text"
                  placeholder="Kod pocztowy"
                  error={errors.postalCode?.message}
                  {...register("postalCode")}
                />
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Metoda płatności</p>
                <p className="mt-2 font-semibold text-black">Płatność przy zamówieniu</p>
              </div>

              {serverError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-4 text-base"
                disabled={isSaving}
              >
                {isSaving ? "Tworzenie zamówienia..." : "Złóż zamówienie"}
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                    podsumowanie
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-gray-900">
                    Twoje zamówienie
                  </h2>
                </div>

                <span className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                  {totalItems} szt.
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-gray-600">
                  Koszyk jest pusty.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Ilość: {item.quantity}
                        </p>
                      </div>

                      <p className="text-right text-base font-bold text-black">
                        {(item.price * item.quantity).toFixed(2)} zł
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Produkty</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-lg font-semibold text-black">
                  <span>Razem</span>
                  <span>{total.toFixed(2)} zł</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}