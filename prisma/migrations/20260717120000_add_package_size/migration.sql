-- Wielkość paczki: 3 cenniki dostaw (MALA / SREDNIA / DUZA).
-- Produkt ma przypisaną wielkość, zamówienie zapisuje wielkość wyliczoną
-- z koszyka (największa wielkość spośród produktów).

DO $$ BEGIN
  CREATE TYPE "PackageSize" AS ENUM ('MALA', 'SREDNIA', 'DUZA');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "packageSize" "PackageSize" NOT NULL DEFAULT 'MALA';

ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "packageSize" TEXT NOT NULL DEFAULT 'MALA';
