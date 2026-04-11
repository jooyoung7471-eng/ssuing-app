-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Sentence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "korean_text" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "hint_words" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DailySentence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "sentence_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "DailySentence_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DailySentence_sentence_id_fkey" FOREIGN KEY ("sentence_id") REFERENCES "Sentence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Correction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "sentence_id" TEXT NOT NULL,
    "user_writing" TEXT NOT NULL,
    "corrected_sentence" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "highlights" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Correction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Correction_sentence_id_fkey" FOREIGN KEY ("sentence_id") REFERENCES "Sentence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DailySentence_user_id_date_order_key" ON "DailySentence"("user_id", "date", "order");
