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

// ===========================================================================
// SANITYZACJA HTML OPISU PRODUKTU
// ===========================================================================
// Opis produktu trafia na stronę przez dangerouslySetInnerHTML, więc jest to
// realny punkt wstrzyknięcia skryptu (stored XSS). Poprzednia wersja usuwała
// tylko wybrane tagi – dało się ją obejść np. przez zagnieżdżenie
// (<scr<script>ipt>) albo atrybut zdarzenia bez cudzysłowów.
//
// Nowe podejście to LISTA DOZWOLONYCH (allowlist): przepuszczamy wyłącznie
// znane, bezpieczne tagi formatujące, a WSZYSTKO inne jest escapowane.
// To odwrócenie logiki – nie trzeba przewidzieć każdej sztuczki atakującego,
// wystarczy wymienić to, co wolno.
//
// Uwaga: opisy dodaje wyłącznie administrator, ale przejęte konto admina
// nie powinno móc uruchomić skryptu w przeglądarce każdego klienta.
// ===========================================================================

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li", "h2", "h3", "h4",
  "blockquote", "table", "thead", "tbody", "tr", "td", "th", "span", "div",
]);

function sanitizeHtml(html: string): string {
  // Krok 1: usuwamy w całości elementy, których zawartość też jest groźna.
  let output = html.replace(
    /<(script|style|iframe|object|embed|form|svg|math|template)\b[\s\S]*?(?:<\/\1\s*>|$)/gi,
    ""
  );

  // Krok 2: przetwarzamy każdy pozostały tag.
  output = output.replace(/<\/?([a-zA-Z0-9]+)((?:[^>"']|"[^"]*"|'[^']*')*)>/g, (match, rawName, rawAttrs) => {
    const tag = String(rawName).toLowerCase();

    // Tag spoza listy dozwolonych → pokazujemy go jako zwykły tekst.
    if (!ALLOWED_TAGS.has(tag)) {
      return escapeHtml(match);
    }

    // Tag zamykający nie ma atrybutów – jest bezpieczny.
    if (match.startsWith("</")) return `</${tag}>`;

    // Krok 3: z atrybutów zostawiamy wyłącznie kilka nieszkodliwych.
    // Wszystkie "on*" (onclick, onerror, onload...), style, href i src
    // odpadają automatycznie, bo nie ma ich na liście.
    const allowedAttrs = ["colspan", "rowspan", "align"];
    const keptAttrs: string[] = [];

    const attrRegex = /([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrRegex.exec(String(rawAttrs))) !== null) {
      const name = attrMatch[1].toLowerCase();
      const value = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";

      if (allowedAttrs.includes(name) && /^[a-zA-Z0-9 _-]{1,20}$/.test(value)) {
        keptAttrs.push(`${name}="${escapeHtml(value)}"`);
      }
    }

    const attrs = keptAttrs.length > 0 ? ` ${keptAttrs.join(" ")}` : "";
    return `<${tag}${attrs}>`;
  });

  // Krok 4: po powyższych operacjach mogą zostać "sieroce" znaki "<"
  // (np. z celowo popsutego wejścia typu <scr<script>ipt>). Każdy znak "<",
  // który nie zaczyna już poprawnego, dozwolonego tagu, zamieniamy na tekst –
  // dzięki temu nic nie zostanie sklejone w działający tag.
  const allowedPattern = Array.from(ALLOWED_TAGS).join("|");
  const strayLessThan = new RegExp(
    `<(?!/?(?:${allowedPattern})(?:\\s[^<>]*)?>)`,
    "g"
  );

  return output.replace(strayLessThan, "&lt;");
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
