"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import SectionHeader from "../../components/ui/SectionHeader";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [localMessage, setLocalMessage] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setLocalMessage("");
    setLocalError("");

    if (!email) {
      setLocalError("Podaj adres email");
      toast.error("Podaj adres email");
      return;
    }

    const toastId = toast.loading("Wysyłanie linku resetującego...");

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLocalError(data.error || "Nie udało się wysłać wiadomości");
        toast.error(data.error || "Nie udało się wysłać wiadomości", {
          id: toastId,
        });
        return;
      }

      setLocalMessage(
        "Jeśli konto istnieje, link do resetu hasła został wysłany na email."
      );
      toast.success("Link resetujący został wysłany", { id: toastId });
    } catch {
      setLocalError("Wystąpił błąd połączenia");
      toast.error("Wystąpił błąd połączenia", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md">
        <Card>
          <SectionHeader
            eyebrow="odzyskiwanie dostępu"
            title="Reset hasła"
            subtitle="Podaj email powiązany z kontem, a wyślemy link do ustawienia nowego hasła."
          />

          <form onSubmit={handleReset} className="mt-8 space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            <Link
              href="/logowanie"
              className="font-semibold text-black transition hover:opacity-70"
            >
              Wróć do logowania
            </Link>
          </div>

          {localMessage && (
            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {localMessage}
            </div>
          )}

          {localError && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {localError}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}