import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Achievement type constants
export const ACHIEVEMENT_TYPES = {
  FIRST_WRITING: "first_writing",
  STREAK_3: "streak_3",
  STREAK_7: "streak_7",
  STREAK_30: "streak_30",
  PERFECT_SCORE: "perfect_score",
  SENTENCES_10: "sentences_10",
  SENTENCES_50: "sentences_50",
  SENTENCES_100: "sentences_100",
  LEVEL_5: "level_5",
  LEVEL_10: "level_10",
  BOTH_THEMES: "both_themes",
} as const;

const ACHIEVEMENT_META: Record<string, { title: string; emoji: string }> = {
  [ACHIEVEMENT_TYPES.FIRST_WRITING]: { title: "첫 번째 작문", emoji: "\u{1F58A}\uFE0F" },
  [ACHIEVEMENT_TYPES.STREAK_3]: { title: "3일 연속", emoji: "\u{1F525}" },
  [ACHIEVEMENT_TYPES.STREAK_7]: { title: "7일 연속", emoji: "\u{1F525}" },
  [ACHIEVEMENT_TYPES.STREAK_30]: { title: "30일 연속", emoji: "\u{1F525}" },
  [ACHIEVEMENT_TYPES.PERFECT_SCORE]: { title: "첫 만점", emoji: "\u2B50" },
  [ACHIEVEMENT_TYPES.SENTENCES_10]: { title: "10문장 달성", emoji: "\u{1F4DD}" },
  [ACHIEVEMENT_TYPES.SENTENCES_50]: { title: "50문장 달성", emoji: "\u{1F4DA}" },
  [ACHIEVEMENT_TYPES.SENTENCES_100]: { title: "100문장 달성", emoji: "\u{1F4AF}" },
  [ACHIEVEMENT_TYPES.LEVEL_5]: { title: "레벨 5", emoji: "\u{1F3C6}" },
  [ACHIEVEMENT_TYPES.LEVEL_10]: { title: "레벨 10", emoji: "\u{1F451}" },
  [ACHIEVEMENT_TYPES.BOTH_THEMES]: { title: "양쪽 테마 학습", emoji: "\u{1F310}" },
};

const BASE_XP = 10;

export function calculateXP(score: number): number {
  return BASE_XP + score * 3;
}

export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 50)) + 1;
}

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getYesterdayString(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return now.toISOString().slice(0, 10);
}

export interface GamificationResult {
  xpEarned: number;
  levelUp: boolean;
  newLevel: number;
  newAchievements: Array<{ type: string; title: string; emoji: string }>;
}

export async function processCorrection(
  userId: string,
  score: number,
  sentenceId: string
): Promise<GamificationResult> {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const xpEarned = calculateXP(score);

  // Get or create UserStats
  let stats = await prisma.userStats.findUnique({ where: { user_id: userId } });
  if (!stats) {
    stats = await prisma.userStats.create({
      data: { user_id: userId },
    });
  }

  // Calculate streak
  let newStreakDays = stats.streak_days;
  if (stats.last_practice_date === today) {
    // Already practiced today, no streak change
  } else if (stats.last_practice_date === yesterday) {
    newStreakDays = stats.streak_days + 1;
  } else {
    newStreakDays = 1; // Reset
  }
  const newLongestStreak = Math.max(stats.longest_streak, newStreakDays);

  // Calculate new totals
  const newTotalXP = stats.total_xp + xpEarned;
  const newTotalSentences = stats.total_sentences + 1;
  const newTotalPerfect = score === 10 ? stats.total_perfect + 1 : stats.total_perfect;
  const oldLevel = stats.level;
  const newLevel = calculateLevel(newTotalXP);
  const levelUp = newLevel > oldLevel;

  // Update stats
  await prisma.userStats.update({
    where: { user_id: userId },
    data: {
      total_xp: newTotalXP,
      level: newLevel,
      streak_days: newStreakDays,
      longest_streak: newLongestStreak,
      last_practice_date: today,
      total_sentences: newTotalSentences,
      total_perfect: newTotalPerfect,
    },
  });

  // Check achievements
  const newAchievements: Array<{ type: string; title: string; emoji: string }> = [];

  async function tryUnlock(type: string): Promise<boolean> {
    const existing = await prisma.achievement.findUnique({
      where: { user_id_type: { user_id: userId, type } },
    });
    if (existing) return false;
    await prisma.achievement.create({
      data: { user_id: userId, type },
    });
    const meta = ACHIEVEMENT_META[type] || { title: type, emoji: "\u{1F3C5}" };
    newAchievements.push({ type, title: meta.title, emoji: meta.emoji });
    return true;
  }

  // first_writing
  if (newTotalSentences === 1) {
    await tryUnlock(ACHIEVEMENT_TYPES.FIRST_WRITING);
  }

  // streak achievements
  if (newStreakDays >= 3) await tryUnlock(ACHIEVEMENT_TYPES.STREAK_3);
  if (newStreakDays >= 7) await tryUnlock(ACHIEVEMENT_TYPES.STREAK_7);
  if (newStreakDays >= 30) await tryUnlock(ACHIEVEMENT_TYPES.STREAK_30);

  // perfect score
  if (score === 10) {
    await tryUnlock(ACHIEVEMENT_TYPES.PERFECT_SCORE);
  }

  // sentence milestones
  if (newTotalSentences >= 10) await tryUnlock(ACHIEVEMENT_TYPES.SENTENCES_10);
  if (newTotalSentences >= 50) await tryUnlock(ACHIEVEMENT_TYPES.SENTENCES_50);
  if (newTotalSentences >= 100) await tryUnlock(ACHIEVEMENT_TYPES.SENTENCES_100);

  // level milestones
  if (newLevel >= 5) await tryUnlock(ACHIEVEMENT_TYPES.LEVEL_5);
  if (newLevel >= 10) await tryUnlock(ACHIEVEMENT_TYPES.LEVEL_10);

  // both_themes: check if user has corrections on both daily and business sentences
  const sentence = await prisma.sentence.findUnique({ where: { id: sentenceId } });
  if (sentence) {
    const themes = await prisma.correction.findMany({
      where: { user_id: userId },
      select: { sentence: { select: { theme: true } } },
      distinct: ["sentence_id"],
    });
    const uniqueThemes = new Set(themes.map((t) => t.sentence.theme));
    if (uniqueThemes.has("daily") && uniqueThemes.has("business")) {
      await tryUnlock(ACHIEVEMENT_TYPES.BOTH_THEMES);
    }
  }

  return { xpEarned, levelUp, newLevel, newAchievements };
}

export async function getStats(userId: string) {
  let stats = await prisma.userStats.findUnique({ where: { user_id: userId } });
  if (!stats) {
    stats = await prisma.userStats.create({
      data: { user_id: userId },
    });
  }
  return {
    totalXP: stats.total_xp,
    level: stats.level,
    streakDays: stats.streak_days,
    longestStreak: stats.longest_streak,
    streakFreezeCount: stats.streak_freeze_count,
    lastPracticeDate: stats.last_practice_date,
    totalSentences: stats.total_sentences,
    totalPerfect: stats.total_perfect,
    nextLevelXP: Math.pow(stats.level, 2) * 50, // XP needed for current level threshold
  };
}

export async function getAchievements(userId: string) {
  const achievements = await prisma.achievement.findMany({
    where: { user_id: userId },
    orderBy: { unlocked_at: "desc" },
  });
  return achievements.map((a) => ({
    type: a.type,
    label: ACHIEVEMENT_META[a.type]?.title || a.type,
    unlockedAt: a.unlocked_at.toISOString(),
  }));
}

export async function getWeeklyReport(userId: string) {
  const now = new Date();
  // Monday of this week
  const dayOfWeek = now.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - mondayOffset);
  thisMonday.setHours(0, 0, 0, 0);

  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);

  // This week corrections
  const thisWeekCorrections = await prisma.correction.findMany({
    where: {
      user_id: userId,
      created_at: { gte: thisMonday },
    },
    orderBy: { created_at: "asc" },
  });

  // Last week corrections
  const lastWeekCorrections = await prisma.correction.findMany({
    where: {
      user_id: userId,
      created_at: { gte: lastMonday, lt: thisMonday },
    },
  });

  // Daily breakdown for this week
  const dailyMap: Record<string, { count: number; totalScore: number; totalXP: number }> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(thisMonday);
    d.setDate(thisMonday.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = { count: 0, totalScore: 0, totalXP: 0 };
  }

  let thisWeekTotalXP = 0;
  let thisWeekTotalScore = 0;
  for (const c of thisWeekCorrections) {
    const key = c.created_at.toISOString().slice(0, 10);
    if (dailyMap[key]) {
      dailyMap[key].count++;
      dailyMap[key].totalScore += c.score;
      const xp = calculateXP(c.score);
      dailyMap[key].totalXP += xp;
      thisWeekTotalXP += xp;
      thisWeekTotalScore += c.score;
    }
  }

  const daily = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    sentenceCount: data.count,
    averageScore: data.count > 0 ? Math.round((data.totalScore / data.count) * 10) / 10 : 0,
    xpEarned: data.totalXP,
  }));

  const thisWeekCount = thisWeekCorrections.length;
  const lastWeekCount = lastWeekCorrections.length;
  const lastWeekTotalScore = lastWeekCorrections.reduce((sum, c) => sum + c.score, 0);

  return {
    daily,
    summary: {
      totalSentences: thisWeekCount,
      averageScore:
        thisWeekCount > 0
          ? Math.round((thisWeekTotalScore / thisWeekCount) * 10) / 10
          : 0,
      totalXP: thisWeekTotalXP,
      comparedToLastWeek: {
        sentencesDiff: thisWeekCount - lastWeekCount,
        averageScoreDiff:
          thisWeekCount > 0 && lastWeekCount > 0
            ? Math.round(
                ((thisWeekTotalScore / thisWeekCount -
                  lastWeekTotalScore / lastWeekCount) *
                  10) /
                  10
              ) / 1 // keep one decimal
            : 0,
      },
    },
  };
}
