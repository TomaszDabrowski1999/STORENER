"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User, Package, Settings, LogOut } from "lucide-react";

export default function UserNavbarActions() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-24 animate-pulse rounded-lg bg-white/10" />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/logowanie" className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/8 hover:text-white">
          Logowanie
        </Link>
        <Link href="/rejestracja" className="rounded-lg bg-white/10 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/18">
          Rejestracja
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link href="/konto" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/8 hover:text-white">
        <User className="h-3.5 w-3.5" />
        Konto
      </Link>
      <Link href="/moje-zamowienia" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/8 hover:text-white">
        <Package className="h-3.5 w-3.5" />
        Zamówienia
      </Link>
      {session.user.role === "ADMIN" && (
        <Link href="/admin" className="flex items-center gap-1.5 rounded-lg border border-[#4caf3d]/40 bg-[#4caf3d]/10 px-3 py-2 text-sm font-bold text-[#4caf3d] transition hover:bg-[#4caf3d]/20">
          <Settings className="h-3.5 w-3.5" />
          Admin
        </Link>
      )}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition hover:bg-white/8 hover:text-white/90"
      >
        <LogOut className="h-3.5 w-3.5" />
        Wyloguj
      </button>
    </div>
  );
}
