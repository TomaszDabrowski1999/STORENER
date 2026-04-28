"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function UserNavbarActions() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-sm text-white/70">Ładowanie...</span>;
  }

  if (!session?.user) {
    return (
      <>
        <Link
          href="/logowanie"
          className="text-sm font-medium text-white transition hover:text-green-400"
        >
          Logowanie
        </Link>

        <Link
          href="/rejestracja"
          className="text-sm font-medium text-white transition hover:text-green-400"
        >
          Rejestracja
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/konto"
        className="text-sm font-medium text-white transition hover:text-green-400"
      >
        Konto
      </Link>

      <Link
        href="/moje-zamowienia"
        className="text-sm font-medium text-white transition hover:text-green-400"
      >
        Moje zamówienia
      </Link>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm font-medium text-white transition hover:text-green-400"
      >
        Wyloguj
      </button>
    </>
  );
}