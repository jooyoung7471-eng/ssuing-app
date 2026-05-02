import { useState, useCallback } from 'react';
import { getDailySentences } from '../services/localSentences';
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
      // 1단계: 로컬에서 문장 선정
      const localSentences = await getDailySentences(
        theme,
        difficulty || 'beginner',
      );

      // 테마에 문장이 없는 경우 (travel 등 아직 미준비)
      if (localSentences.length === 0) {
        setSentences([]);
        return;
      }

      // 2단계: 서버에 선정 결과 동기화 (완료 상태 반영)
      try {
        const res = await api.post('/sentences/daily/sync', {
          theme,
          difficulty: difficulty || 'beginner',
          sentenceIds: localSentences.map((s) => s.id),
          sentenceTexts: localSentences.map((s) => s.koreanText),
        });
        // 서버 응답에 isCompleted 정보가 있으면 병합 (로컬 데이터 + 서버 완료 상태)
        if (res.data?.data && Array.isArray(res.data.data)) {
          const completedFromServer = new Map<string, boolean>();
          for (const s of res.data.data) {
            if (s && typeof s.id === 'string') {
              completedFromServer.set(s.id, !!s.isCompleted);
            }
          }
          const merged = localSentences.map((s) => ({
            ...s,
            isCompleted: !!s.isCompleted || !!completedFromServer.get(s.id),
          }));
          setSentences(merged);
        } else {
          setSentences(localSentences);
        }
      } catch {
        // 서버 연결 실패 시 로컬 데이터만 사용 (오프라인 지원)
        setSentences(localSentences);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : '문장을 불러오지 못했습니다.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { sentences, loading, error, fetch };
}
