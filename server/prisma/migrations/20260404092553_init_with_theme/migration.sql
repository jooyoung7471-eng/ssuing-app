/*
  Warnings:

  - Added the required column `theme` to the `DailySentence` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DailySentence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "sentence_id" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "DailySentence_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DailySentence_sentence_id_fkey" FOREIGN KEY ("sentence_id") REFERENCES "Sentence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DailySentence" ("date", "id", "order", "sentence_id", "user_id") SELECT "date", "id", "order", "sentence_id", "user_id" FROM "DailySentence";
DROP TABLE "DailySentence";
ALTER TABLE "new_DailySentence" RENAME TO "DailySentence";
CREATE UNIQUE INDEX "DailySentence_user_id_date_theme_order_key" ON "DailySentence"("user_id", "date", "theme", "order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
