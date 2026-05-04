"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import SectionHeader from "../../components/ui/SectionHeader";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLocalError("");

    if (!email || !password) {
      setLocalError("Uzupełnij email i hasło");
      toast.error("Uzupełnij email i hasło");
      return;
    }

    const toastId = toast.loading("Logowanie...");

    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result) {
        setLocalError("Nie udało się zalogować");
        toast.error("Nie udało się zalogować", { id: toastId });
        return;
      }

      if (result.error) {
        setLocalError("Nieprawidłowy email lub hasło");
        toast.error("Nieprawidłowy email lub hasło", { id: toastId });
        return;
      }

      toast.success("Zalogowano pomyślnie", { id: toastId });

      const meResponse = await fetch("/api/me", { cache: "no-store" });
      const me = meResponse.ok ? await meResponse.json() : null;

      router.push(me?.role === "ADMIN" ? "/admin" : "/");
      router.refresh();
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
            title="Logowanie"
            subtitle="Zaloguj się, aby przejść do konta, zamówień i dalszych zakupów."
          />

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
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
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-sm text-gray-600">
            <Link
              href="/reset-hasla"
              className="font-medium text-black transition hover:opacity-70"
            >
              Nie pamiętasz hasła?
            </Link>

            <p>
              Nie masz konta?{" "}
              <Link
                href="/rejestracja"
                className="font-semibold text-black transition hover:opacity-70"
              >
                Zarejestruj się
              </Link>
            </p>
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