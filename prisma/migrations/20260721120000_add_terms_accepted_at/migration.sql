-- Data akceptacji regulaminu przy rejestracji (dowód zgody).
ALTER TABLE "User" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3);
