"use client";

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

      const response = await fetch(`/api/orders/${orderId}/pay`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Nie udało się potwierdzić płatności");
        return;
      }

      router.push(`/zamowienia/${orderId}`);
      router.refresh();
    } catch {
      setError("Wystąpił błąd połączenia z płatnością");
    } finally {
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
          ? "Przetwarzanie płatności..."
          : isCashOnDelivery
            ? "Potwierdź zamówienie za pobraniem"
            : isPaid
              ? "Zobacz zamówienie"
              : "Zapłać i zakończ zamówienie"}
      </button>

      {!isCashOnDelivery && !isPaid ? (
        <p className="mt-3 text-center text-xs leading-5 text-gray-500">
          To jest bezpieczny etap płatności. Po podłączeniu bramki płatności
          ten przycisk można zastąpić przekierowaniem do operatora płatności.
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
