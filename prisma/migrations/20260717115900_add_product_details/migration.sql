-- Naprawa dryfu schematu: kolumna Product.productDetails jest w schema.prisma,
-- ale nigdy nie trafiła do migracji (na produkcji dodana ręcznie / db push).
-- IF NOT EXISTS => bezpieczne również tam, gdzie kolumna już istnieje.
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "productDetails" TEXT;
