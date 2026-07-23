// ===========================================================================
// PROSTY LIMITER ZAPYTAŃ (in-memory, sliding window)
// ===========================================================================
// Chroni endpointy wrażliwe na atak siłowy (logowanie, rejestracja, reset
// hasła, sprawdzanie statusu zamówienia) przed masowym odpytywaniem.
//
// UWAGA – ograniczenie: licznik trzymany jest w pamięci procesu. Przy jednej
// instancji (typowy VPS / jeden kontener) działa poprawnie. Jeśli sklep
// będzie skalowany na wiele instancji (np. Vercel z wieloma regionami),
// przełącz `hit()` na Redis / Upstash – interfejs pozostaje ten sam.
// ===========================================================================

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

// Czyszczenie starych wpisów, żeby mapa nie rosła w nieskończoność.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Rejestruje jedno wywołanie dla danego klucza.
 *
 * @param key    unikalny identyfikator (np. "login:1.2.3.4")
 * @param limit  maksymalna liczba prób w oknie
 * @param windowMs długość okna w milisekundach
 */
export function hit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return {
    ok: true,
    remaining: limit - bucket.count,
    retryAfterSeconds: 0,
  };
}

/** Kasuje licznik (np. po udanym logowaniu). */
export function reset(key: string) {
  buckets.delete(key);
}

/**
 * Adres IP klienta. Za reverse proxy (Vercel, nginx, Cloudflare) prawdziwy
 * adres jest w nagłówku – bierzemy pierwszy wpis z x-forwarded-for.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/** Gotowa odpowiedź 429 z nagłówkiem Retry-After. */
export function tooManyRequests(retryAfterSeconds: number, message?: string) {
  return new Response(
    JSON.stringify({
      error:
        message ||
        "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}
