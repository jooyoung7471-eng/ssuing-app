import { useState, useCallback } from 'react';
import api from '../services/api';
import type { HistoryRecord, HistoryDetail, Pagination, Theme } from '../types';

interface UseHistoryReturn {
  records: HistoryRecord[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  fetch: (page?: number, theme?: Theme) => Promise<void>;
  fetchDetail: (id: string) => Promise<HistoryDetail | null>;
}

export function useHistory(): UseHistoryReturn {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (page = 1, theme?: Theme) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (theme) params.theme = theme;
      const res = await api.get('/history', { params });
      const newRecords = res.data.data;
      setRecords((prev) => (page === 1 ? newRecords : [...prev, ...newRecords]));
      setPagination(res.data.pagination);
    } catch (e) {
      setError(e instanceof Error ? e.message : '기록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id: string): Promise<HistoryDetail | null> => {
    try {
      const res = await api.get(`/history/${id}`);
      return res.data.data as HistoryDetail;
    } catch {
      return null;
    }
  }, []);

  return { records, pagination, loading, error, fetch, fetchDetail };
}
