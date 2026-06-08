"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/logowanie" })}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
    >
      <LogOut className="h-4 w-4" />
      Wyloguj się
    </button>
  );
}
