-- Dowód akceptacji regulaminu przy składaniu konkretnego zamówienia
-- (potrzebne też dla zamówień składanych bez zakładania konta).
ALTER TABLE "Order" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3);
