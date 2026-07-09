# Integracja Przelewy24 — jak uruchomić

## 1. Dane z panelu Przelewy24

Zaloguj się do panelu P24 (produkcja: panel.przelewy24.pl, testy: sandbox.przelewy24.pl)
i z sekcji **Moje dane / Konfiguracja API** przepisz do pliku `.env`:

```
P24_MERCHANT_ID=12345        # ID sprzedawcy
P24_POS_ID=12345             # ID sklepu (zwykle to samo co merchant ID)
P24_CRC=xxxxxxxxxxxxxxxx     # Klucz CRC
P24_API_KEY=xxxxxxxxxxxxxxxx # Klucz do API (tzw. klucz do raportów)
P24_SANDBOX=true             # true = środowisko testowe, false = produkcja
```

Na produkcji ustaw `P24_SANDBOX=false` i podmień dane na produkcyjne.

## 2. Adres powiadomień (webhook)

Sklep sam przekazuje adres webhooka przy każdej transakcji
(`urlStatus = https://www.storener.pl/api/payments/przelewy24/status`),
więc w panelu P24 nie trzeba nic konfigurować. Warunek: sklep musi być
dostępny publicznie po HTTPS pod adresem z `NEXT_PUBLIC_APP_URL`.

Testując lokalnie, webhook nie dotrze na `localhost` — użyj tunelu
(np. `ngrok http 3000`) i tymczasowo ustaw `NEXT_PUBLIC_APP_URL` na adres tunelu.

## 3. Jak działa przepływ płatności

1. Klient składa zamówienie w `/checkout` (wybór: Przelewy24 albo pobranie).
2. Na stronie `/platnosci/[id]` klika **„Zapłać przez Przelewy24”**.
3. `POST /api/payments/przelewy24/create` rejestruje transakcję w P24
   (kwota liczona z bazy, nie z przeglądarki) i zwraca link do bramki.
4. Klient płaci na stronie P24 (BLIK / karta / przelew) i wraca na
   `/platnosci/[id]?powrot=1`.
5. Równolegle serwery P24 wywołują webhook
   `POST /api/payments/przelewy24/status`, który:
   - sprawdza podpis SHA-384 (klucz CRC),
   - sprawdza merchantId, posId, walutę i zgodność kwoty z zamówieniem,
   - potwierdza transakcję w API P24 (`/transaction/verify`),
   - dopiero wtedy ustawia `paymentStatus = OPLACONA`.

Zamówienia nie da się już oznaczyć jako opłacone z poziomu przeglądarki —
stary endpoint `/api/orders/[id]/pay`, który to umożliwiał, został usunięty.

## 4. Testy w sandboxie

Załóż darmowe konto na sandbox.przelewy24.pl, użyj jego danych w `.env`
(`P24_SANDBOX=true`) i wykonaj płatność testową metodą „przelew testowy”.
Po płatności status zamówienia w panelu admina powinien zmienić się na „Opłacona”.
