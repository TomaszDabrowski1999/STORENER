import { auth } from "../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";
import { prisma } from "@/lib/prisma";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);

const statusLabels = {
  NOWE: "Nowe",
  W_REALIZACJI: "W realizacji",
  WYSLANE: "Wysłane",
};

const paymentLabels = {
  OCZEKUJE: "Oczekuje na płatność",
  OPLACONA: "Opłacone",
  NIEUDANA: "Nieudana płatność",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/logowanie");
  }

  const userId = Number(session.user.id);

  const [ordersCount, paidOrdersCount, totalSpent, latestOrders] =
    await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.count({ where: { userId, paymentStatus: "OPLACONA" } }),
      prisma.order.aggregate({
        where: { userId },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      }),
    ]);

  const initials =
    session.user.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
              panel klienta
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
              Witaj, {session.user.name || "Kliencie"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Zarządzaj zamówieniami, danymi konta, bezpieczeństwem i szybkim
              dostępem do najważniejszych funkcji sklepu.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-950 text-xl font-black text-white">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-950">
                  {session.user.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">{session.user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
            menu konta
          </p>
          <nav className="space-y-2">
            <Link className="block rounded-2xl bg-gray-950 px-4 py-3 font-semibold text-white" href="/konto">
              Panel główny
            </Link>
            <Link className="block rounded-2xl px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950" href="/moje-zamowienia">
              Moje zamówienia
            </Link>
            <Link className="block rounded-2xl px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950" href="/konto/edycja">
              Dane osobowe
            </Link>
            <Link className="block rounded-2xl px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950" href="/konto/haslo">
              Hasło i bezpieczeństwo
            </Link>
            <Link className="block rounded-2xl px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950" href="/produkty">
              Kontynuuj zakupy
            </Link>
          </nav>
          <div className="mt-5 border-t border-gray-100 pt-5">
            <LogoutButton />
          </div>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Wszystkie zamówienia</p>
              <p className="mt-3 text-4xl font-black text-gray-950">{ordersCount}</p>
              <p className="mt-2 text-sm text-gray-500">Historia zakupów na koncie</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Opłacone zamówienia</p>
              <p className="mt-3 text-4xl font-black text-gray-950">{paidOrdersCount}</p>
              <p className="mt-2 text-sm text-gray-500">Zamówienia z potwierdzoną płatnością</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Łączna wartość zakupów</p>
              <p className="mt-3 text-3xl font-black text-gray-950">
                {formatPrice(totalSpent._sum.total || 0)}
              </p>
              <p className="mt-2 text-sm text-gray-500">Suma zamówień z konta</p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                    zakupy
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-950">
                    Ostatnie zamówienia
                  </h2>
                </div>
                <Link href="/moje-zamowienia" className="rounded-2xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-950 transition hover:border-gray-950">
                  Zobacz wszystkie
                </Link>
              </div>

              {latestOrders.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-950">Nie masz jeszcze zamówień</h3>
                  <p className="mt-2 text-gray-600">Po zakupie znajdziesz tutaj status, płatność i szczegóły dostawy.</p>
                  <Link href="/produkty" className="mt-5 inline-flex rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:opacity-90">
                    Przejdź do produktów
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {latestOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/zamowienia/${order.id}`}
                      className="block rounded-3xl border border-gray-200 p-5 transition hover:border-gray-950 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-black text-gray-950">Zamówienie #{order.id}</h3>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                              {statusLabels[order.status]}
                            </span>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                              {paymentLabels[order.paymentStatus]}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            {formatDate(order.createdAt)} • {order.items.length} produkt(y)
                          </p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-sm text-gray-500">Razem</p>
                          <p className="text-xl font-black text-gray-950">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                  dane konta
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-950">Profil klienta</h2>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Imię i nazwisko</p>
                    <p className="mt-1 font-semibold text-gray-950">{session.user.name}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Adres e-mail</p>
                    <p className="mt-1 break-all font-semibold text-gray-950">{session.user.email}</p>
                  </div>
                </div>
                <Link href="/konto/edycja" className="mt-5 inline-flex w-full justify-center rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:opacity-90">
                  Zmień dane
                </Link>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-950 to-gray-800 p-6 text-white shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-300">
                  bezpieczeństwo
                </p>
                <h2 className="mt-2 text-2xl font-bold">Chroń swoje konto</h2>
                <p className="mt-3 text-sm leading-6 text-gray-300">
                  Regularnie aktualizuj hasło i wyloguj się po zakupach na obcym urządzeniu.
                </p>
                <Link href="/konto/haslo" className="mt-5 inline-flex w-full justify-center rounded-2xl bg-white px-5 py-3 font-bold text-gray-950 transition hover:bg-gray-100">
                  Zmień hasło
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
