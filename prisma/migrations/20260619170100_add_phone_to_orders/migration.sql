-- Numer telefonu odbiorcy – wymagany przez kurierów przy nadaniu przesyłki.
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "phone" TEXT;
