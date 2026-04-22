import { useState, useCallback } from 'react';
import api from '../services/api';
import type { CorrectionResult } from '../types';

interface UseCorrectionReturn {
  result: CorrectionResult | null;
  loading: boolean;
  error: string | null;
  submit: (sentenceId: string, userWriting: string, difficulty?: string, koreanText?: string) => Promise<CorrectionResult | null>;
  reset: () => void;
}

export function useCorrection(): UseCorrectionReturn {
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (sentenceId: string, userWriting: string, difficulty?: string, koreanText?: string): Promise<CorrectionResult | null> => {
      setLoading(true);
      setError(null);
      try {
        const body: Record<string, string> = { sentenceId, userWriting };
        if (difficulty) body.difficulty = difficulty;
        if (koreanText) body.koreanText = koreanText;
        const res = await api.post('/corrections', body);
        const raw = res.data?.data;
        if (!raw) {
          setError('교정 결과를 받지 못했습니다.');
          return null;
        }
        const data = raw as CorrectionResult;
        setResult(data);
        return data;
      } catch (e) {
        setError(e instanceof Error ? e.message : '교정 요청에 실패했습니다.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, submit, reset };
}
