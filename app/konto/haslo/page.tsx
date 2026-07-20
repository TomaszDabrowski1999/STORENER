"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import UserGuard from "../../../components/UserGuard";
import { Lock, Eye, EyeOff, User, Package, ShoppingBag, Check, Shield } from "lucide-react";

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const strength = (() => {
    let s = 0;
    if (newPass.length >= 8) s++;
    if (/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(newPass)) s++;
    if (/[0-9]/.test(newPass)) s++;
    if (/[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9]/.test(newPass)) s++;
    return s;
  })();

  const strengthLabel = ["Bardzo słabe", "Słabe", "Średnie", "Silne", "Bardzo silne"][strength];
  const strengthColor = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-[#4caf3d]", "bg-[#4caf3d]"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError("");
    if (!current || !newPass || !confirm) { toast.error("Uzupełnij wszystkie pola"); return; }
    if (newPass !== confirm) { toast.error("Hasła nie są takie same"); return; }
    if (newPass.length < 8) { toast.error("Hasło musi mieć min. 8 znaków"); return; }
    const tid = toast.loading("Zmienianie hasła…");
    try {
      setIsSaving(true);
      const res = await fetch("/api/me/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: current, newPassword: newPass, confirmPassword: confirm }) });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Błąd"); toast.error(d.error, { id: tid }); return; }
      setMessage("Hasło zostało zmienione");
      toast.success("Hasło zmienione ✓", { id: tid });
      setCurrent(""); setNewPass(""); setConfirm("");
    } catch { toast.error("Błąd połączenia", { id: tid }); }
    finally { setIsSaving(false); }
  };

  return (
    <UserGuard>
      <main className="min-h-screen" style={{ background: "var(--surface)" }}>
        <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-5xl px-6 py-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4caf3d]">Panel klienta</p>
            <h1 className="mt-1.5 text-2xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Hasło i bezpieczeństwo</h1>
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
                  { href: "/konto/edycja", label: "Dane osobowe", icon: User },
                  { href: "/konto/haslo", label: "Hasło", icon: Lock, active: true },
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
                <h2 className="font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Zmień hasło</h2>
                <p className="mt-1 text-sm text-gray-500">Użyj silnego hasła składającego się z min. 8 znaków.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Current password */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">Obecne hasło</label>
                    <div className="relative">
                      <input type={showCurrent ? "text" : "password"} value={current} onChange={e => setCurrent(e.target.value)} placeholder="••••••••" className="input-field pr-11" />
                      <button type="button" onClick={() => setShowCurrent(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">Nowe hasło</label>
                    <div className="relative">
                      <input type={showNew ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" className="input-field pr-11" />
                      <button type="button" onClick={() => setShowNew(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {newPass && (
                      <div className="mt-2">
                        <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                          {[1,2,3,4].map(i => <div key={i} className={`flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-gray-100"}`} />)}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Siła hasła: <span className="font-semibold">{strengthLabel}</span></p>
                      </div>
                    )}
                  </div>

                  {/* Confirm */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-600">Potwierdź nowe hasło</label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className={`input-field ${confirm && confirm !== newPass ? "border-red-300 focus:border-red-500" : confirm && confirm === newPass ? "border-[#4caf3d]" : ""}`} />
                    {confirm && confirm !== newPass && <p className="mt-1 text-xs text-red-500">Hasła nie są takie same</p>}
                  </div>

                  {message && (
                    <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                      <Check className="h-4 w-4" /> {message}
                    </div>
                  )}
                  {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

                  <div className="flex gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                    <button type="submit" disabled={isSaving} className="flex-1 rounded-xl bg-[#0a0a0a] py-3 text-sm font-bold text-white transition hover:bg-[#1a1a1a] disabled:opacity-60">
                      {isSaving ? "Zapisywanie…" : "Zmień hasło"}
                    </button>
                    <Link href="/konto" className="flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400" style={{ borderColor: "var(--border)" }}>
                      Anuluj
                    </Link>
                  </div>
                </form>
              </div>

              {/* Security tips */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#0a0a0a] p-5 text-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <Shield className="h-[18px] w-[18px]" />
                  </div>
                  <h3 className="mt-3 font-bold">Wskazówki</h3>
                  <ul className="mt-3 space-y-2 text-xs text-white/60">
                    {["Min. 8 znaków", "Duże i małe litery", "Cyfry i znaki specjalne", "Unikaj danych osobowych"].map(tip => (
                      <li key={tip} className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-[#4caf3d]" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid var(--border)" }}>
                  <p className="text-xs font-bold text-gray-400">Inne dane konta</p>
                  <p className="mt-2 text-sm text-gray-600">Zaktualizuj imię i adres e-mail w sekcji danych osobowych.</p>
                  <Link href="/konto/edycja" className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-gray-900 transition hover:text-[#4caf3d]">
                    Dane osobowe <Lock className="h-3.5 w-3.5" />
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
