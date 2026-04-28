import { CreditCard, Handshake, LifeBuoy, Truck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0f1118] text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 border-b border-white/10 py-12 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-400">
              <Truck className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                Szybka wysyłka
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Sprawna realizacja zamówień i szybka dostawa produktów.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-400">
              <CreditCard className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                Bezpieczne płatności
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Wygodne formy płatności online i bezpieczny proces zamówienia.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-400">
              <LifeBuoy className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                Obsługa klienta
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Szybki kontakt, pomoc i wsparcie przy zakupach.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-400">
              <Handshake className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                Partnerstwo
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Rozwijamy współprace i budujemy nowoczesny sklep online.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 border-b border-white/10 py-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Płatności
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white">
              Obsługiwane metody płatności
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              W sklepie możesz korzystać z wygodnych i popularnych metod płatności
              online.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">
            <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm">
              Apple Pay
            </span>
            <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm">
              Google Pay
            </span>
            <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm">
              BLIK
            </span>
            <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              VISA
            </span>
            <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-500 shadow-sm">
              Mastercard
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} STORENER. Wszelkie prawa zastrzeżone.</p>

          <div className="flex flex-wrap gap-4">
            <Link href="/" className="transition hover:text-white">
              Start
            </Link>
            <Link href="/konto" className="transition hover:text-white">
              Konto
            </Link>
            <Link href="/koszyk" className="transition hover:text-white">
              Koszyk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}