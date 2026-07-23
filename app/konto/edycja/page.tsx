"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UserGuard from "../../../components/UserGuard";
import { User, Lock, Package, ShoppingBag, ArrowRight, Check } from "lucide-react";

type Profile = { id: number; fullName: string; email: string; role?: string };

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // Zmiana adresu e-mail = zmiana loginu, dlatego serwer wymaga
  // potwierdzenia obecnym hasłem. Pole pokazujemy tylko wtedy, gdy
  // użytkownik faktycznie edytuje e-mail.
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(d => {
      if (d.error) { setError(d.error); return; }
      setProfile(d); setFullName(d.fullName || ""); setEmail(d.email || "");
    }).catch(() => setError("Błąd połączenia")).finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError("");
    if (!fullName.trim() || !email.trim()) { toast.error("Uzupełnij wszystkie pola"); return; }

    const isEmailChanging =
      email.trim().toLowerCase() !== (profile?.email || "").toLowerCase();

    if (isEmailChanging && !currentPassword) {
      setError("Aby zmienić adres e-mail, podaj swoje obecne hasło");
      toast.error("Podaj obecne hasło");
      return;
    }
    const tid = toast.loading("Zapisywanie…");
    try {
      setIsSaving(true);
      const res = await fetch("/api/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), currentPassword: isEmailChanging ? currentPassword : undefined }) });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Błąd"); toast.error(d.error, { id: tid }); return; }
      setProfile(d);
      setCurrentPassword("");
      setMessage("Dane zaktualizowane");
      toast.success("Dane zostały zapisane ✓", { id: tid });
      router.refresh();
    } catch { toast.error("Błąd połączenia", { id: tid }); }
    finally { setIsSaving(false); }
  };

  const initials = (fullName || "U").split(" ").filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join("");

  return (
    <UserGuard>
      <main className="min-h-screen" style={{ background: "var(--surface)" }}>
        <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-5xl px-6 py-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4caf3d]">Panel klienta</p>
            <h1 className="mt-1.5 text-2xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Dane osobowe</h1>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <div className="h-fit rounded-2xl bg-white p-3" style={{ border: "1px solid var(--border)" }}>
              <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Menu konta</p>
              <nav className="space-y-0.5">
                {[
                  { href: "/konto", label: "Panel główny", icon: User },
                  { href: "/moje-zamowienia", label: "Zamówienia", icon: Package },
                  { href: "/konto/edycja", label: "Dane osobowe", icon: User, active: true },
                  { href: "/konto/haslo", label: "Hasło", icon: Lock },
                  { href: "/produkty", label: "Kontynuuj zakupy", icon: ShoppingBag },
                ].map(({ href, label, icon: Icon, active }) => (
                  <Link key={href} href={href} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-[#0a0a0a] text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                    <Icon className="h-4 w-4 shrink-0" />{label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Main */}
            <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
              <div className="rounded-2xl bg-white p-7" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                <h2 className="font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Edytuj profil</h2>
                <p className="mt-1 text-sm text-gray-500">Po zmianie e-mail kolejne logowanie będzie nowym adresem.</p>

                {isLoading ? (
                  <div className="mt-6 space-y-3">
                    {[...Array(2)].map((_, i) => <div key={i} className="h-12 rounded-xl skeleton" />)}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">Imię i nazwisko</label>
                      <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jan Kowalski" className="input-field" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">Adres e-mail</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jan@example.pl" className="input-field" />
                    </div>

                    {email.trim().toLowerCase() !== (profile?.email || "").toLowerCase() && (
                      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                          <Lock className="h-3.5 w-3.5" /> Potwierdź obecnym hasłem
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          autoComplete="current-password"
                          placeholder="Twoje obecne hasło"
                          className="input-field"
                        />
                        <p className="mt-2 text-xs text-amber-700">
                          Zmieniasz adres logowania — dla bezpieczeństwa musimy potwierdzić, że to Ty.
                        </p>
                      </div>
                    )}

                    {message && (
                      <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        <Check className="h-4 w-4" /> {message}
                      </div>
                    )}
                    {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

                    <div className="flex gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                      <button type="submit" disabled={isSaving} className="flex-1 rounded-xl bg-[#0a0a0a] py-3 text-sm font-bold text-white transition hover:bg-[#1a1a1a] disabled:opacity-60">
                        {isSaving ? "Zapisywanie…" : "Zapisz zmiany"}
                      </button>
                      <Link href="/konto" className="flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400" style={{ borderColor: "var(--border)" }}>
                        Anuluj
                      </Link>
                    </div>
                  </form>
                )}
              </div>

              {/* Right panel */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid var(--border)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Podgląd profilu</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0a0a0a] font-bold text-white" style={{ fontFamily: "'Syne', system-ui" }}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{fullName || "Brak imienia"}</p>
                      <p className="text-xs text-gray-500 truncate">{email || "Brak e-mail"}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0a0a0a] p-5 text-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <Lock className="h-[18px] w-[18px]" />
                  </div>
                  <h3 className="mt-3 font-bold">Bezpieczeństwo</h3>
                  <p className="mt-1 text-xs text-white/60">Nie udostępniaj danych logowania.</p>
                  <Link href="/konto/haslo" className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-sm font-bold text-[#0a0a0a] transition hover:bg-gray-100">
                    Zmień hasło <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </UserGuard>
  );
}
