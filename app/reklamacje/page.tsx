export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-bold text-white">Reklamacje</h1>

      <div className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-white/70">

        <section>
          <h2 className="mb-4 text-xl font-bold text-white">Adres do reklamacji</h2>
          <div className="rounded-xl border border-white/8 bg-white/5 p-5">
            <p className="font-semibold text-white">Natalia Dąbrowska</p>
            <p className="mt-1">Gałęzewko 14, 88-420 Rogowo</p>
            <p>Polska</p>
            <p className="mt-2">
              E-mail:{" "}
              <a href="mailto:storener@interia.pl" className="text-[#4caf3d] hover:underline">
                storener@interia.pl
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-white">Procedura reklamacyjna</h2>
          <ol className="space-y-3 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4caf3d]/20 text-xs font-bold text-[#4caf3d]">1</span>
              <span>W przypadku wystąpienia wady zakupionego u Sprzedawcy towaru Klient ma prawo do reklamacji.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4caf3d]/20 text-xs font-bold text-[#4caf3d]">2</span>
              <span>Reklamację należy zgłosić pisemnie lub drogą elektroniczną na podany adres Sprzedawcy lub przy wykorzystaniu elektronicznego formularza reklamacyjnego udostępnianego przez Sprzedawcę na jednej z podstron Sklepu.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4caf3d]/20 text-xs font-bold text-[#4caf3d]">3</span>
              <span>Zaleca się, aby w reklamacji zawrzeć m.in. zwięzły opis wady, okoliczności (w tym datę) jej wystąpienia, dane Klienta składającego reklamację oraz żądanie Klienta w związku z wadą towaru.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4caf3d]/20 text-xs font-bold text-[#4caf3d]">4</span>
              <span>Sprzedawca ustosunkuje się do żądania reklamacyjnego niezwłocznie, nie później niż w terminie 14 dni, a jeśli nie zrobi tego w tym terminie, uważa się, że żądanie Klienta uznał za uzasadnione.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4caf3d]/20 text-xs font-bold text-[#4caf3d]">5</span>
              <span>Towary odsyłane w ramach procedury reklamacyjnej należy wysyłać na podany powyżej adres. Storener gwarantuje sprawne działanie sprzedawanego przez siebie produktu na okres podany w treści zakładki „Reklamacje".</span>
            </li>
          </ol>
          <div className="mt-4 space-y-2 rounded-xl border border-white/8 bg-white/5 p-5 text-sm leading-relaxed">
            <p>Okres reklamacji rozpoczyna się od daty dostarczenia produktu.</p>
            <p>Wady lub uszkodzenia sprzętu ujawnione w okresie reklamacji będą bezpłatnie usuwane w ciągu 14 dni roboczych od daty dostarczenia sprzętu do punktu sprzedaży.</p>
            <p>Reklamujący jest zobowiązany do dostarczenia towaru do siedziby sprzedawcy.</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-white">Gwarancja</h2>
          <div className="rounded-xl border border-white/8 bg-white/5 p-5 text-sm leading-relaxed">
            <p className="mb-3 font-semibold text-white">Okres gwarancji dla przedsiębiorców: 3 miesiące</p>
            <ol className="space-y-2">
              <li>1. Umową Sprzedaży objęte są nowe Produkty. Na stronach Sklepu szczegółowo opisany jest stan każdego produktu.</li>
              <li>2. Sprzedawca jest obowiązany dostarczyć Klientowi rzecz wolną od wad.</li>
              <li>3. W przypadku, gdy na Produkt została udzielona gwarancja, informacja o niej oraz jej treść będą zawarte przy produkcie.</li>
            </ol>
          </div>

          <div className="mt-4 rounded-xl border border-white/8 bg-white/5 p-5 text-sm">
            <p className="mb-3 font-semibold text-white">Gwarancją nie są objęte uszkodzenia sprzętu powstałe w wyniku:</p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4caf3d]" />uszkodzeń mechanicznych i wywołanych nimi wad</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4caf3d]" />niewłaściwego użytkowania i przechowywania sprzętu</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4caf3d]" />niewłaściwej konserwacji</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4caf3d]" />dokonywania samodzielnych napraw, przeróbek lub zmian konstrukcyjnych</li>
            </ul>
          </div>
        </section>

      </div>
    </main>
  );
}
