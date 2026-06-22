-- Numer listu przewozowego i nazwa przewoźnika zwracane przez Furgonetkę
-- po wygenerowaniu etykiety (callback "Wysyłaj informacje o przesyłce").
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "trackingNumber" TEXT,
ADD COLUMN IF NOT EXISTS "trackingCarrier" TEXT;
