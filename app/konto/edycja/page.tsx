"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UserGuard from "../../../components/UserGuard";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import SectionHeader from "../../../components/ui/SectionHeader";

export default function EditProfilePage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [localMessage, setLocalMessage] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();

        if (!response.ok) {
          setLocalError(data.error || "Nie udało się pobrać profilu");
          return;
        }

        setFullName(data.fullName);
        setEmail(data.email);
      } catch {
        setLocalError("Wystąpił błąd połączenia");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLocalMessage("");
    setLocalError("");

    if (!fullName || !email) {
      setLocalError("Uzupełnij wszystkie pola");
      toast.error("Uzupełnij wszystkie pola");
      return;
    }

    const toastId = toast.loading("Zapisywanie zmian...");

    try {
      setIsSaving(true);

      const response = await fetch("/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLocalError(data.error || "Nie udało się zapisać zmian");
        toast.error(data.error || "Nie udało się zapisać zmian", {
          id: toastId,
        });
        return;
      }

      setLocalMessage("Profil został zaktualizowany");
      toast.success("Profil został zaktualizowany", { id: toastId });

      setTimeout(() => {
        router.push("/konto");
        router.refresh();
      }, 800);
    } catch {
      setLocalError("Wystąpił błąd połączenia");
      toast.error("Wystąpił błąd połączenia", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UserGuard>
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-md">
          <Card>
            <SectionHeader
              eyebrow="konto użytkownika"
              title="Edytuj profil"
              subtitle="Zmień podstawowe dane konta, które są używane w sklepie i przy zamówieniach."
            />

            {isLoading ? (
              <div className="mt-8 rounded-2xl bg-gray-50 px-4 py-4 text-gray-600">
                Ładowanie profilu...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
                </Button>
              </form>
            )}

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
    </UserGuard>
  );
}