"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UserGuard from "../../../components/UserGuard";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

type Profile = {
  id: number;
  fullName: string;
  email: string;
  role?: string;
};

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [localMessage, setLocalMessage] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();

        if (!response.ok) {
          setLocalError(data.error || "Nie udało się pobrać profilu");
          return;
        }

        setProfile(data);
        setFullName(data.fullName || "");
        setEmail(data.email || "");
      } catch {
        setLocalError("Wystąpił błąd połączenia");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalMessage("");
    setLocalError("");

    if (!fullName.trim() || !email.trim()) {
      setLocalError("Uzupełnij wszystkie pola");
      toast.error("Uzupełnij wszystkie pola");
      return;
    }

    const toastId = toast.loading("Zapisywanie zmian...");

    try {
      setIsSaving(true);

      const response = await fetch("/api/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLocalError(data.error || "Nie udało się zapisać zmian");
        toast.error(data.error || "Nie udało się zapisać zmian", { id: toastId });
        return;
      }

      setProfile(data);
      setLocalMessage("Dane konta zostały zaktualizowane");
      toast.success("Dane konta zostały zaktualizowane", { id: toastId });
      router.refresh();
    } catch {
      setLocalError("Wystąpił błąd połączenia");
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
              Dane osobowe
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Zmień dane używane przy logowaniu, zamówieniach i komunikacji ze sklepem.
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
              <Link className="block rounded-2xl bg-gray-950 px-4 py-3 font-semibold text-white" href="/konto/edycja">
                Dane osobowe
              </Link>
              <Link className="block rounded-2xl px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950" href="/konto/haslo">
                Hasło i bezpieczeństwo
              </Link>
            </nav>
          </aside>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                    profil
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">Edytuj profil</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Po zmianie adresu e-mail kolejne logowanie będzie odbywać się nowym adresem.
                  </p>
                </div>
                <Link href="/konto" className="rounded-2xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-950 transition hover:border-gray-950">
                  Wróć
                </Link>
              </div>

              {isLoading ? (
                <div className="mt-8 rounded-2xl bg-gray-50 px-5 py-4 font-medium text-gray-600">
                  Ładowanie profilu...
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-gray-700">Imię i nazwisko</span>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Imię i nazwisko" />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-gray-700">Adres e-mail</span>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="adres@email.pl" />
                  </label>

                  <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
                    <Button type="submit" disabled={isSaving} className="sm:min-w-[180px]">
                      {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
                    </Button>
                    <Link href="/konto" className="rounded-xl px-5 py-3 text-center font-bold text-gray-600 transition hover:bg-gray-100 hover:text-gray-950">
                      Anuluj
                    </Link>
                  </div>
                </form>
              )}

              {localMessage && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
                  {localMessage}
                </div>
              )}

              {localError && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                  {localError}
                </div>
              )}
            </section>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">podgląd</p>
                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-950 text-xl font-black text-white">
                    {(fullName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-gray-950">{fullName || "Brak imienia"}</p>
                    <p className="mt-1 break-all text-sm text-gray-500">{email || "Brak e-maila"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-gray-950 p-6 text-white shadow-sm">
                <h3 className="text-xl font-black">Bezpieczeństwo</h3>
                <p className="mt-3 text-sm leading-6 text-gray-300">
                  Nie udostępniaj danych logowania. Hasło możesz zmienić w osobnej sekcji panelu.
                </p>
                <Link href="/konto/haslo" className="mt-5 inline-flex w-full justify-center rounded-2xl bg-white px-5 py-3 font-bold text-gray-950 transition hover:bg-gray-100">
                  Zmień hasło
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </UserGuard>
  );
}
