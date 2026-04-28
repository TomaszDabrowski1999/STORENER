import { auth } from "../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/logowanie");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            panel użytkownika
          </p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">Moje konto</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            Zarządzaj profilem, hasłem i historią swoich zamówień z jednego
            miejsca.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                  profil
                </p>
                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  Dane użytkownika
                </h2>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-2xl font-bold text-white">
                {session.user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Imię i nazwisko</p>
                <p className="mt-2 text-lg font-semibold text-black">
                  {session.user.name}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-black">
                  {session.user.email}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:col-span-2">
                <p className="text-sm text-gray-500">ID użytkownika</p>
                <p className="mt-2 text-lg font-semibold text-black">
                  {session.user.id}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/konto/edycja"
                className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
              >
                Edytuj profil
              </Link>

              <Link
                href="/konto/haslo"
                className="rounded-xl border border-black px-5 py-3 font-medium text-black transition hover:bg-black hover:text-white"
              >
                Zmień hasło
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                szybkie akcje
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Zarządzanie kontem
              </h2>

              <div className="mt-6 space-y-3">
                <Link
                  href="/moje-zamowienia"
                  className="block rounded-2xl bg-black px-5 py-4 font-medium text-white transition hover:opacity-90"
                >
                  Moje zamówienia
                </Link>

                <Link
                  href="/forgot-password"
                  className="block rounded-2xl border border-gray-300 px-5 py-4 font-medium text-gray-900 transition hover:border-black"
                >
                  Reset hasła
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 p-8 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">
                konto premium
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                Masz pełen dostęp do swojego panelu
              </h2>
              <p className="mt-4 leading-8 text-gray-200">
                Możesz zarządzać danymi konta, śledzić swoje zamówienia,
                aktualizować hasło i korzystać z pełnego procesu zakupowego.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                sesja
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Bezpieczeństwo
              </h2>

              <p className="mt-4 leading-8 text-gray-600">
                Jeśli korzystasz z publicznego urządzenia, pamiętaj o
                wylogowaniu po zakończeniu pracy z kontem.
              </p>

              <div className="mt-6">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}