import Link from "next/link";
import { PackageSearch, ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen" style={{ background: "var(--surface)" }}>
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white" style={{ boxShadow: "var(--shadow-md)" }}>
          <PackageSearch className="h-9 w-9 text-gray-300" />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Błąd 404</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
          Nie znaleziono strony
        </h1>
        <p className="mx-auto mt-3 max-w-md text-gray-500">
          Strona, której szukasz, nie istnieje lub została przeniesiona. Sprawdź adres albo wróć do sklepu.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a1a1a]">
            <Home className="h-4 w-4" /> Strona główna
          </Link>
          <Link href="/produkty" className="inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-400" style={{ borderColor: "var(--border)" }}>
            Przeglądaj produkty <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
