import { Cookie } from "lucide-react";
import InfoPage, { InfoCard, InfoBox, Bullets } from "../../components/InfoPage";

export const metadata = { title: "Polityka cookies" };

export default function Page() {
  return (
    <InfoPage
      eyebrow="Dokumenty"
      title="Polityka cookies"
      icon={Cookie}
      subtitle="Informacje o plikach cookies używanych w naszym sklepie oraz sposobach zarządzania nimi."
    >
      <InfoCard title="Informacje ogólne">
        <p className="leading-relaxed text-gray-600">
          Podczas przeglądania stron internetowych Sklepu Internetowego są używane pliki „cookies”, zwane dalej Cookies,
          czyli niewielkie informacje tekstowe, które są zapisywane w Twoim urządzeniu końcowym w związku
          z korzystaniem ze strony internetowej. Ich stosowanie ma na celu poprawne działanie stron internetowych Sklepu Internetowego.
        </p>
      </InfoCard>

      <InfoCard title="Bezpieczeństwo">
        <p className="leading-relaxed text-gray-600">
          Stosowane przez nas pliki Cookies są bezpieczne dla Twoich urządzeń. W szczególności nie jest możliwe
          przedostanie się do Twoich urządzeń poprzez pliki Cookies wirusów lub innego niechcianego oprogramowania
          lub oprogramowania złośliwego.
        </p>
      </InfoCard>

      <InfoCard title="Rodzaje plików Cookies">
        <div className="space-y-4">
          <InfoBox>
            <h3 className="mb-2 font-semibold text-[#0a0a0a]">Cookies sesyjne</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Są przechowywane na Twoim urządzeniu i pozostają tam do momentu zakończenia sesji danej przeglądarki.
              Zapisane informacje są wówczas trwale usuwane z pamięci Twojego urządzenia. Mechanizm Cookies sesyjnych
              nie pozwala na pobieranie jakichkolwiek danych osobowych ani żadnych informacji poufnych z Twojego urządzenia.
            </p>
          </InfoBox>
          <InfoBox>
            <h3 className="mb-2 font-semibold text-[#0a0a0a]">Cookies trwałe</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Są przechowywane na Twoim urządzeniu i pozostają tam do momentu ich skasowania. Zakończenie sesji danej
              przeglądarki lub wyłączenie urządzenia nie powoduje ich usunięcia z Twojego urządzenia. Mechanizm Cookies
              trwałych nie pozwala na pobieranie jakichkolwiek danych osobowych ani żadnych informacji poufnych z Twojego urządzenia.
            </p>
          </InfoBox>
        </div>
      </InfoCard>

      <InfoCard title="Cele wykorzystania Cookies">
        <p className="mb-4 leading-relaxed text-gray-600">
          Wykorzystujemy pliki Cookies podmiotów zewnętrznych w następujących celach:
        </p>
        <Bullets
          items={[
            "konfiguracji Sklepu Internetowego;",
            "tworzenia statystyk, które pomagają zrozumieć, w jaki sposób użytkownicy Sklepu Internetowego korzystają ze stron internetowych, co umożliwia ulepszanie ich struktury i zawartości za pośrednictwem narzędzi analitycznych Google Analytics, których administratorem jest Google Ireland Ltd. z siedzibą w Irlandii;",
            "popularyzacji sklepu internetowego za pomocą serwisu Google.com, którego administratorem jest Google Ireland Ltd. z siedzibą w Irlandii.",
          ]}
        />
      </InfoCard>

      <InfoCard title="Reklamy i preferencje">
        <p className="leading-relaxed text-gray-600">
          Cookies mogą być wykorzystane przez sieci reklamowe, w szczególności sieć Google, do wyświetlenia reklam
          dopasowanych do Twoich preferencji. W tym celu mogą zostać zachowane informacje o sposobie poruszania się
          przez Ciebie w sieci lub czasie skorzystania ze strony internetowej.
        </p>
        <p className="mt-3 leading-relaxed text-gray-600">
          Aby przeglądać i edytować informacje o Twoich preferencjach gromadzonych przez sieć reklamową Google,
          możesz skorzystać z narzędzia dostępnego pod adresem:{" "}
          <a
            href="https://www.google.com/ads/preferences/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#3a9a2c] hover:underline"
          >
            google.com/ads/preferences
          </a>
          .
        </p>
      </InfoCard>

      <InfoCard title="Zarządzanie Cookies">
        <p className="leading-relaxed text-gray-600">
          Za pomocą ustawień przeglądarki internetowej lub za pomocą konfiguracji usługi możesz samodzielnie i w każdym
          czasie zmienić ustawienia dotyczące Cookies, określając warunki ich przechowywania i uzyskiwania dostępu przez
          Cookies do Twojego urządzenia. Szczegółowe informacje o możliwości i sposobach obsługi Cookies dostępne są
          w ustawieniach Twojego oprogramowania (przeglądarki internetowej).
        </p>
      </InfoCard>
    </InfoPage>
  );
}
