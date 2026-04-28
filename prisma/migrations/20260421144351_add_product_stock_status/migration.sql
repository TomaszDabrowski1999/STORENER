-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL DEFAULT 'NOWOSCI',
    "subcategory" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "stockStatus" TEXT NOT NULL DEFAULT 'BRAK'
);
INSERT INTO "new_Product" ("category", "description", "id", "image", "isActive", "name", "price", "slug", "subcategory") SELECT "category", "description", "id", "image", "isActive", "name", "price", "slug", "subcategory" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
