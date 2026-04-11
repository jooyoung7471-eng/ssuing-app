import { useState, useCallback } from 'react';
import api from '../services/api';
import type { Sentence, Theme, Difficulty } from '../types';

interface UseDailySentencesReturn {
  sentences: Sentence[];
  loading: boolean;
  error: string | null;
  fetch: (theme: Theme, difficulty?: Difficulty) => Promise<void>;
}

export function useDailySentences(): UseDailySentencesReturn {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (theme: Theme, difficulty?: Difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { theme };
      if (difficulty) params.difficulty = difficulty;
      const res = await api.get('/sentences/daily', { params });
      setSentences(res.data.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '문장을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { sentences, loading, error, fetch };
}
