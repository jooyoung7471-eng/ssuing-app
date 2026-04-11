-- CreateTable
CREATE TABLE "UserStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streak_days" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "streak_freeze_count" INTEGER NOT NULL DEFAULT 0,
    "last_practice_date" TEXT,
    "total_sentences" INTEGER NOT NULL DEFAULT 0,
    "total_perfect" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UserStats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "unlocked_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Achievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sentence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "korean_text" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "hint_words" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Sentence" ("created_at", "difficulty", "hint_words", "id", "korean_text", "theme") SELECT "created_at", "difficulty", "hint_words", "id", "korean_text", "theme" FROM "Sentence";
DROP TABLE "Sentence";
ALTER TABLE "new_Sentence" RENAME TO "Sentence";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_user_id_key" ON "UserStats"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_user_id_type_key" ON "Achievement"("user_id", "type");
