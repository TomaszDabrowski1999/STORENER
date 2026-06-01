-- Dodaje nowe wartości enum używane w kodzie: /produkty?category=DOM oraz /produkty?category=OGROD.
-- Bez tego PostgreSQL zwraca błąd dla wartości "DOM" / "OGROD" i endpoint /api/products kończy się 500.
ALTER TYPE "ProductCategory" ADD VALUE IF NOT EXISTS 'DOM';
ALTER TYPE "ProductCategory" ADD VALUE IF NOT EXISTS 'OGROD';
