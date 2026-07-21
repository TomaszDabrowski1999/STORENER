"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";
import AdminLogoutButton from "../../../components/AdminLogoutButton";
import {
  Package, Users, ShoppingBag, Plus, ClipboardList,
  ArrowRight, BarChart3, Truck as TruckIcon, Search, ShieldCheck, Crown, Mail,
} from "lucide-react";

type CustomerRow = {
  id: number;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  termsAcceptedAt: string | null;
  ordersCount: number;
  totalSpent: number;
};

type UsersResponse = {
  users: CustomerRow[];
  totalUsers: number;
  adminsCount: number;
  newLast30Days: number;
  page: number;
  totalPages: number;
};

const fmt = (v: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(v);

const fmtDate = (v: string) =>
  new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(v));

export default function AdminCustomersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search.trim()) params.set("q", search.trim());

    const timeout = setTimeout(() => {
      fetch(`/api/admin/users?${params.toString()}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.error) setError(d.error);
          else { setData(d); setError(""); }
        })
        .catch(() => setError("Błąd połączenia"))
        .finally(() => setLoading(false));
    }, 300); // debounce wyszukiwania

    return () => clearTimeout(timeout);
  }, [search, page]);

  return (
    <AdminGuard>
      <div className="flex min-h-screen" style={{ background: "#f0f0ee" }}>
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col bg-[#0a0a0a] md:flex" style={{ minHeight: "100vh" }}>
          <div className="border-b border-white/8 p-5">
            <img src="/storener-logo.png" alt="STORENER" className="h-auto w-32 object-contain brightness-200" />
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Panel admina</p>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            {[
              { href: "/admin", label: "Dashboard", icon: BarChart3 },
              { href: "/admin/produkty", label: "Produkty", icon: Package },
              { href: "/admin/produkty/dodaj", label: "Dodaj produkt", icon: Plus },
              { href: "/admin/zamowienia", label: "Zamówienia", icon: ClipboardList },
              { href: "/admin/klienci", label: "Klienci", icon: Users, active: true },
              { href: "/admin/furgonetka", label: "Furgonetka", icon: TruckIcon },
            ].map(({ href, label, icon: Icon, active }) => (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/6 hover:text-white/80"}`}>
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/8 p-3">
            <Link href="/" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:text-white/70">
              <ArrowRight className="h-3.5 w-3.5" /> Przejdź do sklepu
            </Link>
            <div className="mt-1">
              <AdminLogoutButton />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b bg-white px-8 py-4" style={{ borderColor: "#e8e8e6" }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Panel administracyjny</p>
              <h1 className="text-xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Klienci</h1>
            </div>
            <div className="relative w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Szukaj po imieniu lub e-mailu..."
                className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#4caf3d]"
                style={{ borderColor: "#e8e8e6" }}
              />
            </div>
          </div>

          <div className="p-8">
            {loading && !data && (
              <div className="grid gap-4 sm:grid-cols-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton" />)}
              </div>
            )}

            {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">{error}</div>}

            {data && (
              <div className="space-y-6">
                {/* KPI cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-950">{data.totalUsers}</p>
                        <p className="text-xs text-gray-500">Zarejestrowani klienci</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-950">{data.newLast30Days}</p>
                        <p className="text-xs text-gray-500">Nowych w ostatnich 30 dniach</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <Crown className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-950">{data.adminsCount}</p>
                        <p className="text-xs text-gray-500">Kont administratora</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "var(--shadow-sm)" }}>
                  {data.users.length === 0 ? (
                    <div className="p-10 text-center text-sm text-gray-500">
                      {search ? "Brak klientów pasujących do wyszukiwania." : "Brak zarejestrowanych klientów."}
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500" style={{ borderColor: "#e8e8e6" }}>
                          <th className="px-6 py-3">Klient</th>
                          <th className="px-6 py-3">Rola</th>
                          <th className="px-6 py-3">Data rejestracji</th>
                          <th className="px-6 py-3">Regulamin</th>
                          <th className="px-6 py-3 text-right">Zamówienia</th>
                          <th className="px-6 py-3 text-right">Suma wydana</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.users.map((user) => (
                          <tr key={user.id} className="border-b last:border-0 transition hover:bg-gray-50" style={{ borderColor: "#f0f0ee" }}>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-900">{user.fullName}</p>
                              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Mail className="h-3 w-3" /> {user.email}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              {user.role === "ADMIN" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                  <Crown className="h-3 w-3" /> Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                  Klient
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-600">{fmtDate(user.createdAt)}</td>
                            <td className="px-6 py-4">
                              {user.termsAcceptedAt ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                  <ShieldCheck className="h-3.5 w-3.5" /> {fmtDate(user.termsAcceptedAt)}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">brak danych</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-gray-900">{user.ordersCount}</td>
                            <td className="px-6 py-4 text-right font-semibold text-gray-950">{fmt(user.totalSpent)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Strona {data.page} z {data.totalPages}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={data.page <= 1}
                        className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ borderColor: "#e8e8e6" }}
                      >
                        Poprzednia
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                        disabled={data.page >= data.totalPages}
                        className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ borderColor: "#e8e8e6" }}
                      >
                        Następna
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
