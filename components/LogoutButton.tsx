"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/logowanie" })}
      className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:opacity-90"
    >
      Wyloguj
    </button>
  );
}