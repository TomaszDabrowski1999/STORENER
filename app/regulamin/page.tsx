export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-bold text-white">Regulamin</h1>

      <div className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-white/70">
        <section>
          <h2 className="mb-4 text-xl font-bold text-white">Regulamin sklepu internetowego STORENER</h2>
          <p className="text-sm leading-relaxed">
            Sklep internetowy dostępny pod adresem{" "}
            <a href="https://www.storener.pl" className="text-[#4caf3d] hover:underline">
              www.storener.pl
            </a>{" "}
            prowadzony jest przez Storener Natalia Dąbrowska, Gałęzewko 14, 88-420 Rogowo,
            NIP: 5621765581, REGON: 540792425.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Kontakt</h2>
          <div className="rounded-xl border border-white/8 bg-white/5 p-5 text-sm leading-relaxed">
            <p>Adres: Gałęzewko 14, 88-420 Rogowo</p>
            <p>
              E-mail:{" "}
              <a href="mailto:storener@interia.pl" className="text-[#4caf3d] hover:underline">
                storener@interia.pl
              </a>
            </p>
            <p>
              Telefon:{" "}
              <a href="tel:+48661377044" className="text-[#4caf3d] hover:underline">
                +48 661 377 044
              </a>
            </p>
            <p>Konto PKO BP PLN: 52 1020 1505 0000 0902 0288 1704</p>
          </div>
        </section>

        {/* 
          TODO: Wklej tutaj pełną treść regulaminu sklepu.
          Plik Word zawiera sekcje: DOSTAWA, PŁATNOŚĆ, REKLAMACJE, REGULAMIN, POLITYKA PRYWATNOŚCI, POLITYKA COOKIES.
          Pełna treść regulaminu (prawa i obowiązki stron, warunki sprzedaży itp.) powinna zostać uzupełniona w tym miejscu.
        */}
        <section>
          <p className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-400/80">
            Pełna treść regulaminu zostanie uzupełniona. Skontaktuj się z administratorem sklepu w celu dodania kompletnego tekstu regulaminu.
          </p>
        </section>
      </div>
    </main>
  );
}
