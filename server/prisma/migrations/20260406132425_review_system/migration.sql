-- CreateTable
CREATE TABLE "ReviewSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "theme" TEXT,
    "difficulty" TEXT,
    "total_count" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReviewSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "sentence_id" TEXT NOT NULL,
    "user_writing" TEXT NOT NULL,
    "score" INTEGER,
    "correction" TEXT,
    "answered_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReviewAnswer_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "ReviewSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReviewAnswer_sentence_id_fkey" FOREIGN KEY ("sentence_id") REFERENCES "Sentence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sentence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "korean_text" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "difficulty" TEXT NOT NULL DEFAULT 'beginner',
    "hint_words" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Sentence" ("category", "created_at", "difficulty", "hint_words", "id", "korean_text", "theme") SELECT "category", "created_at", "difficulty", "hint_words", "id", "korean_text", "theme" FROM "Sentence";
DROP TABLE "Sentence";
ALTER TABLE "new_Sentence" RENAME TO "Sentence";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
