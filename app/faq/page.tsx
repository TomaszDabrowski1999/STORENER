const items = [
  ["Jak długo trwa realizacja zamówienia?", "Standardowo zamówienia przygotowujemy w ciągu 1–2 dni roboczych."],
  ["Czy mogę zmienić dane po złożeniu zamówienia?", "Tak, skontaktuj się z obsługą klienta jak najszybciej po zakupie."],
  ["Gdzie sprawdzę status?", "Status zamówienia widoczny jest w panelu klienta oraz na stronie statusu zamówienia."],
];
export default function FaqPage() { return <main className="min-h-screen bg-gray-50"><section className="bg-white border-b"><div className="mx-auto max-w-5xl px-6 py-14"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00856f]">Pomoc</p><h1 className="mt-3 text-4xl font-bold">FAQ</h1><p className="mt-4 text-gray-600">Najczęstsze pytania klientów dotyczące zakupów, dostawy i płatności.</p></div></section><section className="mx-auto max-w-5xl px-6 py-10"><div className="space-y-4">{items.map(([q,a]) => <article key={q} className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">{q}</h2><p className="mt-3 leading-7 text-gray-600">{a}</p></article>)}</div></section></main>; }
