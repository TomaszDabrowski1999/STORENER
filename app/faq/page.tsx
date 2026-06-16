"use client";

import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import InfoPage from "../../components/InfoPage";

const items: [string, string][] = [
  ["Jak długo trwa realizacja zamówienia?", "Standardowo zamówienia przygotowujemy w ciągu 1–2 dni roboczych."],
  ["Czy mogę zmienić dane po złożeniu zamówienia?", "Tak, skontaktuj się z obsługą klienta jak najszybciej po zakupie."],
  ["Gdzie sprawdzę status zamówienia?", "Status zamówienia widoczny jest w panelu klienta oraz na stronie „Status zamówienia”."],
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <InfoPage
      eyebrow="Pomoc"
      title="Najczęstsze pytania"
      icon={HelpCircle}
      subtitle="Odpowiedzi na pytania klientów dotyczące zakupów, dostawy i płatności. Nie znalazłeś odpowiedzi? Napisz do nas."
      contentClassName="space-y-3"
    >
      {items.map(([q, a], i) => {
        const isOpen = open === i;
        return (
          <div
            key={q}
            className="overflow-hidden rounded-2xl border border-[#e8e8e6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-semibold text-[#0a0a0a]">{q}</span>
              <Plus
                className={`h-5 w-5 shrink-0 text-[#4caf3d] transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 leading-relaxed text-gray-600">{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </InfoPage>
  );
}
