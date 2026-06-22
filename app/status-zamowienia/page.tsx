"use client";

import { useState } from "react";
import { PackageSearch, Truck, Clock, Package, CheckCircle2, CreditCard } from "lucide-react";
import InfoPage, { InfoCard } from "../../components/InfoPage";

type OrderStatus = {
  id: number;
  createdAt: string;
  status: "NOWE" | "W_REALIZACJI" | "WYSLANE";
  paymentStatus: "OCZEKUJE" | "OPLACONA" | "NIEUDANA";
  total: number;
  itemsCount: number;
  shippingMethodName?: string | null;
  shippingEstimatedDelivery?: string | null;
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
};

const STATUS_CONFIG: Record<OrderStatus["status"], { label: string; cls: string; icon: typeof Clock }> = {
  NOWE: { label: "Przyjęte", cls: "bg-blue-50 text-blue-700 border-blue-100", icon: Clock },
  W_REALIZACJI: { label: "W realizacji", cls: "bg-amber-50 text-amber-700 border-amber-100", icon: Package },
  WYSLANE: { label: "Wysłane", cls: "bg-green-50 text-green-700 border-green-100", icon: Truck },
};

const PAYMENT_CONFIG: Record<OrderStatus["paymentStatus"], { label: string; cls: string }> = {
  OCZEKUJE: { label: "Oczekuje na płatność", cls: "bg-amber-50 text-amber-700 border-amber-100" },
  OPLACONA: { label: "Opłacone", cls: "bg-green-50 text-green-700 border-green-100" },
  NIEUDANA: { label: "Płatność nieudana", cls: "bg-red-50 text-red-700 border-red-100" },
};

const formatPrice = (v: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(v);
const formatDate = (v: string) =>
  new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(v));

export default function StatusZamowieniaPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const check = async () => {
    setError("");
    setResult(null);

    if (!orderId.trim() || !email.trim()) {
      setError("Podaj numer zamówienia oraz adres e-mail.");
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({ id: orderId.trim(), email: email.trim() });
      const res = await fetch(`/api/order-status?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Nie udało się sprawdzić statusu.");
        return;
      }
      setResult(data);
    } catch {
      setError("Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const statusCfg = result ? STATUS_CONFIG[result.status] : null;
  const paymentCfg = result ? PAYMENT_CONFIG[result.paymentStatus] : null;
  const StatusIcon = statusCfg?.icon;

  return (
    <InfoPage
      eyebrow="Status"
      title="Sprawdź zamówienie"
      icon={PackageSearch}
      subtitle="Wpisz numer zamówienia oraz adres e-mail użyty podczas zakupów, aby sprawdzić aktualny status realizacji."
      contentClassName="max-w-xl mx-auto px-6 py-10 md:py-12"
    >
      <InfoCard>
        <label className="block text-sm font-semibold text-[#0a0a0a]">Numer zamówienia</label>
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          className="mt-2 w-full rounded-xl border border-[#e8e8e6] bg-[#f7f7f5] px-4 py-3 text-[#0a0a0a] outline-none transition focus:border-[#4caf3d] focus:bg-white focus:ring-2 focus:ring-[#4caf3d]/15"
          placeholder="np. 123"
        />

        <label className="mt-5 block text-sm font-semibold text-[#0a0a0a]">E-mail</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          className="mt-2 w-full rounded-xl border border-[#e8e8e6] bg-[#f7f7f5] px-4 py-3 text-[#0a0a0a] outline-none transition focus:border-[#4caf3d] focus:bg-white focus:ring-2 focus:ring-[#4caf3d]/15"
          placeholder="adres@email.pl"
        />

        <button
          onClick={check}
          disabled={isLoading}
          className="mt-6 w-full rounded-xl bg-[#0a0a0a] px-6 py-3.5 font-semibold text-white transition hover:bg-[#1a1a1a] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Sprawdzanie..." : "Sprawdź status"}
        </button>

        {error && (
          <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          Status zamówienia znajdziesz też po zalogowaniu w panelu klienta.
        </p>
      </InfoCard>

      {result && statusCfg && paymentCfg && (
        <InfoCard className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Zamówienie</p>
              <h2 className="text-xl font-bold text-[#0a0a0a]">#{result.id}</h2>
              <p className="mt-0.5 text-sm text-gray-500">z dnia {formatDate(result.createdAt)}</p>
            </div>
            <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${statusCfg.cls}`}>
              {StatusIcon && <StatusIcon className="h-4 w-4" />}
              {statusCfg.label}
            </span>
          </div>

          <div className="mt-5 space-y-3 border-t border-[#ecece9] pt-5">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <CreditCard className="h-4 w-4" /> Płatność
              </span>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${paymentCfg.cls}`}>
                {paymentCfg.label}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Truck className="h-4 w-4" /> Dostawa
              </span>
              <span className="text-sm font-medium text-gray-800">
                {result.shippingMethodName || "Standardowa"}
              </span>
            </div>

            {result.shippingEstimatedDelivery && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-500">Przewidywany czas</span>
                <span className="text-sm font-medium text-gray-800">{result.shippingEstimatedDelivery}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Produkty</span>
              <span className="text-sm font-medium text-gray-800">{result.itemsCount} szt.</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Wartość</span>
              <span className="text-sm font-bold text-gray-950">{formatPrice(result.total)}</span>
            </div>
          </div>

          {result.trackingNumber ? (
            <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-green-800">
                <CheckCircle2 className="h-4 w-4" /> Przesyłka nadana
              </p>
              <p className="mt-1 text-sm text-green-700">
                Numer listu{result.trackingCarrier ? ` (${result.trackingCarrier})` : ""}:{" "}
                <span className="font-mono font-semibold">{result.trackingNumber}</span>
              </p>
            </div>
          ) : (
            <p className="mt-5 text-center text-xs text-gray-400">
              Numer przesyłki pojawi się tutaj po nadaniu zamówienia.
            </p>
          )}
        </InfoCard>
      )}
    </InfoPage>
  );
}
