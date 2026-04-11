import { PrismaClient } from "@prisma/client";

const DAILY_COUNT = 3;
const RECYCLE_AFTER_DAYS = 30;

export async function getDailySentences(
  prisma: PrismaClient,
  userId: string,
  theme: string,
  date: string,
  difficulty?: string
) {
  const effectiveDifficulty = difficulty || "beginner";

  // Check if already selected for today + theme + difficulty
  const existing = await prisma.dailySentence.findMany({
    where: { user_id: userId, date, theme, difficulty: effectiveDifficulty },
    include: { sentence: true },
    orderBy: { order: "asc" },
  });

  if (existing.length === DAILY_COUNT) {
    return existing;
  }

  // If partial exists, delete and re-select
  if (existing.length > 0) {
    await prisma.dailySentence.deleteMany({
      where: { user_id: userId, date, theme, difficulty: effectiveDifficulty },
    });
  }

  // Get IDs of sentences already completed by this user (within recycle window)
  const recycleDate = new Date();
  recycleDate.setDate(recycleDate.getDate() - RECYCLE_AFTER_DAYS);
  const recentlyUsedIds = (
    await prisma.dailySentence.findMany({
      where: {
        user_id: userId,
        date: { gte: recycleDate.toISOString().split("T")[0] },
        sentence: { theme },
      },
      select: { sentence_id: true },
    })
  ).map((d) => d.sentence_id);

  // Get unused sentences for this theme (with optional difficulty filter)
  const baseWhere: Record<string, unknown> = { theme };
  if (difficulty) {
    baseWhere.difficulty = difficulty;
  }

  let candidates = await prisma.sentence.findMany({
    where: {
      ...baseWhere,
      id: { notIn: recentlyUsedIds },
    },
  });

  // If not enough candidates, fall back to all sentences of this theme
  if (candidates.length < DAILY_COUNT) {
    candidates = await prisma.sentence.findMany({ where: baseWhere });
  }

  // Shuffle and pick 3
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, DAILY_COUNT);

  // Create DailySentence records
  const dailySentences = await Promise.all(
    selected.map((sentence, index) =>
      prisma.dailySentence.create({
        data: {
          user_id: userId,
          sentence_id: sentence.id,
          theme,
          difficulty: effectiveDifficulty,
          date,
          order: index + 1,
        },
        include: { sentence: true },
      })
    )
  );

  return dailySentences;
}
