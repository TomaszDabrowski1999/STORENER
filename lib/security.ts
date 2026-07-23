import crypto from "crypto";

// ===========================================================================
// WSPÓLNE FUNKCJE BEZPIECZEŃSTWA
// ===========================================================================

/**
 * Porównanie sekretów odporne na atak czasowy.
 * Zwykłe `a === b` kończy się na pierwszym różnym znaku – mierząc czas
 * odpowiedzi można odgadywać token znak po znaku.
 */
export function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(String(a ?? ""), "utf8");
  const bufferB = Buffer.from(String(b ?? ""), "utf8");

  // timingSafeEqual wymaga równych długości – haszujemy, żeby długość
  // sekretu też nie wyciekała.
  const hashA = crypto.createHash("sha256").update(bufferA).digest();
  const hashB = crypto.createHash("sha256").update(bufferB).digest();

  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Hash tokenu resetu hasła.
 *
 * W bazie trzymamy WYŁĄCZNIE hash. Dzięki temu wyciek tabeli
 * PasswordResetToken (np. przez backup albo SQL injection w innym miejscu)
 * nie pozwala nikomu przejąć kont – z hasha nie da się odtworzyć linku.
 */
export function hashResetToken(token: string): string {
  return crypto.createHash("sha256").update(String(token), "utf8").digest("hex");
}

/** Losowy token resetu hasła (wysyłany mailem, nigdy niezapisywany wprost). */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Koszt bcrypt. 12 to obecnie rozsądny kompromis bezpieczeństwo/wydajność
// (~250 ms na hash). Wartość 10 z poprzedniej wersji jest już za niska
// wobec dzisiejszych GPU.
export const BCRYPT_ROUNDS = 12;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MAX_EMAIL_LENGTH = 200;

export function isValidEmail(value: unknown): boolean {
  const email = String(value ?? "").trim();
  return email.length > 0 && email.length <= MAX_EMAIL_LENGTH && EMAIL_REGEX.test(email);
}

/**
 * Normalizacja adresu e-mail do postaci zapisywanej w bazie.
 * Wszystkie miejsca (rejestracja, logowanie, reset, edycja profilu) MUSZĄ
 * używać tej samej funkcji – inaczej „Jan@X.pl" i „jan@x.pl" tworzą
 * dwa konta widziane przez system jako jedno.
 */
export function normalizeEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

// Hash „donikąd" – używany przy logowaniu, gdy konto nie istnieje.
// Pozwala wykonać bcrypt.compare mimo braku użytkownika, żeby czas
// odpowiedzi był taki sam dla istniejącego i nieistniejącego e-maila
// (blokuje enumerację kont przez pomiar czasu).
export const DUMMY_PASSWORD_HASH =
  "$2b$12$C6UzMDM.H6dfI/f/IKcEeO3Q0Y0j0zN1r1Vd8B1v9r5wQ1n0k8bXW";

/**
 * Walidacja siły hasła. bcrypt bierze pod uwagę tylko pierwsze 72 bajty,
 * więc dłuższe hasła odrzucamy zamiast po cichu obcinać.
 */
export function validatePassword(password: unknown): string | null {
  const value = String(password ?? "");

  if (value.length < 8) return "Hasło musi mieć co najmniej 8 znaków";
  if (Buffer.byteLength(value, "utf8") > 72)
    return "Hasło może mieć maksymalnie 72 znaki";
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value))
    return "Hasło musi zawierać przynajmniej jedną literę i jedną cyfrę";

  return null;
}
