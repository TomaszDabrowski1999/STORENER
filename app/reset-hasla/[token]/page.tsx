"use client";

import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import SectionHeader from "../../../components/ui/SectionHeader";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default function ResetPasswordPage({ params }: Props) {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const resolvedParams = await params;
        setToken(resolvedParams.token);
      } catch {
        setError("Nie udało się odczytać tokenu resetu");
      } finally {
        setIsTokenLoading(false);
      }
    };

    loadToken();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Brak tokenu resetu");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Uzupełnij wszystkie pola");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Nie udało się zmienić hasła");
        return;
      }

      setMessage("Hasło zostało zmienione");
      setPassword("");
      setConfirmPassword("");
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
            eyebrow="nowe hasło"
            title="Ustaw nowe hasło"
            subtitle="Wpisz nowe hasło do swojego konta i potwierdź zmianę."
          />

          {isTokenLoading ? (
            <div className="mt-8 rounded-2xl bg-gray-50 px-4 py-4 text-gray-600">
              Ładowanie tokenu...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                type="password"
                placeholder="Nowe hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Powtórz nowe hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Zapisywanie..." : "Zmień hasło"}
              </Button>
            </form>
          )}

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