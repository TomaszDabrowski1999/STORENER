"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  Check,
} from "lucide-react";

type FieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  terms?: string;
};

// Prosty wskaźnik siły hasła – te same reguły, które wymusza serwer
// (min. 8 znaków, litera + cyfra), plus podpowiedzi jak wzmocnić hasło.
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

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const clearError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev
    );
  };

  const validate = () => {
    const errors: FieldErrors = {};

    if (!fullName.trim()) errors.fullName = "Podaj imię i nazwisko";
    else if (fullName.trim().length < 3)
      errors.fullName = "Imię i nazwisko musi mieć co najmniej 3 znaki";

    if (!email.trim()) errors.email = "Podaj adres e-mail";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      errors.email = "Podaj poprawny adres e-mail";

    if (!password) errors.password = "Podaj hasło";
    else if (password.length < 8)
      errors.password = "Hasło musi mieć co najmniej 8 znaków";
    else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
      errors.password = "Hasło musi zawierać przynajmniej jedną literę i jedną cyfrę";

    if (!acceptedTerms) errors.terms = "Musisz zaakceptować regulamin sklepu";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!validate()) return;

    const toastId = toast.loading("Tworzenie konta...");

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          acceptedTerms,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data.error || "Nie udało się utworzyć konta";
        setLocalError(message);
        toast.error(message, { id: toastId });
        return;
      }

      toast.success("Konto zostało utworzone", { id: toastId });
      router.push("/logowanie?zarejestrowano=1");
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
            <div className="mb-8 flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: "var(--green-light)" }}
              >
                <UserPlus className="h-5 w-5" style={{ color: "var(--green-dark)" }} />
              </div>
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: "var(--green-dark)" }}
                >
                  Konto użytkownika
                </p>
                <h1
                  className="mt-0.5 text-2xl font-bold text-gray-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Załóż konto
                </h1>
              </div>
            </div>

            <form onSubmit={handleRegister} noValidate className="space-y-4">
              {/* Imię i nazwisko */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Imię i nazwisko
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    placeholder="Jan Kowalski"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      clearError("fullName");
                    }}
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    className="w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                    style={{
                      borderColor: fieldErrors.fullName ? "#f87171" : "var(--border)",
                      ["--tw-ring-color" as string]: "var(--green)",
                    }}
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="mt-1.5 text-sm text-red-600">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* E-mail */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Adres e-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jan.kowalski@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError("email");
                    }}
                    aria-invalid={Boolean(fieldErrors.email)}
                    className="w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                    style={{
                      borderColor: fieldErrors.email ? "#f87171" : "var(--border)",
                      ["--tw-ring-color" as string]: "var(--green)",
                    }}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {/* Hasło */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Hasło
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Minimum 8 znaków"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError("password");
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

                {/* Wskaźnik siły hasła */}
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

              {/* Regulamin */}
              <div>
                <label className="flex cursor-pointer select-none items-start gap-2.5 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      clearError("terms");
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
                    style={{ accentColor: "var(--green)" }}
                  />
                  <span>
                    Akceptuję{" "}
                    <Link
                      href="/regulamin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-950 underline underline-offset-2 transition hover:opacity-70"
                    >
                      regulamin sklepu
                    </Link>{" "}
                    oraz{" "}
                    <Link
                      href="/polityka-prywatnosci"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-950 underline underline-offset-2 transition hover:opacity-70"
                    >
                      politykę prywatności
                    </Link>
                  </span>
                </label>
                {fieldErrors.terms && (
                  <p className="mt-1.5 text-sm text-red-600">{fieldErrors.terms}</p>
                )}
              </div>

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
                    Tworzenie konta...
                  </>
                ) : (
                  <>
                    Załóż konto
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Korzyści z posiadania konta */}
            <div
              className="mt-6 rounded-2xl px-4 py-3.5"
              style={{ background: "var(--green-light)" }}
            >
              <ul className="space-y-1.5">
                {[
                  "Szybsze składanie zamówień",
                  "Historia zakupów i śledzenie przesyłek",
                  "Dostęp do wystawiania opinii",
                ].map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2 text-xs font-medium"
                    style={{ color: "var(--green-dark)" }}
                  >
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Masz już konto?{" "}
              <Link
                href="/logowanie"
                className="font-semibold text-gray-950 underline-offset-2 transition hover:underline"
              >
                Zaloguj się
              </Link>
            </p>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            Twoje hasło jest szyfrowane i nigdy nie jest nikomu udostępniane.
          </p>
        </div>
      </div>
    </main>
  );
}
