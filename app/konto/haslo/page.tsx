"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import UserGuard from "../../../components/UserGuard";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const passwordStrength = (() => {
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9]/.test(newPassword)) score += 1;
    return score;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Uzupełnij wszystkie pola");
      toast.error("Uzupełnij wszystkie pola");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Nowe hasła nie są takie same");
      toast.error("Nowe hasła nie są takie same");
      return;
    }

    const toastId = toast.loading("Aktualizowanie hasła...");

    try {
      setIsSaving(true);

      const response = await fetch("/api/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Nie udało się zmienić hasła");
        toast.error(data.error || "Nie udało się zmienić hasła", { id: toastId });
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Hasło zostało zmienione");
      toast.success("Hasło zostało zmienione", { id: toastId });
    } catch {
      setError("Wystąpił błąd połączenia");
      toast.error("Wystąpił błąd połączenia", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UserGuard>
      <main className="min-h-screen bg-[#f3f4f6]">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
              panel klienta
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
              Hasło i bezpieczeństwo
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Zmień hasło do konta i zadbaj o bezpieczeństwo swoich danych oraz zamówień.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <nav className="space-y-2">
              <Link className="block rounded-2xl px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950" href="/konto">
                Panel główny
              </Link>
              <Link className="block rounded-2xl px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950" href="/moje-zamowienia">
                Moje zamówienia
              </Link>
              <Link className="block rounded-2xl px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950" href="/konto/edycja">
                Dane osobowe
              </Link>
              <Link className="block rounded-2xl bg-gray-950 px-4 py-3 font-semibold text-white" href="/konto/haslo">
                Hasło i bezpieczeństwo
              </Link>
            </nav>
          </aside>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                    bezpieczeństwo
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">Zmień hasło</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Po zapisaniu zmian używaj nowego hasła przy kolejnym logowaniu.
                  </p>
                </div>
                <Link href="/konto" className="rounded-2xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-950 transition hover:border-gray-950">
                  Wróć
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Obecne hasło</span>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Wpisz obecne hasło" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Nowe hasło</span>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Wpisz nowe hasło" />
                </label>

                <div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((level) => (
                      <div key={level} className={`h-2 rounded-full ${passwordStrength > level ? "bg-emerald-600" : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Zalecane: minimum 8 znaków, wielka litera, cyfra i znak specjalny.
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Powtórz nowe hasło</span>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Powtórz nowe hasło" />
                </label>

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
                  <Button type="submit" disabled={isSaving} className="sm:min-w-[180px]">
                    {isSaving ? "Zapisywanie..." : "Zmień hasło"}
                  </Button>
                  <Link href="/konto" className="rounded-xl px-5 py-3 text-center font-bold text-gray-600 transition hover:bg-gray-100 hover:text-gray-950">
                    Anuluj
                  </Link>
                </div>
              </form>

              {message && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
                  {message}
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-gray-950">Dobre praktyki</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                  <li className="rounded-2xl bg-gray-50 p-4">Nie używaj tego samego hasła w kilku sklepach.</li>
                  <li className="rounded-2xl bg-gray-50 p-4">Nie wysyłaj hasła mailem ani przez komunikatory.</li>
                  <li className="rounded-2xl bg-gray-50 p-4">Wyloguj się po zakupach na cudzym komputerze.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-gray-950 p-6 text-white shadow-sm">
                <h3 className="text-xl font-black">Twoje dane</h3>
                <p className="mt-3 text-sm leading-6 text-gray-300">
                  Dane osobowe możesz edytować bez zmiany hasła w oddzielnej sekcji panelu.
                </p>
                <Link href="/konto/edycja" className="mt-5 inline-flex w-full justify-center rounded-2xl bg-white px-5 py-3 font-bold text-gray-950 transition hover:bg-gray-100">
                  Edytuj dane
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </UserGuard>
  );
}
