import { Truck } from "lucide-react";
import { shippingOptions } from "../../lib/shipping";
import InfoPage, { InfoCard } from "../../components/InfoPage";

export const metadata = { title: "Dostawa" };

export default function Page() {
  return (
    <InfoPage
      eyebrow="Dostawa"
      title="Dostawa i kurierzy"
      icon={Truck}
      subtitle="Wybierz wygodną formę dostawy podczas składania zamówienia. Koszt jest doliczany automatycznie w koszyku i na podsumowaniu."
      contentClassName="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {shippingOptions.map((option) => (
          <InfoCard key={option.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#0a0a0a]">{option.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{option.description}</p>
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
            <div className="mt-5 rounded-2xl border border-[#ecece9] bg-[#f7f7f5] px-4 py-3 text-sm text-gray-600">
              Przewidywany czas: <strong className="text-[#0a0a0a]">{option.estimatedDelivery}</strong>
            </div>
          </InfoCard>
        ))}
      </div>

      <InfoCard className="bg-[#0a0a0a] text-white">
        <p className="text-sm leading-relaxed text-white/70">
          Darmowa dostawa obowiązuje dla zamówień od <strong className="text-[#4caf3d]">199 zł</strong>.
          Zamówienia złożone w dni robocze do godz. 12:00 realizujemy zwykle tego samego dnia.
        </p>
      </InfoCard>
    </InfoPage>
  );
}
