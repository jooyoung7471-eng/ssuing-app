import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { WeeklyReport } from '../types';

const DEFAULT_REPORT: WeeklyReport = {
  totalSentences: 0,
  averageScore: 0,
  totalXp: 0,
  dailyBreakdown: [],
  comparedToLastWeek: { sentences: 0, score: 0 },
};

export function useWeeklyReport() {
  const [report, setReport] = useState<WeeklyReport>(DEFAULT_REPORT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/gamification/weekly-report');
      const raw = res.data?.data;
      if (raw) {
        // Map API response to frontend type
        const summary = raw.summary || raw;
        const daily = raw.daily || raw.dailyBreakdown || [] as any[];

        setReport({
          totalSentences: summary.totalSentences ?? 0,
          averageScore: summary.averageScore ?? 0,
          totalXp: summary.totalXP ?? summary.totalXp ?? 0,
          dailyBreakdown: daily.map((d: any) => ({
            date: d.date,
            count: d.sentenceCount ?? d.count ?? 0,
            avgScore: d.averageScore ?? d.avgScore ?? 0,
          })),
          comparedToLastWeek: {
            sentences: summary.comparedToLastWeek?.sentencesDiff ?? summary.comparedToLastWeek?.sentences ?? 0,
            score: summary.comparedToLastWeek?.averageScoreDiff ?? summary.comparedToLastWeek?.score ?? 0,
          },
        });
      }
    } catch (e: any) {
      setError(e.message || '주간 리포트를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { report, loading, error, refetch: fetch };
}
