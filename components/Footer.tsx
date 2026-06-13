import { Truck, CreditCard, LifeBuoy, ShieldCheck, ChevronRight, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">
      {/* Trust bar */}
      <div className="border-b border-white/6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-0 divide-x divide-white/6 lg:grid-cols-4">
            {[
              { Icon: Truck,       title: "Szybka wysyłka",       sub: "Realizacja w 24–48h" },
              { Icon: ShieldCheck, title: "Bezpieczne zakupy",    sub: "Szyfrowane płatności" },
              { Icon: CreditCard,  title: "Wygodne płatności",    sub: "BLIK, karta, przelew" },
              { Icon: LifeBuoy,    title: "Obsługa klienta",      sub: "Pon–Pt 9:00–17:00" },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4 px-6 py-6">
                <div className="shrink-0 rounded-xl bg-[#4caf3d]/10 p-2.5 text-[#4caf3d]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-xs text-white/45">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-12 lg:grid-cols-[1.8fr_1fr_1fr_1.4fr]">
          {/* Brand */}
          <div>
            <img src="/storener-logo.png" alt="STORENER" className="h-auto w-[140px] object-contain brightness-200" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              Sklep internetowy z produktami do domu, ogrodu, motoryzacji i dla zwierząt.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <a href="mailto:storener@interia.pl" className="flex items-center gap-2.5 text-sm text-white/45 transition hover:text-white/80">
                <Mail className="h-4 w-4 text-[#4caf3d]" />
                storener@interia.pl
              </a>
              <a href="tel:+48661377044" className="flex items-center gap-2.5 text-sm text-white/45 transition hover:text-white/80">
                <Phone className="h-4 w-4 text-[#4caf3d]" />
                +48 661 377 044
              </a>
            </div>
          </div>

          {/* Dostawa */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/30">
              Dostawa i płatności
            </h3>
            <ul className="space-y-3">
              {[
                ["Dostawa", "/dostawa"],
                ["Płatności", "/platnosci"],
                ["Reklamacje", "/reklamacje"],
                ["Zwroty i wymiany", "/zwroty"],
                ["Status zamówienia", "/status-zamowienia"],
              ].map(([label, href]) => (
                <FooterLink key={href} href={href}>{label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Prawne */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/30">
              Informacje
            </h3>
            <ul className="space-y-3">
              {[
                ["Regulamin", "/regulamin"],
                ["Polityka prywatności", "/polityka-prywatnosci"],
                ["Polityka cookies", "/polityka-cookies"],
                ["FAQ", "/faq"],
                ["Kontakt", "/kontakt"],
              ].map(([label, href]) => (
                <FooterLink key={href} href={href}>{label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/30">
              Akceptowane płatności
            </h3>
            <div className="rounded-2xl bg-white/5 p-4">
              <img
                src="/przelewy24.png"
                alt="Przelewy24"
                className="h-auto w-full max-w-[280px] object-contain opacity-75 transition hover:opacity-100"
              />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/30">
              Wszystkie transakcje są szyfrowane i bezpieczne. Obsługujemy BLIK, karty płatnicze i przelewy bankowe.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-xs text-white/30 md:flex-row">
          <p>© {new Date().getFullYear()} STORENER. Wszelkie prawa zastrzeżone.</p>
          <div className="flex items-center gap-5">
            {[["Start", "/"], ["Produkty", "/produkty"], ["Konto", "/konto"], ["Koszyk", "/koszyk"]].map(([l, h]) => (
              <Link key={h} href={h} className="transition hover:text-white/70">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="group flex items-center gap-2 text-sm text-white/50 transition hover:text-white/90">
        <ChevronRight className="h-3.5 w-3.5 text-[#4caf3d]/60 transition-transform group-hover:translate-x-0.5" />
        {children}
      </Link>
    </li>
  );
}
