import { FileText, AlertTriangle } from "lucide-react";
import InfoPage, { InfoCard, InfoBox } from "../../components/InfoPage";

export const metadata = { title: "Regulamin" };

export default function Page() {
  return (
    <InfoPage
      eyebrow="Dokumenty"
      title="Regulamin"
      icon={FileText}
      subtitle="Zasady korzystania ze sklepu internetowego STORENER oraz warunki sprzedaży."
    >
      <InfoCard title="Regulamin sklepu internetowego STORENER">
        <p className="leading-relaxed text-gray-600">
          Sklep internetowy dostępny pod adresem{" "}
          <a href="https://www.storener.pl" className="font-medium text-[#3a9a2c] hover:underline">
            www.storener.pl
          </a>{" "}
          prowadzony jest przez Storener Natalia Dąbrowska, Gałęzewko 14, 88-420 Rogowo,
          NIP: 5621765581, REGON: 540792425.
        </p>
      </InfoCard>

      <InfoCard title="Kontakt">
        <InfoBox className="space-y-1 text-gray-600">
          <p>Adres: Gałęzewko 14, 88-420 Rogowo</p>
          <p>
            E-mail:{" "}
            <a href="mailto:storener@interia.pl" className="font-medium text-[#3a9a2c] hover:underline">
              storener@interia.pl
            </a>
          </p>
          <p>
            Telefon:{" "}
            <a href="tel:+48661377044" className="font-medium text-[#3a9a2c] hover:underline">
              +48 661 377 044
            </a>
          </p>
          <p>Konto PKO BP PLN: 52 1020 1505 0000 0902 0288 1704</p>
        </InfoBox>
      </InfoCard>

      {/*
        TODO: Wklej tutaj pełną treść regulaminu sklepu.
        Plik Word zawiera sekcje: DOSTAWA, PŁATNOŚĆ, REKLAMACJE, REGULAMIN, POLITYKA PRYWATNOŚCI, POLITYKA COOKIES.
        Pełna treść regulaminu (prawa i obowiązki stron, warunki sprzedaży itp.) powinna zostać uzupełniona w tym miejscu.
      */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-800">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <p>
          Pełna treść regulaminu zostanie uzupełniona. Skontaktuj się z administratorem sklepu
          w celu dodania kompletnego tekstu regulaminu.
        </p>
      </div>
    </InfoPage>
  );
}
