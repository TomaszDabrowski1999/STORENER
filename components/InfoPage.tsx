import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Spójny układ dla wszystkich zakładek informacyjnych ze stopki.
   Ciemny hero (kontynuacja navbara) + jasne, czytelne karty treści.
   ───────────────────────────────────────────────────────────── */

type InfoPageProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  meta?: string;
  children: React.ReactNode;
  contentClassName?: string;
};

export default function InfoPage({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  meta,
  children,
  contentClassName = "space-y-6",
}: InfoPageProps) {
  return (
    <main className="min-h-screen bg-[#f4f4f2]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0a0a] text-white">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#4caf3d]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#4caf3d]/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 pb-14 pt-9">
          {/* Okruszki */}
          <nav className="mb-9 flex items-center gap-1.5 text-xs font-medium text-white/40">
            <Link href="/" className="transition hover:text-white/75">Start</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/75">{title}</span>
          </nav>

          <div className="flex items-start gap-5">
            {Icon && (
              <div className="hidden shrink-0 rounded-2xl bg-[#4caf3d]/15 p-3.5 text-[#4caf3d] ring-1 ring-inset ring-[#4caf3d]/25 sm:block">
                <Icon className="h-7 w-7" />
              </div>
            )}
            <div>
              {eyebrow && (
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#4caf3d]">
                  {eyebrow}
                </p>
              )}
              <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
              {meta && <p className="mt-3 text-sm text-white/40">{meta}</p>}
              {subtitle && (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Treść */}
      <div className={`mx-auto max-w-4xl px-6 py-10 md:py-12 ${contentClassName}`}>
        {children}
      </div>
    </main>
  );
}

/* ── Biała karta z opcjonalnym tytułem ── */
export function InfoCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-[#e8e8e6] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] md:p-8 ${className}`}
    >
      {title && <h2 className="mb-5 text-xl font-bold text-[#0a0a0a]">{title}</h2>}
      {children}
    </section>
  );
}

/* ── Wcięte, wyróżnione pole (adresy, numery konta itp.) ── */
export function InfoBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-[#ecece9] bg-[#f7f7f5] p-5 ${className}`}>
      {children}
    </div>
  );
}

/* ── Lista z zielonymi kropkami ── */
export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 leading-relaxed text-gray-600">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4caf3d]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Numerowane kroki w zielonych kółkach ── */
export function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 leading-relaxed text-gray-600">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4caf3d]/12 text-sm font-bold text-[#4caf3d]">
            {i + 1}
          </span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  );
}
