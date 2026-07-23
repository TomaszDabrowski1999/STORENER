"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

type Props = {
  params: Promise<{ token: string }>;
};

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: "Słabe hasło", color: "#ef4444" };
  if (score === 3) return { score, label: "Średnie hasło", color: "#f59e0b" };
  if (score === 4) return { score, label: "Dobre hasło", color: "#4caf3d" };
  return { score, label: "Bardzo silne hasło", color: "#3a9a2c" };
}

export default function ResetPasswordTokenPage({ params }: Props) {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [error, setError] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    params
      .then((resolved) => setToken(resolved.token))
      .catch(() => setError("Nie udało się odczytać tokenu resetu"))
      .finally(() => setIsTokenLoading(false));
  }, [params]);

  const validate = () => {
    const errors: { password?: string; confirmPassword?: string } = {};

    if (!password) errors.password = "Podaj nowe hasło";
    else if (password.length < 8)
      errors.password = "Hasło musi mieć co najmniej 8 znaków";
    else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
      errors.password = "Hasło musi zawierać przynajmniej jedną literę i jedną cyfrę";

    if (!confirmPassword) errors.confirmPassword = "Powtórz nowe hasło";
    else if (password !== confirmPassword)
      errors.confirmPassword = "Hasła nie są takie same";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Brak tokenu resetu. Otwórz link z wiadomości e-mail ponownie.");
      return;
    }

    if (!validate()) return;

    const toastId = toast.loading("Zapisywanie nowego hasła...");

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data.error || "Nie udało się zmienić hasła";
        setError(message);
        toast.error(message, { id: toastId });
        return;
      }

      setIsDone(true);
      setPassword("");
      setConfirmPassword("");
      toast.success("Hasło zostało zmienione", { id: toastId });

      // Po 3 sekundach przenosimy użytkownika na stronę logowania.
      setTimeout(() => router.push("/logowanie"), 3000);
    } catch {
      setError("Wystąpił błąd połączenia. Spróbuj ponownie.");
      toast.error("Wystąpił błąd połączenia", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (hasError: boolean) => ({
    borderColor: hasError ? "#f87171" : "var(--border)",
    ["--tw-ring-color" as string]: "var(--green)",
  });

  return (
    <main className="min-h-screen" style={{ background: "var(--surface)" }}>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-gray-950"
              style={{ fontFamily: "var(--font-display)" }}
            >
              STORENER
            </Link>
          </div>

          <div
            className="rounded-[28px] bg-white p-8 sm:p-10"
            style={{ boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" }}
          >
            {isDone ? (
              <div className="text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: "var(--green-light)" }}
                >
                  <CheckCircle2 className="h-6 w-6" style={{ color: "var(--green-dark)" }} />
                </div>

                <h1
                  className="mt-5 text-2xl font-bold text-gray-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Hasło zmienione
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Możesz już zalogować się nowym hasłem. Za chwilę przeniesiemy
                  Cię na stronę logowania.
                </p>

                <Link
                  href="/logowanie"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] py-3.5 text-sm font-semibold text-white transition hover:bg-[#1a1a1a]"
                >
                  Przejdź do logowania
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8 flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: "var(--green-light)" }}
                  >
                    <KeyRound className="h-5 w-5" style={{ color: "var(--green-dark)" }} />
                  </div>
                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: "var(--green-dark)" }}
                    >
                      Nowe hasło
                    </p>
                    <h1
                      className="mt-0.5 text-2xl font-bold text-gray-950"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Ustaw nowe hasło
                    </h1>
                  </div>
                </div>

                {isTokenLoading ? (
                  <div className="space-y-3">
                    <div className="skeleton h-12 w-full" />
                    <div className="skeleton h-12 w-full" />
                    <div className="skeleton h-12 w-full" />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Nowe hasło
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          autoFocus
                          placeholder="Minimum 8 znaków"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setFieldErrors((prev) => ({ ...prev, password: undefined }));
                          }}
                          aria-invalid={Boolean(fieldErrors.password)}
                          className="w-full rounded-xl border py-3 pl-11 pr-11 text-sm outline-none transition focus:ring-2"
                          style={inputStyle(Boolean(fieldErrors.password))}
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

                      {password && !fieldErrors.password && (
                        <div className="mt-2.5">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <span
                                key={level}
                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                style={{
                                  background:
                                    level <= strength.score ? strength.color : "#e8e8e6",
                                }}
                              />
                            ))}
                          </div>
                          <p
                            className="mt-1.5 text-xs font-medium"
                            style={{ color: strength.color }}
                          >
                            {strength.label}
                          </p>
                        </div>
                      )}

                      {fieldErrors.password && (
                        <p className="mt-1.5 text-sm text-red-600">{fieldErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Powtórz nowe hasło
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Wpisz hasło ponownie"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                          }}
                          aria-invalid={Boolean(fieldErrors.confirmPassword)}
                          className="w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                          style={inputStyle(Boolean(fieldErrors.confirmPassword))}
                        />
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className="mt-1.5 text-sm text-red-600">
                          {fieldErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {error && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
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
                          Zapisywanie...
                        </>
                      ) : (
                        <>
                          Zmień hasło
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <Link
                  href="/logowanie"
                  className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-950"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Wróć do logowania
                </Link>
              </>
            )}
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            Zmiana hasła unieważnia wszystkie pozostałe linki resetujące.
          </p>
        </div>
      </div>
    </main>
  );
}
