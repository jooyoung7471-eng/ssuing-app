import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { UserStats, Achievement } from '../types';

const DEFAULT_STATS: UserStats = {
  totalXp: 0,
  level: 1,
  streakDays: 0,
  longestStreak: 0,
  totalSentences: 0,
  totalPerfect: 0,
  xpForNextLevel: 50,
  xpProgress: 0,
};

const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlockedAt'>[] = [
  { type: 'first_writing', title: '첫 번째 작문', description: '첫 문장을 작성하세요', emoji: '\u{1F58A}\uFE0F' },
  { type: 'streak_3', title: '3일 연속', description: '3일 연속 학습하세요', emoji: '\u{1F525}' },
  { type: 'streak_7', title: '7일 연속', description: '7일 연속 학습하세요', emoji: '\u{1F525}' },
  { type: 'streak_30', title: '30일 연속', description: '30일 연속 학습하세요', emoji: '\u{1F525}' },
  { type: 'perfect_score', title: '첫 만점', description: '10점 만점을 받으세요', emoji: '\u2B50' },
  { type: 'sentences_10', title: '10문장 달성', description: '총 10문장을 완료하세요', emoji: '\u{1F4DD}' },
  { type: 'sentences_50', title: '50문장 달성', description: '총 50문장을 완료하세요', emoji: '\u{1F4DA}' },
  { type: 'sentences_100', title: '100문장 달성', description: '총 100문장을 완료하세요', emoji: '\u{1F4AF}' },
  { type: 'level_5', title: '레벨 5', description: '레벨 5에 도달하세요', emoji: '\u{1F3C6}' },
  { type: 'level_10', title: '레벨 10', description: '레벨 10에 도달하세요', emoji: '\u{1F451}' },
  { type: 'both_themes', title: '양쪽 테마 학습', description: '일상과 비즈니스 모두 학습하세요', emoji: '\u{1F310}' },
];

function computeXpProgress(totalXp: number, nextLevelXp: number, level: number): number {
  // XP needed for current level = previous level threshold
  // level formula: level = floor(sqrt(xp/50)) + 1
  // so xp for level N = (N-1)^2 * 50
  const currentLevelXp = (level - 1) * (level - 1) * 50;
  const range = nextLevelXp - currentLevelXp;
  if (range <= 0) return 0;
  return Math.min(1, Math.max(0, (totalXp - currentLevelXp) / range));
}

export function useGamification() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [achievements, setAchievements] = useState<Achievement[]>(
    ACHIEVEMENT_DEFS.map((a) => ({ ...a, unlockedAt: null })),
  );
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, achievementsRes] = await Promise.all([
        api.get('/gamification/stats').catch(() => null),
        api.get('/gamification/achievements').catch(() => null),
      ]);

      if (statsRes?.data?.data) {
        const raw = statsRes.data.data;
        const totalXp = raw.totalXP ?? raw.totalXp ?? 0;
        const level = raw.level ?? 1;
        const nextLevelXp = raw.nextLevelXP ?? raw.xpForNextLevel ?? 50;
        setStats({
          totalXp,
          level,
          streakDays: raw.streakDays ?? 0,
          longestStreak: raw.longestStreak ?? 0,
          totalSentences: raw.totalSentences ?? 0,
          totalPerfect: raw.totalPerfect ?? 0,
          xpForNextLevel: nextLevelXp,
          xpProgress: computeXpProgress(totalXp, nextLevelXp, level),
        });
      }

      if (achievementsRes?.data?.data) {
        const serverAchievements: any[] = achievementsRes.data.data || [];
        const merged = ACHIEVEMENT_DEFS.map((def) => {
          const server = serverAchievements.find((a: any) => a.type === def.type);
          return {
            ...def,
            unlockedAt: server?.unlockedAt ?? server?.unlocked_at ?? null,
          };
        });
        setAchievements(merged);
      }
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, achievements, loading, refetch: fetch };
}
