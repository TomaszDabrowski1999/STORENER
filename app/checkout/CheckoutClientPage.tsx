"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, CreditCard, LockKeyhole, MapPin, PackageCheck, Truck } from "lucide-react";
import { getCart, saveCart } from "../../lib/cart";
import { CartItem } from "../../types/cart";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "../../lib/validators";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { getShippingOption, shippingOptions } from "../../lib/shipping";

type SessionUser = {
  id: string;
  fullName: string;
  email: string;
};

type Props = {
  sessionUser: SessionUser;
};

const formatPrice = (value: number) => `${value.toFixed(2).replace(".", ",")} zł`;

export default function CheckoutClientPage({ sessionUser }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      shippingMethod: "INPOST_KURIER",
      shippingPoint: "",
    },
  });

  useEffect(() => {
    setCart(getCart());
    setValue("fullName", sessionUser.fullName);
    setValue("email", sessionUser.email);
    setValue("paymentMethod", "KARTA");
    setValue("shippingMethod", "INPOST_KURIER");
  }, [sessionUser, setValue]);

  const selectedShippingMethod = watch("shippingMethod");
  const selectedShipping = getShippingOption(selectedShippingMethod) || shippingOptions[1];
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = cart.length > 0 ? selectedShipping.price : 0;
  const total = subtotal + shippingPrice;
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
        shippingMethod: "INPOST_KURIER",
        shippingPoint: "",
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
    <main className="min-h-screen bg-[#eef1f3] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            finalizacja zamówienia
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">
            Dostawa i płatność
          </h1>
          <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm">
              <CheckCircle2 size={18} className="text-emerald-700" /> Koszyk
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm ring-1 ring-emerald-600">
              <Truck size={18} className="text-emerald-700" /> Dane zamówienia
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm">
              <PackageCheck size={18} className="text-gray-400" /> Potwierdzenie
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-5">
            <Card className="rounded-none p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">krok 1</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-950">Dane odbiorcy</h2>
                  <p className="mt-1 text-sm text-gray-500">Podaj dane potrzebne do wysyłki zamówienia.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <Input type="text" placeholder="Imię i nazwisko" error={errors.fullName?.message} {...register("fullName")} />
                <Input type="email" placeholder="Email" error={errors.email?.message} {...register("email")} />
                <Input type="text" placeholder="Adres, numer domu / mieszkania" error={errors.address?.message} {...register("address")} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input type="text" placeholder="Miasto" error={errors.city?.message} {...register("city")} />
                  <Input type="text" placeholder="Kod pocztowy" error={errors.postalCode?.message} {...register("postalCode")} />
                </div>
              </div>
            </Card>

            <Card className="rounded-none p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Truck size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">krok 2</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-950">Wybierz dostawę</h2>
                  <p className="mt-1 text-sm text-gray-500">Wszystkie produkty są w jednej przesyłce od jednego dostawcy.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {shippingOptions.map((option) => (
                  <label key={option.id} className={`cursor-pointer border p-4 transition ${selectedShippingMethod === option.id ? "border-emerald-700 bg-emerald-50" : "border-gray-100 bg-white hover:border-gray-300"}`}>
                    <input type="radio" value={option.id} className="sr-only" {...register("shippingMethod")} />
                    <span className="flex items-start justify-between gap-4">
                      <span>
                        <span className="block text-base font-bold text-gray-950">{option.name}</span>
                        <span className="mt-1 block text-sm leading-5 text-gray-500">{option.description}</span>
                      </span>
                      <span className="whitespace-nowrap text-sm font-bold text-gray-950">{option.price === 0 ? "Gratis" : formatPrice(option.price)}</span>
                    </span>
                    <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{option.estimatedDelivery}</span>
                  </label>
                ))}
              </div>

              {errors.shippingMethod?.message && <p className="mt-3 text-sm font-medium text-red-600">{errors.shippingMethod.message}</p>}

              {selectedShipping?.requiresPoint && (
                <div className="mt-4">
                  <Input type="text" placeholder="Numer paczkomatu lub nazwa punktu odbioru" error={errors.shippingPoint?.message} {...register("shippingPoint")} />
                </div>
              )}
            </Card>

            <Card className="rounded-none p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <CreditCard size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">krok 3</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-950">Płatność</h2>
                  <div className="mt-4 rounded-none border border-gray-100 bg-gray-50 p-4">
                    <p className="font-semibold text-gray-950">Płatność przy zamówieniu</p>
                    <p className="mt-1 text-sm text-gray-500">Metoda jest ustawiona automatycznie. Po złożeniu zamówienia klient otrzymuje potwierdzenie.</p>
                  </div>
                </div>
              </div>
            </Card>

            {serverError && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {serverError}
              </div>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:h-fit">
            <Card className="rounded-none p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">podsumowanie</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-950">Twoje zamówienie</h2>
                </div>
                <span className="bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">{totalItems} szt.</span>
              </div>

              {cart.length === 0 ? (
                <div className="mt-6 bg-gray-50 p-5 text-gray-600">Koszyk jest pusty.</div>
              ) : (
                <div className="mt-6 max-h-[360px] space-y-3 overflow-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 border border-gray-100 p-3">
                      <Image src={item.image} alt={item.name} width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-gray-950">{item.name}</h3>
                        <p className="mt-1 text-xs text-gray-500">Ilość: {item.quantity}</p>
                      </div>
                      <p className="text-right text-sm font-bold text-gray-950">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 space-y-4 border-t border-gray-100 pt-5 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Wartość produktów</span>
                  <span className="font-semibold text-gray-950">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Dostawa: {selectedShipping.name}</span>
                  <span className="font-semibold text-gray-950">{shippingPrice === 0 ? "Gratis" : formatPrice(shippingPrice)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-5 text-xl font-bold text-gray-950">
                  <span>Razem</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button type="submit" className="mt-6 w-full rounded-none py-4 text-sm uppercase tracking-[0.2em]" disabled={isSaving || cart.length === 0}>
                {isSaving ? "Tworzenie zamówienia..." : "Złóż zamówienie"}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
                <LockKeyhole size={14} /> Bezpieczne przetwarzanie zamówienia
              </div>
            </Card>
          </aside>
        </form>
      </div>
    </main>
  );
}
