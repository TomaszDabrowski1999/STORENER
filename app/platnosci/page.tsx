export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-bold text-white">Płatności</h1>

      <div className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-white/70">
        <section>
          <h2 className="mb-4 text-xl font-bold text-white">Zaufane metody płatności</h2>
          <p className="leading-relaxed">
            W naszym sklepie internetowym oferujemy różnorodne metody płatności, abyś mógł wybrać tę,
            która jest dla Ciebie najwygodniejsza i najbezpieczniejsza. Współpracujemy z zaufanymi
            dostawcami usług płatniczych, co gwarantuje bezpieczeństwo każdej transakcji.
          </p>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-bold text-white">Dostępne metody płatności</h2>
          <div className="space-y-5">
            <div className="rounded-xl border border-white/8 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Karta Kredytowa / Debetowa</h3>
              <p className="mt-2 text-sm leading-relaxed">
                Akceptujemy wszystkie główne karty kredytowe i debetowe, w tym Visa, MasterCard oraz
                American Express.
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Przelew Bankowy</h3>
              <p className="mt-2 text-sm leading-relaxed">
                Możliwość dokonania tradycyjnego przelewu bankowego.
              </p>
              <div className="mt-3 rounded-lg bg-white/5 p-3 text-sm">
                <p className="text-white/50">Konto PKO BP PLN:</p>
                <p className="mt-1 font-mono font-semibold text-white/80">52 1020 1505 0000 0902 0288 1704</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/5 p-5">
              <h3 className="font-semibold text-white">BLIK</h3>
              <p className="mt-2 text-sm leading-relaxed">
                Szybka i wygodna płatność za pomocą kodu BLIK.
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/5 p-5">
              <h3 className="font-semibold text-white">PayPal</h3>
              <p className="mt-2 text-sm leading-relaxed">
                Bezpieczne płatności online za pośrednictwem konta PayPal.
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Płatności Mobilne</h3>
              <p className="mt-2 text-sm leading-relaxed">
                Apple Pay, Google Pay.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
