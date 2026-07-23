"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, ArrowRight, ArrowLeft, KeyRound, ShieldCheck, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Podaj adres e-mail");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setEmailError("Podaj poprawny adres e-mail");
      return;
    }

    const toastId = toast.loading("Wysyłanie linku resetującego...");

    try {
      setIsLoading(true);

      // POPRAWKA: wcześniej formularz wysyłał adres e-mail na
      // /api/auth/reset-password, który oczekuje tokenu i nowego hasła.
      // Efekt: link resetujący nigdy nie był wysyłany, a użytkownik
      // dostawał komunikat "Uzupełnij wszystkie pola".
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data.error || "Nie udało się wysłać wiadomości";
        setLocalError(message);
        toast.error(message, { id: toastId });
        return;
      }

      setIsSent(true);
      toast.success("Sprawdź swoją skrzynkę", { id: toastId });
    } catch {
      setLocalError("Wystąpił błąd połączenia. Spróbuj ponownie.");
      toast.error("Wystąpił błąd połączenia", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

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
            {isSent ? (
              /* ── Ekran potwierdzenia ── */
              <div className="text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: "var(--green-light)" }}
                >
                  <MailCheck className="h-6 w-6" style={{ color: "var(--green-dark)" }} />
                </div>

                <h1
                  className="mt-5 text-2xl font-bold text-gray-950"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Sprawdź skrzynkę
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Jeśli konto o adresie{" "}
                  <span className="font-semibold text-gray-950">{email.trim()}</span>{" "}
                  istnieje, wysłaliśmy na nie link do ustawienia nowego hasła.
                  Link jest ważny przez 30 minut.
                </p>

                <p className="mt-4 text-xs text-gray-500">
                  Nie widzisz wiadomości? Sprawdź folder ze spamem.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsSent(false);
                    setEmail("");
                  }}
                  className="mt-6 w-full rounded-xl border py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  style={{ borderColor: "var(--border)" }}
                >
                  Wyślij ponownie
                </button>

                <Link
                  href="/logowanie"
                  className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-950"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Wróć do logowania
                </Link>
              </div>
            ) : (
              /* ── Formularz ── */
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
                      Odzyskiwanie dostępu
                    </p>
                    <h1
                      className="mt-0.5 text-2xl font-bold text-gray-950"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Reset hasła
                    </h1>
                  </div>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-gray-600">
                  Podaj adres e-mail powiązany z kontem, a wyślemy link
                  do ustawienia nowego hasła.
                </p>

                <form onSubmit={handleReset} noValidate className="space-y-4">
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
                        autoFocus
                        placeholder="jan.kowalski@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        aria-invalid={Boolean(emailError)}
                        className="w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2"
                        style={{
                          borderColor: emailError ? "#f87171" : "var(--border)",
                          ["--tw-ring-color" as string]: "var(--green)",
                        }}
                      />
                    </div>
                    {emailError && (
                      <p className="mt-1.5 text-sm text-red-600">{emailError}</p>
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
                        Wysyłanie...
                      </>
                    ) : (
                      <>
                        Wyślij link resetujący
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

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
            Ze względów bezpieczeństwa nie informujemy, czy dany adres jest zarejestrowany.
          </p>
        </div>
      </div>
    </main>
  );
}
