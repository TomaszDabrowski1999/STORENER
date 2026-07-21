"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, LogIn } from "lucide-react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const justRegistered = searchParams.get("zarejestrowano") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Wygoda: jeśli ktoś wcześniej zaznaczył "zapamiętaj e-mail", podpowiadamy go przy kolejnej wizycie.
  useEffect(() => {
    const savedEmail = window.localStorage.getItem("storener_last_email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = "Podaj adres e-mail";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errors.email = "Podaj poprawny adres e-mail";
    if (!password) errors.password = "Podaj hasło";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!validate()) return;

    const toastId = toast.loading("Logowanie...");

    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setLocalError("Nieprawidłowy email lub hasło");
        toast.error("Nieprawidłowy email lub hasło", { id: toastId });
        return;
      }

      if (rememberEmail) {
        window.localStorage.setItem("storener_last_email", email.trim());
      } else {
        window.localStorage.removeItem("storener_last_email");
      }

      toast.success("Zalogowano pomyślnie", { id: toastId });

      const meResponse = await fetch("/api/me", { cache: "no-store" });
      const me = meResponse.ok ? await meResponse.json() : null;

      router.push(callbackUrl || (me?.role === "ADMIN" ? "/admin" : "/konto"));
      router.refresh();
    } catch {
      setLocalError("Wystąpił błąd połączenia. Sprawdź internet i spróbuj ponownie.");
      toast.error("Wystąpił błąd połączenia", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--surface)" }}>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Logo / powrót do sklepu */}
          <div className="mb-8 flex justify-center">
            <Link href="/" className="text-xl font-bold tracking-tight text-gray-950" style={{ fontFamily: "var(--font-display)" }}>
              STORENER
            </Link>
          </div>

          <div
            className="rounded-[28px] bg-white p-8 sm:p-10"
            style={{ boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ background: "var(--green-light)" }}>
                <LogIn className="h-5 w-5" style={{ color: "var(--green-dark)" }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--green-dark)" }}>
                  Konto użytkownika
                </p>
                <h1 className="mt-0.5 text-2xl font-bold text-gray-950" style={{ fontFamily: "var(--font-display)" }}>
                  Zaloguj się
                </h1>
              </div>
            </div>

            {justRegistered && (
              <div
                className="mb-6 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium"
                style={{ background: "var(--green-light)", color: "var(--green-dark)" }}
              >
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Konto utworzone. Zaloguj się swoimi danymi, aby kontynuować.</span>
              </div>
            )}

            <form onSubmit={handleLogin} noValidate className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Adres e-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="jan.kowalski@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-invalid={Boolean(fieldErrors.email)}
                    className="w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                    style={{
                      borderColor: fieldErrors.email ? "#f87171" : "var(--border)",
                      ["--tw-ring-color" as string]: "var(--green)",
                    }}
                  />
                </div>
                {fieldErrors.email && <p className="mt-1.5 text-sm text-red-600">{fieldErrors.email}</p>}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Hasło
                  </label>
                  <Link href="/reset-hasla" className="text-sm font-medium transition hover:opacity-70" style={{ color: "var(--green-dark)" }}>
                    Nie pamiętasz hasła?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    aria-invalid={Boolean(fieldErrors.password)}
                    className="w-full rounded-xl border py-3 pl-11 pr-11 text-sm outline-none transition focus:ring-2"
                    style={{
                      borderColor: fieldErrors.password ? "#f87171" : "var(--border)",
                      ["--tw-ring-color" as string]: "var(--green)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="mt-1.5 text-sm text-red-600">{fieldErrors.password}</p>}
              </div>

              <label className="flex select-none items-center gap-2.5 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: "var(--green)" }}
                />
                Zapamiętaj mój e-mail na tym urządzeniu
              </label>

              {localError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {localError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] py-3.5 text-sm font-semibold text-white transition hover:bg-[#1a1a1a] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Logowanie...
                  </>
                ) : (
                  <>
                    Zaloguj się
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Nie masz konta?{" "}
              <Link href="/rejestracja" className="font-semibold text-gray-950 underline-offset-2 transition hover:underline">
                Zarejestruj się
              </Link>
            </p>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            Twoje dane logowania są szyfrowane i nigdy nie są nikomu udostępniane.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center" style={{ background: "var(--surface)" }}>
          <div className="rounded-[28px] bg-white px-10 py-8" style={{ boxShadow: "var(--shadow-lg)" }}>
            <p className="text-sm font-medium text-gray-500">Ładowanie formularza logowania...</p>
          </div>
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
