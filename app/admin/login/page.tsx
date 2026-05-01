"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../../../lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const success = loginAdmin(email, password);

    if (!success) {
      setError("Nieprawidłowy email lub hasło");
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Logowanie admina</h1>
        <p className="mt-2 text-gray-600">
          Zaloguj się, aby wejść do panelu administracyjnego.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-6 py-3 text-white"
          >
            Zaloguj się
          </button>
        </form>

        {error && <p className="mt-4 font-semibold text-red-600">{error}</p>}

        <div className="mt-6 rounded-lg bg-gray-100 p-4 text-sm text-gray-700">
        </div>
      </div>
    </main>
  );
}