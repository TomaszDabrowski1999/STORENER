import { Mail, Phone, MapPin, Clock, Building2 } from "lucide-react";
import InfoPage, { InfoCard, InfoBox } from "../../components/InfoPage";

export const metadata = { title: "Kontakt" };

export default function KontaktPage() {
  return (
    <InfoPage
      eyebrow="Obsługa klienta"
      title="Kontakt"
      icon={Mail}
      subtitle="Masz pytanie o zamówienie, produkt albo zwrot? Skontaktuj się z nami — odpowiadamy w dni robocze."
      contentClassName="grid gap-4 md:grid-cols-2"
    >
      <InfoCard title="Dane kontaktowe">
        <div className="space-y-3 text-gray-600">
          <p className="font-semibold text-[#0a0a0a]">Storener – Natalia Dąbrowska</p>

          <a
            href="mailto:storener@interia.pl"
            className="flex items-center gap-3 transition hover:text-[#3a9a2c]"
          >
            <Mail className="h-4 w-4 text-[#4caf3d]" />
            storener@interia.pl
          </a>
          <a
            href="tel:+48661377044"
            className="flex items-center gap-3 transition hover:text-[#3a9a2c]"
          >
            <Phone className="h-4 w-4 text-[#4caf3d]" />
            +48 661 377 044
          </a>
          <p className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-[#4caf3d]" />
            Gałęzewko 14, 88-420 Rogowo
          </p>
          <p className="flex items-center gap-3 text-sm text-gray-500">
            <Clock className="h-4 w-4 text-[#4caf3d]" />
            Pon.–Pt. 9:00–17:00
          </p>
        </div>

        <InfoBox className="mt-6">
          <p className="flex items-center gap-2 font-semibold text-[#0a0a0a]">
            <Building2 className="h-4 w-4 text-[#4caf3d]" />
            Dane firmy
          </p>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p>NIP: 5621765581</p>
            <p>REGON: 540792425</p>
            <p>Konto PKO BP (PLN):</p>
            <p className="font-mono text-xs text-[#0a0a0a]">52 1020 1505 0000 0902 0288 1704</p>
          </div>
        </InfoBox>
      </InfoCard>

      <InfoCard title="Przed kontaktem">
        <p className="leading-relaxed text-gray-600">
          Przygotuj numer zamówienia oraz adres e-mail użyty podczas zakupów. Ułatwi to szybką obsługę sprawy.
        </p>
        <InfoBox className="mt-6">
          <p className="font-semibold text-[#0a0a0a]">Adres do reklamacji i zwrotów</p>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p>Natalia Dąbrowska</p>
            <p>Gałęzewko 14, 88-420 Rogowo</p>
            <p>Polska</p>
          </div>
        </InfoBox>
      </InfoCard>
    </InfoPage>
  );
}
