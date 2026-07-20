-- Snapshot ceny jednostkowej na pozycji zamówienia.
-- Bez tego zmiana ceny produktu zmieniała wstecznie wygląd historycznych zamówień.
ALTER TABLE "OrderItem" ADD COLUMN "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Backfill: dla istniejących zamówień przyjmujemy aktualną cenę produktu
-- (lepsze przybliżenie niż 0).
UPDATE "OrderItem"
SET "price" = p."price"
FROM "Product" p
WHERE "OrderItem"."productId" = p."id";
