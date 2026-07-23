# Raport bezpieczeństwa i lista zmian

Dokument opisuje audyt sklepu, wprowadzone poprawki oraz zadania, które
pozostają po Twojej stronie. Data przeglądu: lipiec 2026.

---

## ⚠️ NAJPILNIEJSZE — wyrotuj wszystkie klucze

Plik `.env` z **działającymi kluczami produkcyjnymi** znalazł się w archiwum
przesłanym do analizy. Traktuj poniższe sekrety jako ujawnione i wygeneruj
nowe **przed** kolejnym wdrożeniem:

| Sekret | Gdzie wygenerować nowy |
|---|---|
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | `openssl rand -base64 32` (unieważni wszystkie sesje) |
| `CLOUDINARY_API_SECRET` | panel Cloudinary → Settings → Access Keys |
| `RESEND_API_KEY` | panel Resend → API Keys → Revoke + Create |
| `P24_CRC`, `P24_API_KEY` | panel Przelewy24 → Moje dane → Konfiguracja |
| `FURGONETKA_WEBHOOK_TOKEN` | `openssl rand -hex 32` |

Sam `.gitignore` był poprawny, więc do repozytorium te dane najprawdopodobniej
nie trafiły. Warto to jednak potwierdzić:

```bash
git log --all --full-history -- .env
```

Jeśli plik pojawi się w historii, samo usunięcie go nowym commitem **nie
wystarczy** — trzeba wyczyścić historię (`git filter-repo`) i wyrotować klucze.

---

## 1. Podatności krytyczne

### 1.1 Drugi, niezabezpieczony endpoint logowania
**Plik:** `app/api/auth/login/route.ts` — *usunięty*

Obok NextAuth istniał własny endpoint logowania: przyjmował e-mail i hasło,
nie miał żadnego limitu prób i po poprawnym haśle zwracał dane użytkownika.
Towarzyszył mu `lib/user-auth.ts`, który zapisywał „sesję" w `localStorage` —
strukturę, którą dowolny użytkownik może dopisać sobie ręcznie w konsoli
przeglądarki.

Żaden komponent już z nich nie korzystał (pozostałość po wcześniejszej wersji),
ale endpoint pozostawał w pełni działający i dostępny publicznie.

**Poprawka:** usunięto `app/api/auth/login/route.ts`, `lib/user-auth.ts`,
`lib/admin-products.ts` i `lib/products.ts` (martwy kod operujący na
`localStorage`). Uwierzytelnianie odbywa się wyłącznie przez NextAuth.

### 1.2 Brak limitu prób — atak siłowy na hasła
**Nowy plik:** `lib/rate-limit.ts`

Logowanie, rejestracja, reset hasła i sprawdzanie statusu zamówienia
przyjmowały nieograniczoną liczbę żądań. Prosty skrypt mógł testować hasła
w tempie tysięcy prób na minutę.

**Poprawka:** limiter działający w oknie przesuwnym, wpięty w:

| Endpoint | Limit |
|---|---|
| Logowanie | 5 prób / 15 min na konto **oraz** 10 / 10 min na IP |
| Rejestracja | 5 / godz. na IP |
| Reset hasła (wysyłka) | 5 / 15 min na IP, 3 / godz. na adres e-mail |
| Reset hasła (ustawienie) | 10 / 15 min na IP |
| Zmiana hasła | 5 / 15 min |
| Status zamówienia | 20 / 10 min |
| Dodawanie opinii | 10 / godz. |
| Upload zdjęć | 60 / 10 min |

Dwa niezależne liczniki przy logowaniu (po IP i po adresie e-mail) blokują
zarówno atak z jednego adresu na wiele kont, jak i rozproszony atak na jedno
konto.

> **Ograniczenie:** licznik trzyma stan w pamięci procesu. Przy jednej
> instancji (VPS, pojedynczy kontener) działa poprawnie. Przy skalowaniu na
> wiele instancji — patrz sekcja „Do zrobienia".

### 1.3 Panel administratora chroniony wyłącznie po stronie przeglądarki
**Nowy plik:** `middleware.ts`

Wszystkie strony `/admin/*` opakowane były komponentem `<AdminGuard>` —
zwykłym komponentem Reacta. Wystarczyło wyłączyć JavaScript albo zatrzymać
przekierowanie w narzędziach deweloperskich, żeby zobaczyć interfejs panelu.

Same endpointy API sprawdzały rolę serwerowo (`requireAdmin`), więc dane były
bezpieczne — ale ujawniała się struktura panelu, nazwy tras i logika
biznesowa.

**Poprawka:** middleware weryfikuje podpisany token sesji **zanim** cokolwiek
zostanie wyrenderowane. Chroni `/admin/*`, `/api/admin/*`, `/konto/*`,
`/moje-zamowienia/*`, `/zamowienia/*`, `/api/me/*`, `/api/my-orders/*`.
Zalogowany użytkownik bez roli ADMIN dostaje **404**, nie „brak dostępu" —
nie potwierdzamy, że panel pod tym adresem istnieje.

`AdminGuard` pozostaje jako druga warstwa (zapobiega mignięciu treści).

### 1.4 Rola administratora zamrożona w tokenie na 30 dni
**Plik:** `auth.ts`

Rola trafiała do tokenu JWT przy logowaniu i nie była już nigdy weryfikowana.
Skutki:

- odebranie komuś uprawnień ADMIN działało dopiero po **30 dniach**,
- usunięte konto zachowywało ważną sesję do wygaśnięcia tokenu.

**Poprawka:** czas życia sesji skrócony z 30 do **7 dni**, a rola jest
odświeżana z bazy co 15 minut. Brak konta w bazie natychmiast unieważnia sesję.

### 1.5 Upload plików bez jakiejkolwiek walidacji
**Nowy plik:** `lib/upload-validation.ts`
**Zmienione:** `app/api/upload/route.ts`, `app/api/upload-multiple/route.ts`

Endpointy przyjmowały **dowolny plik dowolnej wielkości** i wysyłały go do
Cloudinary. Możliwe konsekwencje:

- wgranie pliku SVG lub HTML ze skryptem i otrzymanie działającego linku
  w zaufanej domenie CDN (baza do phishingu i XSS),
- pojedyncze żądanie z plikiem kilkugigabajtowym wyczerpujące pamięć serwera,
- niekontrolowany rachunek za Cloudinary.

**Poprawka:** walidacja rozmiaru (max 5 MB), typu MIME **oraz sygnatury
pliku** (magic bytes). Sam nagłówek `Content-Type` podaje klient, więc plik ze
skryptem przemianowany na `zdjecie.png` nie przejdzie kontroli zawartości.
SVG jest celowo **niedozwolone** — to dokument XML, który może zawierać
`<script>`.

---

## 2. Podatności o średnim priorytecie

### 2.1 Tokeny resetu hasła zapisane jawnym tekstem
**Pliki:** `app/api/auth/forgot-password/route.ts`, `app/api/auth/reset-password/route.ts`

Tabela `PasswordResetToken` przechowywała tokeny w postaci czytelnej. Wyciek
kopii zapasowej bazy oznaczałby możliwość przejęcia każdego konta z aktywnym
linkiem resetującym.

**Poprawka:** w bazie zapisujemy wyłącznie skrót SHA-256. Token w postaci
jawnej istnieje tylko w wysłanej wiadomości e-mail.

### 2.2 Wykrywanie zarejestrowanych adresów e-mail
**Pliki:** `auth.ts`, `app/api/auth/forgot-password/route.ts`

Przy nieistniejącym koncie logowanie zwracało odpowiedź natychmiast, przy
istniejącym — po wykonaniu `bcrypt.compare` (~100 ms). Różnica pozwalała
sprawdzać, które adresy są zarejestrowane. Formularz „nie pamiętam hasła"
zwracał różne komunikaty dla istniejącego i nieistniejącego konta.

**Poprawka:** przy braku konta wykonywane jest porównanie z atrapą hasha
(`DUMMY_PASSWORD_HASH`), więc czas odpowiedzi jest identyczny. Reset hasła
zawsze zwraca ten sam komunikat.

### 2.3 Zmiana adresu e-mail bez potwierdzenia hasłem
**Plik:** `app/api/me/route.ts`

Endpoint pozwalał zmienić adres e-mail — czyli **login** i cel linków
resetujących — na podstawie samej aktywnej sesji. Przejęcie niezablokowanego
komputera wystarczało, by po cichu przepiąć konto na własny adres i trwale
odciąć właściciela.

Dodatkowo adres nie był normalizowany. Unikalność w PostgreSQL rozróżnia
wielkość liter, więc `JAN@x.pl` i `jan@x.pl` to dla bazy dwa różne rekordy,
podczas gdy logowanie i reset hasła traktowały je jako jedno konto.

**Poprawka:** zmiana adresu wymaga podania obecnego hasła, adres jest
normalizowany do małych liter, zajętość sprawdzana bez rozróżniania wielkości
liter, a stare linki resetujące są unieważniane. Formularz w
`app/konto/edycja` pokazuje pole hasła tylko wtedy, gdy adres faktycznie się
zmienia.

### 2.4 Brak Content Security Policy
**Plik:** `next.config.ts`

Były ustawione `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
i `Permissions-Policy` — brakowało jednak CSP, czyli najważniejszego
mechanizmu ograniczającego skutki XSS-a.

**Poprawka:** pełna polityka CSP (`script-src`, `connect-src`,
`frame-ancestors 'none'`, `form-action 'self'`, `object-src 'none'`),
`Strict-Transport-Security` na produkcji, `Cross-Origin-Opener-Policy`,
wyłączony nagłówek `X-Powered-By` oraz `Cache-Control: no-store` dla
`/admin/*` i `/api/*`.

### 2.5 Sanityzacja HTML oparta na czarnej liście
**Plik:** `lib/format.ts`

Opisy produktów trafiają na stronę przez `dangerouslySetInnerHTML`. Poprzednia
funkcja usuwała wybrane tagi wyrażeniami regularnymi — takie podejście da się
obejść, np. przez zagnieżdżenie `<scr<script>ipt>` (po usunięciu wewnętrznego
tagu pozostaje działający `<script>`).

**Poprawka:** przepisano na **białą listę** — przechodzą wyłącznie znane tagi
formatujące, wszystko inne jest escapowane do tekstu. Z atrybutów zostają
tylko `colspan`, `rowspan`, `align`, więc `onclick`, `onerror`, `style`,
`href` i `src` odpadają automatycznie. Dodatkowy przebieg escapuje „sierocie"
znaki `<`.

Przetestowano na 11 typowych ładunkach XSS (`<script>`, `<img onerror>`,
`<svg onload>`, `javascript:` w `href`, zagnieżdżone tagi, `style` z
`url(javascript:)`) — wszystkie neutralizowane, poprawne formatowanie
zachowane.

> Opisy dodaje wyłącznie administrator, ale przejęte konto admina nie powinno
> móc uruchomić skryptu w przeglądarce każdego klienta sklepu.

### 2.6 Porównanie tokenu webhooka podatne na atak czasowy
**Pliki:** `app/api/furgonetka/orders/route.ts`, `app/api/furgonetka/orders/[id]/route.ts`

Token porównywany operatorem `!==`, który przerywa na pierwszym różnym znaku.
Mierząc czas odpowiedzi można odgadywać sekret znak po znaku.

**Poprawka:** porównanie stałoczasowe (`crypto.timingSafeEqual` na skrótach) +
wymóg minimalnej długości tokenu (24 znaki).

### 2.7 Koszt bcrypt zbyt niski
Hasła haszowane z kosztem 10. Wobec dzisiejszych kart graficznych to za mało.
**Poprawka:** koszt **12** (`lib/security.ts`).

> Istniejące hasła pozostają zahaszowane kosztem 10 i działają normalnie —
> zostaną wzmocnione przy najbliższej zmianie hasła przez użytkownika.

### 2.8 Parametry zapytań bez walidacji
**Plik:** `app/api/products/route.ts`

`Number("abc")` daje `NaN`, co w Prismie kończyło się błędem 500. Parametr
`category` trafiał do zapytania bez sprawdzenia, `sort` również, a fraza
wyszukiwania nie miała ograniczenia długości (bardzo długie zapytania `LIKE`
potrafią mocno obciążyć bazę).

**Poprawka:** wartości liczbowe sprowadzane do bezpiecznego zakresu, kategoria
i sortowanie walidowane względem listy dozwolonych wartości, fraza ograniczona
do 100 znaków.

### 2.9 Publiczny endpoint diagnostyczny
`app/api/admin/route.ts` zwracał `{ ok: true }` bez żadnej autoryzacji —
potwierdzał istnienie panelu. **Usunięty.**

### 2.10 Lokalna baza SQLite poza `.gitignore`
`prisma/dev.db` (57 KB) nie był ignorowany — mógł trafić do repozytorium wraz
z danymi osobowymi klientów (RODO). **Dodano wpis do `.gitignore`.**

---

## 3. Naprawione błędy funkcjonalne

### 3.1 Reset hasła w ogóle nie działał
Strona `/reset-hasla` wysyłała adres e-mail na `/api/auth/reset-password`,
który oczekuje **tokenu i nowego hasła**. Każdy użytkownik próbujący odzyskać
dostęp dostawał komunikat „Uzupełnij wszystkie pola", a link nigdy nie był
wysyłany.

**Poprawka:** formularz kieruje żądanie na `/api/auth/forgot-password`.

### 3.2 Zduplikowana strona odzyskiwania hasła
`/forgot-password` i `/reset-hasla` pełniły tę samą funkcję. Usunięto
`/forgot-password` (nic do niej nie linkowało) i wyczyszczono wpis w
`app/robots.ts`.

---

## 4. Zmiany wizualne

### 4.1 Strona rejestracji
Przepisana w stylistyce strony logowania: identyczna karta z cieniem
i zaokrągleniem 28 px, ikony wewnątrz pól, przełącznik pokaż/ukryj hasło,
walidacja pod każdym polem, spinner w przycisku, stopka z informacją
o bezpieczeństwie.

Dodatkowo:
- **wskaźnik siły hasła** (5 poziomów, reguły zgodne z walidacją serwera),
- link do polityki prywatności obok regulaminu,
- lista korzyści z założenia konta.

### 4.2 Pozostałe strony autoryzacji
`/reset-hasla` i `/reset-hasla/[token]` przeniesione na ten sam wzorzec.
Zamiast surowych komunikatów pojawiają się pełne ekrany potwierdzenia
(„Sprawdź skrzynkę", „Hasło zmienione" z automatycznym przekierowaniem).

### 4.3 Komponenty współdzielone
`Button`, `Card`, `Input`, `SectionHeader` przepisane na zmienne CSS z
`globals.css`. Zyskuje na tym również strona checkoutu, która z nich korzysta.

- `Button` — 5 wariantów, 3 rozmiary, wbudowany stan ładowania, widoczny
  focus ring (dostępność / obsługa klawiaturą),
- `Input` — obsługa etykiety, ikony, błędu i podpowiedzi, powiązanie
  `aria-describedby` z komunikatem błędu,
- `Card` — konfigurowalny padding, opcjonalny efekt uniesienia.

---

## 5. Weryfikacja

```
tsc --noEmit   → 8 błędów, wszystkie odziedziczone (patrz niżej), 0 nowych
eslint         → czysto na wszystkich zmienionych plikach
```

Pozostałe 8 błędów typów pochodzi z **nieaktualnego klienta Prisma**
zacommitowanego w `generated/prisma` — nie zna on kolumn `createdAt`
i `termsAcceptedAt` dodanych migracjami. Potwierdziłem to, uruchamiając
`tsc` na nietkniętym kodzie z oryginalnego archiwum: **te same 8 błędów,
co do linii**.

Znikną po `prisma generate`, które uruchamia się automatycznie przy
`npm install` (hook `postinstall`) i `npm run build`. W środowisku audytu nie
udało się tego wykonać, bo pobieranie binariów Prisma było zablokowane
sieciowo.

---

## 6. Do zrobienia po Twojej stronie

**Przed wdrożeniem:**

1. **Wyrotuj wszystkie sekrety** (sekcja na początku dokumentu).
2. Uzupełnij `FURGONETKA_WEBHOOK_TOKEN` — musi mieć **min. 24 znaki**, krótsze
   są teraz odrzucane. Jeśli zmienna nie jest ustawiona, endpointy Furgonetki
   zwracają 401.
3. `npm install && npm run build` — zregeneruje klienta Prisma i naprawi
   błędy typów.
4. Sprawdź, czy CSP nie blokuje żadnego zewnętrznego skryptu, którego używasz
   (analityka, czat, piksel remarketingowy). Konsola przeglądarki pokaże
   zablokowane zasoby — domenę trzeba wtedy dopisać w `next.config.ts`.

**Warte rozważenia w kolejnym kroku:**

5. **Limiter na Redis** — obecny trzyma stan w pamięci procesu. Przy jednej
   instancji działa poprawnie, ale na Vercel czy przy kilku kontenerach każdy
   proces ma własny licznik, co skutecznie mnoży limit. Interfejs
   `lib/rate-limit.ts` jest przygotowany tak, żeby była to zmiana jednego
   pliku (Upstash Redis).
6. **Dwuskładnikowe logowanie dla administratorów** — konto admina daje dostęp
   do danych osobowych wszystkich klientów; samo hasło to dziś za mało.
7. **Weryfikacja adresu e-mail przy rejestracji** — obecnie konto zakłada się
   na dowolny, także nieistniejący adres.
8. **Rejestr zdarzeń administracyjnych** — kto i kiedy zmienił cenę, status
   zamówienia czy uprawnienia. Przy sporze lub incydencie to jedyny sposób,
   żeby cokolwiek odtworzyć.
9. **CSP bez `unsafe-inline`** — obecnie wymagane przez mechanizm hydracji
   Next.js. Docelowo można to zastąpić nonce'ami generowanymi w middleware,
   ale wymaga to zmian w renderowaniu wszystkich stron.
10. **Kopie zapasowe bazy** wraz z przetestowaną procedurą odtworzenia.
