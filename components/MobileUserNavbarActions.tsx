"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function MobileUserNavbarActions({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="px-3 py-3 text-sm text-white/70">Ładowanie...</p>;
  }

  if (!session?.user) {
    return (
      <>
        <Link
          href="/logowanie"
          onClick={onNavigate}
          className="block rounded-xl px-3 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-green-400"
        >
          Logowanie
        </Link>

        <Link
          href="/rejestracja"
          onClick={onNavigate}
          className="block rounded-xl px-3 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-green-400"
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
        onClick={onNavigate}
        className="block rounded-xl px-3 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-green-400"
      >
        Konto
      </Link>

      <Link
        href="/moje-zamowienia"
        onClick={onNavigate}
        className="block rounded-xl px-3 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-green-400"
      >
        Moje zamówienia
      </Link>

      {session.user.role === "ADMIN" && (
        <Link
          href="/admin"
          onClick={onNavigate}
          className="mt-2 block rounded-xl border border-green-400/50 px-3 py-3 text-sm font-bold text-green-300 hover:bg-green-400 hover:text-black"
        >
          Panel admina
        </Link>
      )}

      <button
        type="button"
        onClick={() => {
          onNavigate();
          signOut({ callbackUrl: "/" });
        }}
        className="block w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-white hover:bg-white/10 hover:text-green-400"
      >
        Wyloguj
      </button>
    </>
  );
}