import {
  CreditCard,
  Handshake,
  LifeBuoy,
  Truck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0f1118] text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 border-b border-white/10 py-12 md:grid-cols-2 xl:grid-cols-4">
          <FooterBox
            Icon={Truck}
            title="Szybka wysyłka"
            text="Sprawna realizacja zamówień i szybka dostawa produktów."
          />
          <FooterBox
            Icon={CreditCard}
            title="Bezpieczne płatności"
            text="Wygodne formy płatności online i bezpieczny proces zamówienia."
          />
          <FooterBox
            Icon={LifeBuoy}
            title="Obsługa klienta"
            text="Szybki kontakt, pomoc i wsparcie przy zakupach."
          />
          <FooterBox
            Icon={Handshake}
            title="Partnerstwo"
            text="Rozwijamy współprace i budujemy nowoczesny sklep online."
          />
        </div>

        <div className="grid gap-10 border-b border-white/10 py-10 lg:grid-cols-[1fr_1fr_1.45fr] lg:items-start">
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-white">
              DOSTAWA I PŁATNOŚCI
            </h3>

            <ul className="space-y-3 text-sm text-white/60">
              <FooterLink href="/dostawa">Dostawa</FooterLink>
              <FooterLink href="/platnosci">Płatności</FooterLink>
              <FooterLink href="/reklamacje">Reklamacje</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-white">
              PRAWNE
            </h3>

            <ul className="space-y-3 text-sm text-white/60">
              <FooterLink href="/regulamin">Regulamin</FooterLink>
              <FooterLink href="/polityka-prywatnosci">
                Polityka prywatności
              </FooterLink>
              <FooterLink href="/polityka-cookies">Polityka cookies</FooterLink>
            </ul>
          </div>

          <div className="rounded-2xl bg-[#0f1118] p-0">
  <img
    src="/przelewy24.png"
    alt="Płatności obsługiwane przez Przelewy24"
    className="h-auto w-full scale-140 object-contain"
  />
</div>
        </div>

        <div className="flex flex-col gap-4 py-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} STORENER. Wszelkie prawa zastrzeżone.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/" className="transition hover:text-[#4caf3d]">
              Start
            </Link>
            <Link href="/konto" className="transition hover:text-[#4caf3d]">
              Konto
            </Link>
            <Link href="/koszyk" className="transition hover:text-[#4caf3d]">
              Koszyk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterBox({ Icon, title, text }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-2xl border border-[#4caf3d]/20 bg-[#4caf3d]/10 p-3 text-[#4caf3d]">
        <Icon className="h-7 w-7" />
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
      </div>
    </div>
  );
}

function FooterLink({ href, children }: any) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 transition hover:text-[#4caf3d]"
      >
        <ChevronRight className="h-4 w-4 text-[#4caf3d]/70 transition group-hover:translate-x-1" />
        {children}
      </Link>
    </li>
  );
}