-- Migracja porządkująca kategorie: zamiast DOM_I_OGROD + subcategory
-- docelowo używamy dwóch normalnych kategorii: DOM i OGROD.
-- Uruchom w Railway PostgreSQL dopiero po wdrożeniu kodu albo w oknie serwisowym.

ALTER TYPE "ProductCategory" ADD VALUE IF NOT EXISTS 'DOM';
ALTER TYPE "ProductCategory" ADD VALUE IF NOT EXISTS 'OGROD';

UPDATE "Product"
SET "category" = 'DOM'
WHERE "category" = 'DOM_I_OGROD'
  AND ("subcategory" = 'WYPOSAZENIE' OR "subcategory" IS NULL);

UPDATE "Product"
SET "category" = 'OGROD'
WHERE "category" = 'DOM_I_OGROD'
  AND "subcategory" = 'OGROD';

UPDATE "Product"
SET "subcategory" = NULL
WHERE "category" IN ('DOM', 'OGROD');
