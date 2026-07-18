import { Truck } from "lucide-react";
import {
  PACKAGE_SIZES,
  PACKAGE_SIZE_LABELS,
  PACKAGE_DIMENSIONS,
  getShippingOptionsForSize,
  FREE_SHIPPING_THRESHOLD,
} from "../../lib/shipping";
import InfoPage, { InfoCard } from "../../components/InfoPage";

export const metadata = { title: "Dostawa" };

const SIZE_HINTS: Record<string, string> = {
  MALA: "drobne akcesoria, małe produkty",
  SREDNIA: "większość produktów standardowych",
  DUZA: "produkty wielkogabarytowe",
};

export default function Page() {
  return (
    <InfoPage
      eyebrow="Dostawa"
      title="Dostawa i kurierzy"
      icon={Truck}
      subtitle="Koszt dostawy zależy od wielkości paczki. Wielkość paczki dla całego zamówienia wyznacza największy produkt w koszyku, a koszt doliczany jest automatycznie w koszyku i na podsumowaniu."
      contentClassName="space-y-6"
    >
      {PACKAGE_SIZES.map((size) => {
        const dims = PACKAGE_DIMENSIONS[size];
        const options = getShippingOptionsForSize(size);

        return (
          <InfoCard key={size}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-lg font-bold text-[#0a0a0a]">
                {PACKAGE_SIZE_LABELS[size]}
              </h2>
              <span className="text-xs font-medium text-gray-400">
                do {dims.length}×{dims.width}×{dims.height} cm, do {dims.weight} kg
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{SIZE_HINTS[size]}</p>

            <div className="mt-4 divide-y divide-[#ecece9] rounded-2xl border border-[#ecece9] bg-[#f7f7f5]">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#0a0a0a]">{option.name}</p>
                    <p className="text-xs text-gray-500">{option.estimatedDelivery}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold ${
                      option.price === 0
                        ? "bg-[#4caf3d]/12 text-[#3a9a2c]"
                        : "bg-[#0a0a0a] text-white"
                    }`}
                  >
                    {option.price === 0 ? "Gratis" : `${option.price.toFixed(2)} zł`}
                  </span>
                </div>
              ))}
            </div>
          </InfoCard>
        );
      })}

      <InfoCard className="bg-[#0a0a0a] text-white">
        <p className="text-sm leading-relaxed text-white/70">
          Darmowa dostawa obowiązuje dla zamówień od{" "}
          <strong className="text-[#4caf3d]">{FREE_SHIPPING_THRESHOLD} zł</strong>{" "}
          niezależnie od wielkości paczki. Zamówienia złożone w dni robocze do godz.
          12:00 realizujemy zwykle tego samego dnia.
        </p>
      </InfoCard>
    </InfoPage>
  );
}
