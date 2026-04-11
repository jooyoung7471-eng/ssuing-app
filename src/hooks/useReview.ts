import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import type { ReviewItem } from '../types';

export function useReview() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/review/weak');
      setItems(res.data?.data ?? []);
    } catch (e: any) {
      setError(e.message || '오답 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { items, loading, error, refetch: fetch };
}
