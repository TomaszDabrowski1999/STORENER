import { ShieldCheck } from "lucide-react";
import InfoPage, { InfoCard, InfoBox, Bullets } from "../../components/InfoPage";

export const metadata = { title: "Polityka prywatności" };

const email = "storener@interia.pl";

const tableRows: [string, string, string][] = [
  ["Zawarcie i wykonanie umowy", "imię, nazwisko, adres, NIP, e-mail, telefon", "do upływu okresu przedawnienia roszczeń"],
  ["Założenie i prowadzenie konta", "imię, nazwisko, e-mail, telefon, adres", "do upływu okresu przedawnienia roszczeń"],
  ["Dodawanie opinii", "imię", "do momentu wniesienia sprzeciwu"],
  ["Formularz kontaktowy", "imię, e-mail, telefon", "do momentu wniesienia sprzeciwu"],
  ["Formularz zapytaj o produkt", "adres e-mail", "do momentu wniesienia sprzeciwu"],
  ["Formularz powiadom o dostępności", "adres e-mail", "do momentu wniesienia sprzeciwu"],
  ["Analiza ruchu na stronie", "adres IP, dane przeglądarki", "do momentu wniesienia sprzeciwu"],
  ["Ustalenie, dochodzenie i egzekucja roszczeń", "imię, nazwisko, adres, PESEL, NIP, e-mail, telefon, IP, nr konta/karty", "do upływu okresu przedawnienia roszczeń"],
  ["Wypełnienie obowiązków prawnych (podatkowych i rachunkowych)", "imię, nazwisko, NIP/REGON, e-mail, telefon, adres, nr karty", "do momentu wygaśnięcia obowiązków prawnych"],
];

export default function Page() {
  return (
    <InfoPage
      eyebrow="Dokumenty"
      title="Polityka prywatności"
      icon={ShieldCheck}
      meta="wersja obowiązująca od dnia 11.06.2024"
      subtitle="Wyjaśniamy, jakie dane zbieramy, w jakim celu i jakie prawa Ci przysługują."
    >
      <InfoCard title="Czym jest Polityka Prywatności?">
        <div className="space-y-3 leading-relaxed text-gray-600">
          <p>Chcielibyśmy zapoznać Cię ze szczegółami przetwarzania przez nas Twoich danych osobowych, aby dać Ci pełną wiedzę i komfort w korzystaniu z naszej strony internetowej.</p>
          <p>W związku z tym, że sami działamy w branży internetowej, wiemy jak ważna jest ochrona Twoich danych osobowych. Dlatego dokładamy szczególnych starań, aby chronić Twoją prywatność i informacje, które nam przekazujesz.</p>
          <p>Starannie dobieramy i stosujemy odpowiednie środki techniczne, w szczególności te o charakterze programistycznym i organizacyjnym, zapewniające ochronę przetwarzanych danych osobowych. Nasza strona używa szyfrowanej transmisji danych (SSL), co zapewnia ochronę identyfikujących Cię danych.</p>
        </div>
      </InfoCard>

      <InfoCard title="Administrator danych osobowych">
        <InfoBox className="leading-relaxed text-gray-600">
          <p className="mb-2">Administratorem strony internetowej <strong className="text-[#0a0a0a]">www.storener.pl</strong> jest:</p>
          <p className="font-semibold text-[#0a0a0a]">STORENER Natalia Dąbrowska</p>
          <p>Gałęzewko 14, 88-420 Rogowo</p>
          <p>NIP: 5621765581 | REGON: 540792425</p>
        </InfoBox>
        <InfoBox className="mt-4 leading-relaxed text-gray-600">
          <p className="mb-2 font-semibold text-[#0a0a0a]">Kontakt w sprawach danych osobowych:</p>
          <ul className="space-y-1">
            <li>e-mail: <a href={`mailto:${email}`} className="font-medium text-[#3a9a2c] hover:underline">{email}</a></li>
            <li>poczta: Gałęzewko 14, 88-420 Rogowo</li>
            <li>telefon: <a href="tel:+48661377044" className="font-medium text-[#3a9a2c] hover:underline">+48 661 377 044</a></li>
          </ul>
        </InfoBox>
      </InfoCard>

      <InfoCard title="Dane osobowe">
        <p className="mb-5 leading-relaxed text-gray-600">
          Twoje dane osobowe są przez nas zbierane i przetwarzane zgodnie z przepisami Rozporządzenia Parlamentu
          Europejskiego i Rady (UE) 2016/679 z 27.04.2016 r. (RODO). W zakresie nieuregulowanym przez RODO
          przetwarzanie danych osobowych jest regulowane przez Ustawę o ochronie danych osobowych z dnia 10 maja 2018 r.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[#e8e8e6]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f7f5] text-left">
                <th className="px-4 py-3 font-semibold text-[#0a0a0a]">Cel</th>
                <th className="px-4 py-3 font-semibold text-[#0a0a0a]">Dane osobowe</th>
                <th className="px-4 py-3 font-semibold text-[#0a0a0a]">Czas przechowywania</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeec]">
              {tableRows.map(([cel, dane, czas]) => (
                <tr key={cel} className="align-top">
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{cel}</td>
                  <td className="px-4 py-3 text-gray-600">{dane}</td>
                  <td className="px-4 py-3 text-gray-500">{czas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InfoCard>

      <InfoCard title="Dobrowolność podania danych">
        <p className="leading-relaxed text-gray-600">
          Podanie przez Ciebie wymaganych danych osobowych jest dobrowolne, ale stanowi warunek świadczenia przez nas
          usług na Twoją rzecz (np. założenia konta).
        </p>
      </InfoCard>

      <InfoCard title="Zautomatyzowane podejmowanie decyzji">
        <p className="leading-relaxed text-gray-600">
          Nie podejmujemy wobec Ciebie decyzji w sposób zautomatyzowany ani nie stosujemy profilowania.
        </p>
      </InfoCard>

      <InfoCard title="Przekazywanie danych poza EOG">
        <p className="leading-relaxed text-gray-600">
          W celu korzystania z narzędzi Google, Twoje dane osobowe mogą być przekazywane do Stanów Zjednoczonych,
          gdzie znajdują się serwery Google LLC. Google LLC figuruje w wykazie podmiotów uczestniczących w programie
          Data Privacy Framework, w związku z czym ochrona danych osobowych jest adekwatna do regulacji obowiązujących
          w Unii Europejskiej.
        </p>
      </InfoCard>

      <InfoCard title="Logowanie przez Google">
        <p className="leading-relaxed text-gray-600">
          Nasz sklep umożliwia zalogowanie do konta za pomocą Twojego konta Google. W takich wypadkach otrzymujemy
          Twoje dane osobowe od Google Ireland Ltd. Przetwarzamy wówczas: imię, nazwisko, wizerunek (na podstawie
          art. 6 ust. 1 lit. f RODO) do momentu usunięcia konta w sklepie.
        </p>
      </InfoCard>

      <InfoCard title="Twoje prawa (RODO)">
        <p className="mb-3 leading-relaxed text-gray-600">Na podstawie RODO masz prawo do:</p>
        <Bullets
          items={[
            "żądania dostępu do swoich danych osobowych (art. 15 RODO)",
            "żądania sprostowania swoich danych osobowych (art. 16 RODO)",
            "żądania usunięcia swoich danych osobowych – prawo do bycia zapomnianym (art. 17 RODO)",
            "żądania ograniczenia przetwarzania danych osobowych (art. 18 RODO)",
            "wniesienia sprzeciwu wobec przetwarzania danych osobowych (art. 21 RODO)",
            "żądania przenoszenia danych osobowych (art. 20 RODO)",
          ]}
        />
        <p className="mt-4 leading-relaxed text-gray-600">
          Wszelkie żądania kieruj na adres:{" "}
          <a href={`mailto:${email}`} className="font-medium text-[#3a9a2c] hover:underline">{email}</a>.
          Odpowiemy bez zbędnej zwłoki, nie później niż w terminie miesiąca od otrzymania żądania.
        </p>
      </InfoCard>

      <InfoCard title="Skarga do organu nadzorczego">
        <p className="leading-relaxed text-gray-600">
          Jeżeli sądzisz, że przetwarzanie Twoich danych osobowych narusza przepisy, masz prawo złożenia skargi do
          organu nadzorczego. W Polsce organem nadzorczym jest Prezes Urzędu Ochrony Danych Osobowych (UODO), który
          z dniem 25 maja 2018 roku zastąpił GIODO. Więcej informacji:{" "}
          <a
            href="https://uodo.gov.pl/pl/492/2464"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#3a9a2c] hover:underline"
          >
            uodo.gov.pl
          </a>
          .
        </p>
      </InfoCard>
    </InfoPage>
  );
}
