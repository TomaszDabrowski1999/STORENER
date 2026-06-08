"use client";

import { useState } from "react";
import AdminGuard from "../../../components/AdminGuard";
import { Copy, Check, ExternalLink, Info, Truck, Key, Globe, Package } from "lucide-react";
import Link from "next/link";

export default function FurgonetkaIntegrationPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.storener.pl";
  const ordersEndpoint = `${appUrl}/api/furgonetka/orders`;
  const trackingEndpoint = `${appUrl}/api/furgonetka/orders/{id}`;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <AdminGuard>
      <main className="min-h-screen" style={{ background: "var(--surface)" }}>
        {/* Header */}
        <div className="bg-white border-b" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0070f3]/10">
                <Truck className="h-6 w-6 text-[#0070f3]" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Panel administracyjny</p>
                <h1 className="text-2xl font-bold text-gray-950" style={{ fontFamily: "'Syne', system-ui" }}>Integracja Furgonetka.pl</h1>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link href="/admin" className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-400" style={{ borderColor: "var(--border)" }}>
                ← Panel admina
              </Link>
              <a href="https://furgonetka.pl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium text-[#0070f3] transition hover:bg-[#0070f3]/5" style={{ borderColor: "var(--border)" }}>
                Otwórz Furgonetka.pl <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
          {/* Info */}
          <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <Info className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" />
            <p className="text-sm text-blue-700">
              Aby połączyć sklep z Furgonetką, wejdź do panelu Furgonetka.pl → <strong>Integracje</strong> → <strong>Dodaj integrację</strong> → <strong>Własne</strong> i wypełnij poniższe dane.
            </p>
          </div>

          {/* Step 1 - Token */}
          <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0a0a0a] text-sm font-bold text-white">1</div>
              <h2 className="font-bold text-gray-950">Wygeneruj token integracji</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Dodaj zmienną środowiskową <code className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-sm">FURGONETKA_WEBHOOK_TOKEN</code> w ustawieniach Railway z losowym, bezpiecznym tokenem.
            </p>
            <div className="rounded-xl border bg-gray-50 p-4" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4 text-gray-400" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Przykładowy token (wygeneruj własny)</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-white p-3" style={{ borderColor: "var(--border)" }}>
                <code className="flex-1 font-mono text-sm text-gray-700 break-all">sk_furgonetka_a1b2c3d4e5f6789012345678</code>
                <button
                  onClick={() => copy("sk_furgonetka_a1b2c3d4e5f6789012345678", "token")}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                >
                  {copied === "token" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 - Form data */}
          <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0a0a0a] text-sm font-bold text-white">2</div>
              <h2 className="font-bold text-gray-950">Dane do formularza Furgonetki</h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">Skopiuj poniższe wartości i wklej w formularzu na furgonetka.pl:</p>

            <div className="space-y-3">
              {[
                { label: "Nazwa wyświetlana", value: "STORENER", key: "name", icon: Package },
                { label: "Adres sklepu", value: appUrl, key: "url", icon: Globe },
                { label: "Token", value: "[Twój FURGONETKA_WEBHOOK_TOKEN z Railway]", key: "tokenfield", icon: Key, placeholder: true },
              ].map(({ label, value, key, icon: Icon, placeholder }) => (
                <div key={key}>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border bg-gray-50 p-3" style={{ borderColor: "var(--border)" }}>
                    <code className={`flex-1 font-mono text-sm ${placeholder ? "text-gray-400 italic" : "text-gray-800"}`}>{value}</code>
                    {!placeholder && (
                      <button
                        onClick={() => copy(value, key)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm transition hover:shadow-md"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        {copied === key ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="text-xs font-medium text-amber-700">
                ✓ Zaznacz opcję <strong>„Włącz synchronizację zamówień"</strong> w formularzu Furgonetki
              </p>
            </div>
          </div>

          {/* Step 3 - Endpoints */}
          <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0a0a0a] text-sm font-bold text-white">3</div>
              <h2 className="font-bold text-gray-950">Endpointy API (informacyjnie)</h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">Furgonetka korzysta z tych endpointów automatycznie po podaniu adresu sklepu:</p>

            <div className="space-y-3">
              {[
                { method: "GET", url: ordersEndpoint, desc: "Lista zamówień do wysyłki" },
                { method: "GET", url: `${ordersEndpoint}/{id}`, desc: "Szczegóły zamówienia" },
                { method: "POST", url: trackingEndpoint, desc: "Aktualizacja numeru śledzenia (webhook)" },
              ].map(({ method, url, desc }) => (
                <div key={url} className="rounded-xl border bg-gray-50 p-3" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 rounded-lg px-2 py-1 font-mono text-[10px] font-bold ${method === "GET" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{method}</span>
                    <div className="min-w-0 flex-1">
                      <code className="block truncate font-mono text-xs text-gray-700">{url}</code>
                      <p className="mt-0.5 text-xs text-gray-400">{desc}</p>
                    </div>
                    <button
                      onClick={() => copy(url, url)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm transition hover:shadow-md"
                      style={{ border: "1px solid var(--border)" }}
                    >
                      {copied === url ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Railway env var instructions */}
          <div className="rounded-2xl bg-[#0a0a0a] p-6 text-white">
            <h2 className="font-bold" style={{ fontFamily: "'Syne', system-ui" }}>Dodanie zmiennej w Railway</h2>
            <ol className="mt-3 space-y-2 text-sm text-white/70">
              <li>1. Wejdź na <a href="https://railway.app" target="_blank" rel="noopener noreferrer" className="text-[#4caf3d] underline">railway.app</a> → twój projekt</li>
              <li>2. Kliknij na usługę aplikacji → zakładka <strong className="text-white">Variables</strong></li>
              <li>3. Kliknij <strong className="text-white">New Variable</strong></li>
              <li>4. Wpisz: <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">FURGONETKA_WEBHOOK_TOKEN</code> = twój losowy token</li>
              <li>5. Kliknij <strong className="text-white">Add</strong> i poczekaj na redeploy</li>
            </ol>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}
