export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4caf3d]">Obsługa klienta</p>
          <h1 className="mt-3 text-4xl font-bold">Kontakt</h1>
          <p className="mt-4 text-gray-600">Masz pytanie o zamówienie, produkt albo zwrot? Skontaktuj się z nami.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-10 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Dane kontaktowe</h2>
          <div className="mt-4 space-y-2 text-gray-600">
            <p className="font-semibold text-gray-900">Storener – Natalia Dąbrowska</p>
            <p>Gałęzewko 14, 88-420 Rogowo</p>
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
            <p className="pt-1 text-sm text-gray-500">Godziny obsługi: pon.–pt. 9:00–17:00</p>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">Dane firmy</p>
            <p>NIP: 5621765581</p>
            <p>REGON: 540792425</p>
            <p>Konto PKO BP PLN:</p>
            <p className="font-mono text-xs">52 1020 1505 0000 0902 0288 1704</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Przed kontaktem</h2>
          <p className="mt-4 leading-7 text-gray-600">
            Przygotuj numer zamówienia oraz adres e-mail użyty podczas zakupów. Ułatwi to szybką obsługę sprawy.
          </p>
          <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">Adres do reklamacji i zwrotów</p>
            <p className="mt-2">Natalia Dąbrowska</p>
            <p>Gałęzewko 14, 88-420 Rogowo</p>
            <p>Polska</p>
          </div>
        </div>
      </section>
    </main>
  );
}
