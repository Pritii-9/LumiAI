import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Interview } from '@/types';
import { useUser } from '@/context/UserContext';

interface UseInterviewListOptions {
  limit?: number;
}

interface Stats {
  totalInterviews: number;
  totalQuestions: number;
  activeInterviews: number;
}

export const useInterviewList = (options: UseInterviewListOptions = {}) => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { userEmail: user.email };
      if (options.limit) params.limit = options.limit;
      const { data } = await api.get<Interview[]>('/api/interviews', { params });
      setInterviewList(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load interviews.');
    } finally {
      setLoading(false);
    }
  }, [user?.email, options.limit]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const stats: Stats = {
    totalInterviews: interviewList.length,
    totalQuestions: interviewList.reduce((sum, i) => sum + (i.questionList?.length || 0), 0),
    activeInterviews: interviewList.filter((i) => (i.interviewFeedback?.length || 0) === 0).length,
  };

  return { interviewList, loading, error, refresh: fetchInterviews, stats };
};
