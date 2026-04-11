export type Theme = 'daily' | 'business' | 'travel';

export interface HintWord {
  english: string;
  korean: string;
}

export interface Highlight {
  original: string;
  corrected: string;
  reason: string;
}

export interface Sentence {
  id: string;
  koreanText: string;
  theme: Theme;
  difficulty: number;
  hintWords: HintWord[];
  order: number;
  isCompleted: boolean;
}

export interface CorrectionResult {
  id: string;
  sentenceId: string;
  userWriting: string;
  correctedSentence: string;
  explanation: string;
  score: number;
  highlights: Highlight[];
  createdAt: string;
  // 게이미피케이션 필드 (백엔드 교정 응답에 포함)
  xpEarned?: number;
  levelUp?: boolean;
  newLevel?: number;
  newAchievements?: { type: string; title: string; emoji: string }[];
  nativeExpressions?: string[];
  keyExpression?: {
    english: string;
    korean: string;
    example: string;
  };
}

export interface HistoryRecord {
  id: string;
  sentenceId: string;
  koreanText: string;
  userWriting: string;
  correctedSentence: string;
  score: number;
  createdAt: string;
}

export interface HistoryDetail extends HistoryRecord {
  explanation: string;
  highlights: Highlight[];
}

export interface LearningStats {
  totalCorrections: number;
  averageScore: number;
  streakDays: number;
  dailyStats: { date: string; count: number; averageScore: number }[];
  weeklyStats: { week: string; count: number; averageScore: number }[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  token: string;
}

export interface UserStats {
  totalXp: number;
  level: number;
  streakDays: number;
  longestStreak: number;
  totalSentences: number;
  totalPerfect: number;
  xpForNextLevel: number;
  xpProgress: number;
}

export interface Achievement {
  type: string;
  unlockedAt: string | null;
  title: string;
  description: string;
  emoji: string;
}

export interface WeeklyReport {
  totalSentences: number;
  averageScore: number;
  totalXp: number;
  dailyBreakdown: { date: string; count: number; avgScore: number }[];
  comparedToLastWeek: { sentences: number; score: number };
}

export interface ReviewItem {
  id: string;
  sentenceId: string;
  koreanText: string;
  userWriting: string;
  correctedSentence: string;
  score: number;
  createdAt: string;
}

export type Difficulty = 'beginner' | 'intermediate';

export interface ReviewSession {
  sessionId: string;
  sentences: Sentence[];
}

export interface ReviewResult {
  averageScore: number;
  best: { koreanText: string; score: number };
  worst: { koreanText: string; score: number };
  keyExpressions: { english: string; korean: string; example: string }[];
  details: { sentenceId: string; koreanText: string; userWriting: string; score: number }[];
}
