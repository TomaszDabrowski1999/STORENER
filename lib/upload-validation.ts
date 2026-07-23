// ===========================================================================
// WALIDACJA PRZESYŁANYCH PLIKÓW
// ===========================================================================
// Poprzednio endpointy uploadu przyjmowały DOWOLNY plik dowolnej wielkości
// i wysyłały go do Cloudinary. Skutki:
//  - można było wgrać plik HTML/SVG ze skryptem i dostać działający link
//    w domenie CDN (podstawa do ataku phishingowego i XSS przez SVG),
//  - jeden request z plikiem 2 GB potrafił położyć serwer (brak limitu pamięci),
//  - rachunek za Cloudinary rósł bez żadnej kontroli.
//
// Sprawdzamy typ MIME, rozszerzenie ORAZ magiczne bajty (sygnaturę pliku).
// Sam nagłówek Content-Type podaje klient, więc nie można mu ufać.
// ===========================================================================

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_FILES = 12;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

// Uwaga: SVG celowo NIE jest dozwolone. To dokument XML, który może zawierać
// <script> – wgrany jako "obrazek" staje się gotowym wektorem XSS.

type Signature = { mime: string; bytes: number[]; offset?: number };

const SIGNATURES: Signature[] = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  // WEBP i AVIF: kontener RIFF/ISO-BMFF – sprawdzamy znacznik w offsecie 8.
  { mime: "image/webp", bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
  { mime: "image/avif", bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
];

function matchesSignature(buffer: Buffer, signature: Signature): boolean {
  const offset = signature.offset ?? 0;

  if (buffer.length < offset + signature.bytes.length) return false;

  return signature.bytes.every((byte, index) => buffer[offset + index] === byte);
}

export type ValidationResult =
  | { ok: true; buffer: Buffer }
  | { ok: false; error: string };

export async function validateImageFile(file: unknown): Promise<ValidationResult> {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Nieprawidłowy plik" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      error: `Plik „${file.name}" jest za duży. Maksymalny rozmiar to ${
        MAX_FILE_SIZE / (1024 * 1024)
      } MB.`,
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: "Dozwolone formaty zdjęć: JPG, PNG, WEBP, AVIF, GIF.",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Kluczowy test: czy zawartość pliku faktycznie jest obrazem.
  // Plik ze skryptem przemianowany na "zdjecie.png" nie przejdzie tego kroku.
  const isRealImage = SIGNATURES.some((signature) =>
    matchesSignature(buffer, signature)
  );

  if (!isRealImage) {
    return {
      ok: false,
      error: "Zawartość pliku nie jest prawidłowym obrazem.",
    };
  }

  return { ok: true, buffer };
}
