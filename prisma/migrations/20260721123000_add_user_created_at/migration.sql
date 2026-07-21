-- Data utworzenia konta – potrzebna w panelu admina do pokazania,
-- kto i kiedy się zarejestrował.
ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
