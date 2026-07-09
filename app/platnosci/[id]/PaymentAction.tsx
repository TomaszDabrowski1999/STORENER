"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  orderId: number;
  paymentMethod: string;
  paymentStatus: string;
};

export default function PaymentAction({ orderId, paymentMethod, paymentStatus }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isCashOnDelivery = paymentMethod === "POBRANIE";
  const isPaid = paymentStatus === "OPLACONA";

  const handlePayment = async () => {
    setError("");

    if (isCashOnDelivery || isPaid) {
      router.push(`/zamowienia/${orderId}`);
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/payments/przelewy24/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok || !data.redirectUrl) {
        setError(data.error || "Nie udało się rozpocząć płatności");
        setIsLoading(false);
        return;
      }

      // Przekierowanie do bramki Przelewy24 – celowo nie zdejmujemy
      // stanu ładowania, bo strona zaraz się zmieni.
      window.location.href = data.redirectUrl;
    } catch {
      setError("Wystąpił błąd połączenia z płatnością");
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handlePayment}
        disabled={isLoading}
        className="block w-full rounded-2xl bg-gray-950 px-6 py-4 text-center font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? "Przekierowanie do płatności..."
          : isCashOnDelivery
            ? "Potwierdź zamówienie za pobraniem"
            : isPaid
              ? "Zobacz zamówienie"
              : "Zapłać przez Przelewy24"}
      </button>

      {!isCashOnDelivery && !isPaid ? (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs leading-5 text-gray-500">
          <Image
            src="/przelewy24.png"
            alt="Przelewy24"
            width={72}
            height={20}
            className="h-5 w-auto"
          />
          <span>BLIK, karta lub szybki przelew — bezpieczna płatność online.</span>
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
