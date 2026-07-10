// Polska odmiana rzeczownika po liczebniku:
// 1 produkt, 2-4 produkty, 5+ produktów (z wyjątkiem 12-14).
export function polishPlural(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const n = Math.abs(count);
  if (n === 1) return one;
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
    return few;
  }
  return many;
}

// Renderowanie opisu produktu.
//
// Problem: opis wpisywany w panelu to zwykły tekst z enterami (znaki "\n").
// Strona produktu wyświetla go przez dangerouslySetInnerHTML, a w HTML-u
// pojedyncze "\n" są zwijane do spacji – dlatego cały opis lądował w jednej linii.
//
// To rozwiązanie:
//  - jeśli opis zawiera już znaczniki HTML (np. starsze produkty) -> zwracamy bez zmian,
//  - jeśli to zwykły tekst -> zamieniamy puste linie na akapity <p>, a pojedyncze
//    entery na <br>, wcześniej "uciekając" znaki specjalne HTML (bezpieczeństwo).

const BLOCK_HTML_REGEX =
  /<\/?(p|br|h[1-6]|ul|ol|li|table|thead|tbody|tr|td|th|div|strong|b|em|i|span|blockquote|a)\b/i;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Prosta sanityzacja HTML z panelu admina przed dangerouslySetInnerHTML:
// usuwa niebezpieczne tagi, atrybuty zdarzeń (onclick itd.) i URL-e javascript:.
function sanitizeHtml(html: string): string {
  return html
    // całe bloki niebezpiecznych tagów
    .replace(/<(script|style|iframe|object|embed|form)\b[\s\S]*?<\/\1>/gi, "")
    // samotne tagi otwierające/zamykające tych elementów
    .replace(/<\/?(script|style|iframe|object|embed|form|meta|link|base)\b[^>]*>/gi, "")
    // atrybuty zdarzeń: onclick="...", onerror='...', onload=...
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    // javascript: / vbscript: / data:text/html w href i src
    .replace(/\s(href|src)\s*=\s*(["']?)\s*(javascript|vbscript|data:text\/html)[^"'\s>]*\2/gi, "");
}

export function formatDescriptionHtml(raw: string | null | undefined): string {
  const text = (raw || "").trim();
  if (!text) return "";

  // Opis zapisany jako HTML – sanityzujemy, ale nie zmieniamy formatowania.
  if (BLOCK_HTML_REGEX.test(text)) {
    return sanitizeHtml(text);
  }

  // Zwykły tekst: normalizujemy końce linii i budujemy akapity.
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const paragraphs = normalized
    .split(/\n{2,}/) // pusta linia = nowy akapit
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      const withBreaks = escapeHtml(paragraph).replace(/\n/g, "<br />");
      return `<p>${withBreaks}</p>`;
    });

  return paragraphs.join("");
}
