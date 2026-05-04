"use client";

import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-2xl border border-black px-5 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
    >
      Wyloguj
    </button>
  );
}
