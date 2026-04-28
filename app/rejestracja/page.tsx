"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import SectionHeader from "../../components/ui/SectionHeader";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLocalError("");

    if (!fullName || !email || !password) {
      setLocalError("Uzupełnij wszystkie pola");
      toast.error("Uzupełnij wszystkie pola");
      return;
    }

    const toastId = toast.loading("Tworzenie konta...");

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLocalError(data.error || "Nie udało się utworzyć konta");
        toast.error(data.error || "Nie udało się utworzyć konta", {
          id: toastId,
        });
        return;
      }

      toast.success("Konto zostało utworzone", { id: toastId });
      router.push("/logowanie");
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
            eyebrow="konto użytkownika"
            title="Rejestracja"
            subtitle="Załóż konto, aby wygodnie zamawiać, edytować profil i śledzić swoje zakupy."
          />

          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            <Input
              type="text"
              placeholder="Imię i nazwisko"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Tworzenie konta..." : "Załóż konto"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            Masz już konto?{" "}
            <Link
              href="/logowanie"
              className="font-semibold text-black transition hover:opacity-70"
            >
              Zaloguj się
            </Link>
          </div>

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