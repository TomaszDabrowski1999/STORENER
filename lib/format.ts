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

export function formatDescriptionHtml(raw: string | null | undefined): string {
  const text = (raw || "").trim();
  if (!text) return "";

  // Opis zapisany jako HTML – nie ruszamy, żeby nie zepsuć formatowania.
  if (BLOCK_HTML_REGEX.test(text)) {
    return text;
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
