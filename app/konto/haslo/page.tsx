"use client";

import { useState } from "react";
import UserGuard from "../../../components/UserGuard";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import SectionHeader from "../../../components/ui/SectionHeader";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setIsSaving(true);

      const response = await fetch("/api/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Nie udało się zmienić hasła");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Hasło zostało zmienione");
    } catch {
      setError("Wystąpił błąd połączenia");
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
              eyebrow="bezpieczeństwo"
              title="Zmień hasło"
              subtitle="Dla bezpieczeństwa podaj obecne hasło i ustaw nowe."
            />

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Input
                type="password"
                placeholder="Obecne hasło"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Nowe hasło"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                disabled={isSaving}
              >
                {isSaving ? "Zapisywanie..." : "Zmień hasło"}
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
    </UserGuard>
  );
}