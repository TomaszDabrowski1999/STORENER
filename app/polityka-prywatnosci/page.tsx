export default function Page() {
  const email = "storener@interia.pl";

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-bold text-white">Polityka prywatności</h1>
      <p className="mt-2 text-sm text-white/40">wersja obowiązująca od dnia 11.06.2024</p>

      <div className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-white/70">

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Czym jest Polityka Prywatności?</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>Chcielibyśmy zapoznać Cię ze szczegółami przetwarzania przez nas Twoich danych osobowych, aby dać Ci pełną wiedzę i komfort w korzystaniu z naszej strony internetowej.</p>
            <p>W związku z tym, że sami działamy w branży internetowej, wiemy jak ważna jest ochrona Twoich danych osobowych. Dlatego dokładamy szczególnych starań, aby chronić Twoją prywatność i informacje, które nam przekazujesz.</p>
            <p>Starannie dobieramy i stosujemy odpowiednie środki techniczne, w szczególności te o charakterze programistycznym i organizacyjnym, zapewniające ochronę przetwarzanych danych osobowych. Nasza strona używa szyfrowanej transmisji danych (SSL), co zapewnia ochronę identyfikujących Cię danych.</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-white">Administrator danych osobowych</h2>
          <div className="rounded-xl border border-white/8 bg-white/5 p-5 text-sm leading-relaxed">
            <p className="mb-2">Administratorem strony internetowej <strong className="text-white">www.storener.pl</strong> jest:</p>
            <p className="font-semibold text-white">STORENER Natalia Dąbrowska</p>
            <p>Gałęzewko 14, 88-420 Rogowo</p>
            <p>NIP: 5621765581 | REGON: 540792425</p>
          </div>
          <div className="mt-4 rounded-xl border border-white/8 bg-white/5 p-5 text-sm leading-relaxed">
            <p className="mb-2 font-semibold text-white">Kontakt w sprawach danych osobowych:</p>
            <ul className="space-y-1">
              <li>e-mail: <a href={`mailto:${email}`} className="text-[#4caf3d] hover:underline">{email}</a></li>
              <li>poczta: Gałęzewko 14, 88-420 Rogowo</li>
              <li>telefon: <a href="tel:+48661377044" className="text-[#4caf3d] hover:underline">+48 661 377 044</a></li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Dane osobowe</h2>
          <p className="mb-4 text-sm leading-relaxed">
            Twoje dane osobowe są przez nas zbierane i przetwarzane zgodnie z przepisami Rozporządzenia Parlamentu
            Europejskiego i Rady (UE) 2016/679 z 27.04.2016 r. (RODO). W zakresie nieuregulowanym przez RODO
            przetwarzanie danych osobowych jest regulowane przez Ustawę o ochronie danych osobowych z dnia 10 maja 2018 r.
          </p>

          <div className="overflow-x-auto rounded-xl border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/5">
                  <th className="px-4 py-3 text-left font-semibold text-white">Cel</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Dane osobowe</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Czas przechowywania</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {[
                  ["Zawarcie i wykonanie umowy", "imię, nazwisko, adres, NIP, e-mail, telefon", "do upływu okresu przedawnienia roszczeń"],
                  ["Założenie i prowadzenie konta", "imię, nazwisko, e-mail, telefon, adres", "do upływu okresu przedawnienia roszczeń"],
                  ["Dodawanie opinii", "imię", "do momentu wniesienia sprzeciwu"],
                  ["Formularz kontaktowy", "imię, e-mail, telefon", "do momentu wniesienia sprzeciwu"],
                  ["Formularz „zapytaj o produkt"", "adres e-mail", "do momentu wniesienia sprzeciwu"],
                  ["Formularz „powiadom o dostępności"", "adres e-mail", "do momentu wniesienia sprzeciwu"],
                  ["Analiza ruchu na stronie", "adres IP, dane przeglądarki", "do momentu wniesienia sprzeciwu"],
                  ["Ustalenie, dochodzenie i egzekucja roszczeń", "imię, nazwisko, adres, PESEL, NIP, e-mail, telefon, IP, nr konta/karty", "do upływu okresu przedawnienia roszczeń"],
                  ["Wypełnienie obowiązków prawnych (podatkowych i rachunkowych)", "imię, nazwisko, NIP/REGON, e-mail, telefon, adres, nr karty", "do momentu wygaśnięcia obowiązków prawnych"],
                ].map(([cel, dane, czas]) => (
                  <tr key={cel} className="align-top">
                    <td className="px-4 py-3 font-medium text-white/80">{cel}</td>
                    <td className="px-4 py-3">{dane}</td>
                    <td className="px-4 py-3 text-white/50">{czas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Dobrowolność podania danych</h2>
          <p className="text-sm leading-relaxed">
            Podanie przez Ciebie wymaganych danych osobowych jest dobrowolne, ale stanowi warunek świadczenia przez nas
            usług na Twoją rzecz (np. założenia konta).
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Zautomatyzowane podejmowanie decyzji</h2>
          <p className="text-sm leading-relaxed">
            Nie podejmujemy wobec Ciebie decyzji w sposób zautomatyzowany ani nie stosujemy profilowania.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Przekazywanie danych poza EOG</h2>
          <p className="text-sm leading-relaxed">
            W celu korzystania z narzędzi Google, Twoje dane osobowe mogą być przekazywane do Stanów Zjednoczonych,
            gdzie znajdują się serwery Google LLC. Google LLC figuruje w wykazie podmiotów uczestniczących w programie
            Data Privacy Framework, w związku z czym ochrona danych osobowych jest adekwatna do regulacji obowiązujących
            w Unii Europejskiej.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Logowanie przez Google</h2>
          <p className="mb-4 text-sm leading-relaxed">
            Nasz sklep umożliwia zalogowanie do konta za pomocą Twojego konta Google. W takich wypadkach otrzymujemy
            Twoje dane osobowe od Google Ireland Ltd. Przetwarzamy wówczas: imię, nazwisko, wizerunek (na podstawie
            art. 6 ust. 1 lit. f) RODO) do momentu usunięcia konta w sklepie.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-white">Twoje prawa (RODO)</h2>
          <p className="mb-3 text-sm leading-relaxed">Na podstawie RODO masz prawo do:</p>
          <ul className="mb-4 space-y-1.5 text-sm leading-relaxed">
            {[
              "żądania dostępu do swoich danych osobowych (art. 15 RODO)",
              "żądania sprostowania swoich danych osobowych (art. 16 RODO)",
              "żądania usunięcia swoich danych osobowych – „prawo do bycia zapomnianym" (art. 17 RODO)",
              "żądania ograniczenia przetwarzania danych osobowych (art. 18 RODO)",
              "wniesienia sprzeciwu wobec przetwarzania danych osobowych (art. 21 RODO)",
              "żądania przenoszenia danych osobowych (art. 20 RODO)",
            ].map((right) => (
              <li key={right} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4caf3d]" />
                {right}
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed">
            Wszelkie żądania kieruj na adres:{" "}
            <a href={`mailto:${email}`} className="text-[#4caf3d] hover:underline">{email}</a>.
            Odpowiemy bez zbędnej zwłoki, nie później niż w terminie miesiąca od otrzymania żądania.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Skarga do organu nadzorczego</h2>
          <p className="text-sm leading-relaxed">
            Jeżeli sądzisz, że przetwarzanie Twoich danych osobowych narusza przepisy, masz prawo złożenia skargi do
            organu nadzorczego. W Polsce organem nadzorczym jest Prezes Urzędu Ochrony Danych Osobowych (UODO), który
            z dniem 25 maja 2018 roku zastąpił GIODO. Więcej informacji:{" "}
            <a
              href="https://uodo.gov.pl/pl/492/2464"
              target="_blank"
              rel="noreferrer"
              className="text-[#4caf3d] hover:underline"
            >
              uodo.gov.pl
            </a>
            .
          </p>
        </section>

      </div>
    </main>
  );
}
