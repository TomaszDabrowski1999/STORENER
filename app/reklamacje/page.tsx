import { ShieldCheck, MapPin } from "lucide-react";
import InfoPage, { InfoCard, InfoBox, Steps, Bullets } from "../../components/InfoPage";

export const metadata = { title: "Reklamacje" };

export default function Page() {
  return (
    <InfoPage
      eyebrow="Reklamacje"
      title="Reklamacje i gwarancja"
      icon={ShieldCheck}
      subtitle="Masz prawo do reklamacji towaru z wadą. Poniżej znajdziesz adres, procedurę zgłoszenia oraz warunki gwarancji."
    >
      <InfoCard title="Adres do reklamacji">
        <InfoBox className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#4caf3d]" />
          <div className="text-gray-600">
            <p className="font-semibold text-[#0a0a0a]">Natalia Dąbrowska</p>
            <p className="mt-1">Gałęzewko 14, 88-420 Rogowo</p>
            <p>Polska</p>
            <p className="mt-2">
              E-mail:{" "}
              <a href="mailto:storener@interia.pl" className="font-medium text-[#3a9a2c] hover:underline">
                storener@interia.pl
              </a>
            </p>
          </div>
        </InfoBox>
      </InfoCard>

      <InfoCard title="Procedura reklamacyjna">
        <Steps
          items={[
            "W przypadku wystąpienia wady zakupionego u Sprzedawcy towaru Klient ma prawo do reklamacji.",
            "Reklamację należy zgłosić pisemnie lub drogą elektroniczną na podany adres Sprzedawcy lub przy wykorzystaniu elektronicznego formularza reklamacyjnego udostępnianego przez Sprzedawcę na jednej z podstron Sklepu.",
            "Zaleca się, aby w reklamacji zawrzeć m.in. zwięzły opis wady, okoliczności (w tym datę) jej wystąpienia, dane Klienta składającego reklamację oraz żądanie Klienta w związku z wadą towaru.",
            "Sprzedawca ustosunkuje się do żądania reklamacyjnego niezwłocznie, nie później niż w terminie 14 dni, a jeśli nie zrobi tego w tym terminie, uważa się, że żądanie Klienta uznał za uzasadnione.",
            "Towary odsyłane w ramach procedury reklamacyjnej należy wysyłać na podany powyżej adres. Storener gwarantuje sprawne działanie sprzedawanego przez siebie produktu na okres podany w treści zakładki „Reklamacje”.",
          ]}
        />
        <InfoBox className="mt-5 space-y-2 text-sm leading-relaxed text-gray-600">
          <p>Okres reklamacji rozpoczyna się od daty dostarczenia produktu.</p>
          <p>Wady lub uszkodzenia sprzętu ujawnione w okresie reklamacji będą bezpłatnie usuwane w ciągu 14 dni roboczych od daty dostarczenia sprzętu do punktu sprzedaży.</p>
          <p>Reklamujący jest zobowiązany do dostarczenia towaru do siedziby sprzedawcy.</p>
        </InfoBox>
      </InfoCard>

      <InfoCard title="Gwarancja">
        <p className="mb-4 font-semibold text-[#0a0a0a]">Okres gwarancji dla przedsiębiorców: 3 miesiące</p>
        <ol className="space-y-2 leading-relaxed text-gray-600">
          <li>1. Umową Sprzedaży objęte są nowe Produkty. Na stronach Sklepu szczegółowo opisany jest stan każdego produktu.</li>
          <li>2. Sprzedawca jest obowiązany dostarczyć Klientowi rzecz wolną od wad.</li>
          <li>3. W przypadku, gdy na Produkt została udzielona gwarancja, informacja o niej oraz jej treść będą zawarte przy produkcie.</li>
        </ol>

        <InfoBox className="mt-5">
          <p className="mb-3 font-semibold text-[#0a0a0a]">
            Gwarancją nie są objęte uszkodzenia sprzętu powstałe w wyniku:
          </p>
          <Bullets
            items={[
              "uszkodzeń mechanicznych i wywołanych nimi wad",
              "niewłaściwego użytkowania i przechowywania sprzętu",
              "niewłaściwej konserwacji",
              "dokonywania samodzielnych napraw, przeróbek lub zmian konstrukcyjnych",
            ]}
          />
        </InfoBox>
      </InfoCard>
    </InfoPage>
  );
}
