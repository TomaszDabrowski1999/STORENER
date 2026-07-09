import crypto from "crypto";

/**
 * Integracja z Przelewy24 (REST API v1).
 *
 * Wymagane zmienne środowiskowe (panel P24 -> Moje dane / Konfiguracja API):
 *  - P24_MERCHANT_ID  ID sprzedawcy (liczba)
 *  - P24_POS_ID       ID sklepu / POS (zwykle to samo co merchantId)
 *  - P24_CRC          Klucz CRC
 *  - P24_API_KEY      Klucz do API (tzw. klucz do raportów / REST API key)
 *  - P24_SANDBOX      "true" = środowisko testowe sandbox.przelewy24.pl
 *
 * Przepływ:
 *  1. POST /api/payments/przelewy24/create  -> rejestracja transakcji, zwraca URL bramki
 *  2. Klient jest przekierowany na stronę P24 i płaci (BLIK / karta / przelew)
 *  3. P24 wywołuje webhook (urlStatus) -> weryfikujemy podpis + kwotę,
 *     potwierdzamy transakcję (PUT /verify) i dopiero wtedy oznaczamy
 *     zamówienie jako OPLACONA.
 *  4. Klient wraca na urlReturn (strona /platnosci/[id]?powrot=1).
 */

export type P24Config = {
  merchantId: number;
  posId: number;
  crc: string;
  apiKey: string;
  sandbox: boolean;
};

export function getP24Config(): P24Config | null {
  const merchantId = Number(process.env.P24_MERCHANT_ID);
  const posId = Number(process.env.P24_POS_ID || process.env.P24_MERCHANT_ID);
  const crc = process.env.P24_CRC;
  const apiKey = process.env.P24_API_KEY;

  if (!merchantId || Number.isNaN(merchantId) || !posId || Number.isNaN(posId) || !crc || !apiKey) {
    return null;
  }

  return {
    merchantId,
    posId,
    crc,
    apiKey,
    sandbox: String(process.env.P24_SANDBOX).toLowerCase() === "true",
  };
}

export function getP24BaseUrl(config: P24Config) {
  return config.sandbox
    ? "https://sandbox.przelewy24.pl"
    : "https://secure.przelewy24.pl";
}

function sha384(data: string) {
  return crypto.createHash("sha384").update(data, "utf8").digest("hex");
}

function basicAuthHeader(config: P24Config) {
  const token = Buffer.from(`${config.posId}:${config.apiKey}`).toString("base64");
  return `Basic ${token}`;
}

/** Kwota w groszach z wartości zł (Float w bazie). */
export function toGrosze(amountPln: number) {
  return Math.round(amountPln * 100);
}

/**
 * sessionId musi być unikalny per próba płatności.
 * Kodujemy w nim ID zamówienia, żeby webhook mógł je odtworzyć
 * bez dodatkowych kolumn w bazie.
 */
export function buildSessionId(orderId: number) {
  const random = crypto.randomBytes(6).toString("hex");
  return `order-${orderId}-${Date.now()}-${random}`;
}

export function parseOrderIdFromSessionId(sessionId: string): number | null {
  const match = /^order-(\d+)-/.exec(sessionId);
  if (!match) return null;
  const orderId = Number(match[1]);
  return Number.isInteger(orderId) && orderId > 0 ? orderId : null;
}

/** Podpis rejestracji transakcji. Kolejność pól w JSON jest istotna! */
export function registerSign(
  config: P24Config,
  params: { sessionId: string; amount: number; currency: string }
) {
  return sha384(
    JSON.stringify({
      sessionId: params.sessionId,
      merchantId: config.merchantId,
      amount: params.amount,
      currency: params.currency,
      crc: config.crc,
    })
  );
}

/** Podpis weryfikacji transakcji (PUT /transaction/verify). */
export function verifySign(
  config: P24Config,
  params: { sessionId: string; orderId: number; amount: number; currency: string }
) {
  return sha384(
    JSON.stringify({
      sessionId: params.sessionId,
      orderId: params.orderId,
      amount: params.amount,
      currency: params.currency,
      crc: config.crc,
    })
  );
}

export type P24Notification = {
  merchantId: number;
  posId: number;
  sessionId: string;
  amount: number;
  originAmount: number;
  currency: string;
  orderId: number;
  methodId: number;
  statement: string;
  sign: string;
};

/** Sprawdzenie podpisu powiadomienia (webhooka) od P24. */
export function isValidNotificationSign(config: P24Config, n: P24Notification) {
  const expected = sha384(
    JSON.stringify({
      merchantId: n.merchantId,
      posId: n.posId,
      sessionId: n.sessionId,
      amount: n.amount,
      originAmount: n.originAmount,
      currency: n.currency,
      orderId: n.orderId,
      methodId: n.methodId,
      statement: n.statement,
      crc: config.crc,
    })
  );

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(String(n.sign), "hex")
    );
  } catch {
    return false;
  }
}

export type RegisterTransactionInput = {
  sessionId: string;
  amount: number; // grosze
  description: string;
  email: string;
  client?: string;
  address?: string;
  zip?: string;
  city?: string;
  phone?: string;
  urlReturn: string;
  urlStatus: string;
};

/**
 * Rejestruje transakcję w P24 i zwraca token oraz pełny URL bramki,
 * na który należy przekierować klienta.
 */
export async function registerTransaction(
  config: P24Config,
  input: RegisterTransactionInput
): Promise<{ token: string; redirectUrl: string }> {
  const currency = "PLN";
  const baseUrl = getP24BaseUrl(config);

  const payload = {
    merchantId: config.merchantId,
    posId: config.posId,
    sessionId: input.sessionId,
    amount: input.amount,
    currency,
    description: input.description,
    email: input.email,
    client: input.client,
    address: input.address,
    zip: input.zip,
    city: input.city,
    country: "PL",
    phone: input.phone,
    language: "pl",
    urlReturn: input.urlReturn,
    urlStatus: input.urlStatus,
    timeLimit: 15,
    waitForResult: false,
    sign: registerSign(config, {
      sessionId: input.sessionId,
      amount: input.amount,
      currency,
    }),
  };

  const response = await fetch(`${baseUrl}/api/v1/transaction/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(config),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.data?.token) {
    console.error("P24 REGISTER ERROR:", response.status, data);
    throw new Error("P24_REGISTER_FAILED");
  }

  const token: string = data.data.token;

  return {
    token,
    redirectUrl: `${baseUrl}/trnRequest/${token}`,
  };
}

/**
 * Potwierdzenie transakcji po otrzymaniu webhooka.
 * Bez tego kroku P24 nie zaksięguje transakcji jako zweryfikowanej.
 */
export async function verifyTransaction(
  config: P24Config,
  params: { sessionId: string; orderId: number; amount: number }
): Promise<boolean> {
  const currency = "PLN";
  const baseUrl = getP24BaseUrl(config);

  const payload = {
    merchantId: config.merchantId,
    posId: config.posId,
    sessionId: params.sessionId,
    amount: params.amount,
    currency,
    orderId: params.orderId,
    sign: verifySign(config, {
      sessionId: params.sessionId,
      orderId: params.orderId,
      amount: params.amount,
      currency,
    }),
  };

  const response = await fetch(`${baseUrl}/api/v1/transaction/verify`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(config),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.data?.status !== "success") {
    console.error("P24 VERIFY ERROR:", response.status, data);
    return false;
  }

  return true;
}
