export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-bold text-white">Polityka Cookies</h1>

      <div className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-white/70">

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Informacje ogólne</h2>
          <p className="text-sm leading-relaxed">
            Podczas przeglądania stron internetowych Sklepu Internetowego są używane pliki „cookies", zwane dalej Cookies,
            czyli niewielkie informacje tekstowe, które są zapisywane w Twoim urządzeniu końcowym w związku
            z korzystaniem ze strony internetowej. Ich stosowanie ma na celu poprawne działanie stron internetowych Sklepu Internetowego.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Bezpieczeństwo</h2>
          <p className="text-sm leading-relaxed">
            Stosowane przez nas pliki Cookies są bezpieczne dla Twoich urządzeń. W szczególności nie jest możliwe
            przedostanie się do Twoich urządzeń poprzez pliki Cookies wirusów lub innego niechcianego oprogramowania
            lub oprogramowania złośliwego.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-white">Rodzaje plików Cookies</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="rounded-xl border border-white/8 bg-white/5 p-5">
              <h3 className="mb-2 font-semibold text-white">Cookies sesyjne</h3>
              <p>
                Są przechowywane na Twoim urządzeniu i pozostają tam do momentu zakończenia sesji danej przeglądarki.
                Zapisane informacje są wówczas trwale usuwane z pamięci Twojego urządzenia. Mechanizm Cookies sesyjnych
                nie pozwala na pobieranie jakichkolwiek danych osobowych ani żadnych informacji poufnych z Twojego urządzenia.
              </p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/5 p-5">
              <h3 className="mb-2 font-semibold text-white">Cookies trwałe</h3>
              <p>
                Są przechowywane na Twoim urządzeniu i pozostają tam do momentu ich skasowania. Zakończenie sesji danej
                przeglądarki lub wyłączenie urządzenia nie powoduje ich usunięcia z Twojego urządzenia. Mechanizm Cookies
                trwałych nie pozwala na pobieranie jakichkolwiek danych osobowych ani żadnych informacji poufnych z Twojego urządzenia.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-white">Cele wykorzystania Cookies</h2>
          <p className="mb-3 text-sm leading-relaxed">
            Wykorzystujemy pliki Cookies podmiotów zewnętrznych w następujących celach:
          </p>
          <ul className="space-y-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4caf3d]" />
              konfiguracji Sklepu Internetowego;
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4caf3d]" />
              tworzenia statystyk, które pomagają zrozumieć, w jaki sposób użytkownicy Sklepu Internetowego korzystają
              ze stron internetowych, co umożliwia ulepszanie ich struktury i zawartości za pośrednictwem narzędzi
              analitycznych Google Analytics, których administratorem jest Google Ireland Ltd. z siedzibą w Irlandii;
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4caf3d]" />
              popularyzacji sklepu internetowego za pomocą serwisu Google.com, którego administratorem jest Google Ireland
              Ltd. z siedzibą w Irlandii.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Reklamy i preferencje</h2>
          <p className="text-sm leading-relaxed">
            Cookies mogą być wykorzystane przez sieci reklamowe, w szczególności sieć Google, do wyświetlenia reklam
            dopasowanych do Twoich preferencji. W tym celu mogą zostać zachowane informacje o sposobie poruszania się
            przez Ciebie w sieci lub czasie skorzystania ze strony internetowej.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Aby przeglądać i edytować informacje o Twoich preferencjach gromadzonych przez sieć reklamową Google,
            możesz skorzystać z narzędzia dostępnego pod adresem:{" "}
            <a
              href="https://www.google.com/ads/preferences/"
              target="_blank"
              rel="noreferrer"
              className="text-[#4caf3d] hover:underline"
            >
              google.com/ads/preferences
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Zarządzanie Cookies</h2>
          <p className="text-sm leading-relaxed">
            Za pomocą ustawień przeglądarki internetowej lub za pomocą konfiguracji usługi możesz samodzielnie i w każdym
            czasie zmienić ustawienia dotyczące Cookies, określając warunki ich przechowywania i uzyskiwania dostępu przez
            Cookies do Twojego urządzenia. Szczegółowe informacje o możliwości i sposobach obsługi Cookies dostępne są
            w ustawieniach Twojego oprogramowania (przeglądarki internetowej).
          </p>
        </section>

      </div>
    </main>
  );
}
