"use client";

import { useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import SectionHeader from "../../components/ui/SectionHeader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Nie udało się utworzyć resetu");
        return;
      }

      setMessage(
        data.message || "Jeśli konto istnieje, wysłaliśmy link resetujący."
      );
      setEmail("");
    } catch {
      setError("Wystąpił błąd połączenia");
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
            subtitle="Podaj adres email przypisany do konta, a przygotujemy możliwość ustawienia nowego hasła."
          />

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              type="email"
              placeholder="Podaj email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
            </Button>
          </form>

          {message && (
            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}