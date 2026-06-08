import { auth } from "../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";
import { prisma } from "@/lib/prisma";
import { Package, CreditCard, User, Lock, ShoppingBag, ArrowRight, ChevronRight, Wallet } from "lucide-react";

const formatPrice = (v: number) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(v);
const formatDate = (v: Date) => new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "short", year: "numeric" }).format(v);

const statusLabels: Record<string, string> = { NOWE: "Nowe", W_REALIZACJI: "W realizacji", WYSLANE: "Wysłane" };
const statusColors: Record<string, string> = {
  NOWE: "bg-blue-50 text-blue-700 border-blue-100",
  W_REALIZACJI: "bg-amber-50 text-amber-700 border-amber-100",
  WYSLANE: "bg-green-50 text-green-700 border-green-100",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/logowanie");

  const userId = Number(session.user.id);

  const [ordersCount, paidOrdersCount, totalSpentData, latestOrders] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.order.count({ where: { userId, paymentStatus: "OPLACONA" } }),
    prisma.order.aggregate({ where: { userId }, _sum: { total: true } }),
    prisma.order.findMany({
      where: { userId }, orderBy: { createdAt: "desc" }, take: 3,
      include: { items: { include: { product: { select: { name: true, image: true } } } } },
    }),
  ]);

  const totalSpent = totalSpentData._sum.total || 0;
  const initials = session.user.name?.split(" ").filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join("") || "U";

  return (
    <main className="min-h-screen" style={{ background: "var(--surface)" }}>
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a0a0a] text-xl font-bold text-white" style={{ fontFamily: "'Syne', system-ui" }}>
              {initials}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4caf3d]">Panel klienta</p>
              <h1 className="text-2xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
                Witaj, {session.user.name?.split(" ")[0] || "Kliencie"}
              </h1>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="h-fit space-y-3">
            <div className="rounded-2xl bg-white p-3" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Menu konta</p>
              <nav className="space-y-0.5">
                {[
                  { href: "/konto", label: "Panel główny", icon: User, active: true },
                  { href: "/moje-zamowienia", label: "Moje zamówienia", icon: Package },
                  { href: "/konto/edycja", label: "Dane osobowe", icon: User },
                  { href: "/konto/haslo", label: "Hasło i bezpieczeństwo", icon: Lock },
                  { href: "/produkty", label: "Kontynuuj zakupy", icon: ShoppingBag },
                ].map(({ href, label, icon: Icon, active }) => (
                  <Link key={href} href={href} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-[#0a0a0a] text-white" : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"}`}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-2 border-t pt-2" style={{ borderColor: "var(--border)" }}>
                <LogoutButton />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Zamówienia", value: ordersCount, icon: Package, accent: "bg-blue-50 text-blue-600" },
                { label: "Opłacone", value: paidOrdersCount, icon: CreditCard, accent: "bg-green-50 text-green-600" },
                { label: "Wydano", value: formatPrice(totalSpent), icon: Wallet, accent: "bg-purple-50 text-purple-600" },
              ].map(({ label, value, icon: Icon, accent }) => (
                <div key={label} className="rounded-2xl bg-white p-5" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                  <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
                    <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                  </div>
                  <p className="text-xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>{value}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="rounded-2xl bg-white" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
              <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
                <h2 className="font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Ostatnie zamówienia</h2>
                <Link href="/moje-zamowienia" className="flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-gray-900">
                  Wszystkie <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {latestOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-200" />
                  <p className="font-semibold text-gray-700">Brak zamówień</p>
                  <p className="mt-1 text-sm text-gray-400">Złóż pierwsze zamówienie!</p>
                  <Link href="/produkty" className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0a0a0a] px-5 py-2.5 text-sm font-semibold text-white">
                    Przeglądaj produkty <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {latestOrders.map((order) => (
                    <Link key={order.id} href={`/zamowienia/${order.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50/60">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">#{order.id}</span>
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColors[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-400">{formatDate(order.createdAt)} · {order.items.length} szt.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-gray-950">{formatPrice(order.total)}</span>
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Account cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                  <User className="h-4.5 w-4.5 h-[18px] w-[18px] text-gray-600" />
                </div>
                <h3 className="mt-3 font-bold text-gray-950">Dane osobowe</h3>
                <p className="mt-1 text-sm text-gray-500">{session.user.name}</p>
                <p className="text-sm text-gray-400 truncate">{session.user.email}</p>
                <Link href="/konto/edycja" className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-800 hover:text-gray-900" style={{ borderColor: "var(--border)" }}>
                  Edytuj dane <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl bg-[#0a0a0a] p-5 text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Lock className="h-[18px] w-[18px] text-white" />
                </div>
                <h3 className="mt-3 font-bold">Bezpieczeństwo</h3>
                <p className="mt-1 text-sm text-white/60">Regularnie aktualizuj swoje hasło.</p>
                <Link href="/konto/haslo" className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-sm font-bold text-[#0a0a0a] transition hover:bg-gray-100">
                  Zmień hasło <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
