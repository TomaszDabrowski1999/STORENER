"use client";

import { useState } from "react";
import { PackageSearch } from "lucide-react";
import InfoPage, { InfoCard } from "../../components/InfoPage";

export default function StatusZamowieniaPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

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
          className="mt-2 w-full rounded-xl border border-[#e8e8e6] bg-[#f7f7f5] px-4 py-3 text-[#0a0a0a] outline-none transition focus:border-[#4caf3d] focus:bg-white focus:ring-2 focus:ring-[#4caf3d]/15"
          placeholder="np. 123"
        />

        <label className="mt-5 block text-sm font-semibold text-[#0a0a0a]">E-mail</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[#e8e8e6] bg-[#f7f7f5] px-4 py-3 text-[#0a0a0a] outline-none transition focus:border-[#4caf3d] focus:bg-white focus:ring-2 focus:ring-[#4caf3d]/15"
          placeholder="adres@email.pl"
        />

        <button className="mt-6 w-full rounded-xl bg-[#0a0a0a] px-6 py-3.5 font-semibold text-white transition hover:bg-[#1a1a1a] active:scale-[0.99]">
          Sprawdź status
        </button>

        <p className="mt-4 text-center text-xs text-gray-400">
          Status zamówienia znajdziesz też po zalogowaniu w panelu klienta.
        </p>
      </InfoCard>
    </InfoPage>
  );
}
