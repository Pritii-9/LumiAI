import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Interview } from '@/types';
import { useUser } from '@/context/UserContext';
import { getAverageRating } from '@/lib/utils';

interface UseInterviewListOptions {
  limit?: number;
}

export interface InterviewStats {
  totalInterviews: number;
  completedInterviews: number;
  totalQuestions: number;
  activeInterviews: number;
  totalCandidates: number;
  avgScore: number;
  completionRate: number;
  monthlyData: { month: string; created: number; completed: number }[];
  scoreDistribution: { range: string; count: number }[];
}

export const useInterviewList = (options: UseInterviewListOptions = {}) => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState<Interview[]>([]);
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch all for analytics (no limit)
      const { data } = await api.get<Interview[]>('/api/interviews', { params: { userEmail: user.email } });
      setAllInterviews(data);
      // Apply limit for the card list
      setInterviewList(options.limit ? data.slice(0, options.limit) : data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load interviews.');
    } finally {
      setLoading(false);
    }
  }, [user?.email, options.limit]);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

  const stats: InterviewStats = (() => {
    const total = allInterviews.length;
    const completed = allInterviews.filter((i) => (i.interviewFeedback?.length || 0) > 0).length;
    const totalQ = allInterviews.reduce((s, i) => s + (i.questionList?.length || 0), 0);
    const active = total - completed;
    const allFeedbacks = allInterviews.flatMap((i) => i.interviewFeedback || []);
    const totalCandidates = allFeedbacks.length;
    const scores = allFeedbacks
      .map((fb) => getAverageRating(fb.feedback?.feedback?.rating || fb.feedback?.rating || {}))
      .filter((s) => s > 0);
    const avgScore = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Last 6 months monthly data
    const months: { month: string; created: number; completed: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      const y = d.getFullYear(), m = d.getMonth();
      const monthInterviews = allInterviews.filter((iv) => {
        const cd = new Date(iv.created_at);
        return cd.getFullYear() === y && cd.getMonth() === m;
      });
      months.push({
        month: label,
        created: monthInterviews.length,
        completed: monthInterviews.filter((iv) => (iv.interviewFeedback?.length || 0) > 0).length,
      });
    }

    // Score distribution buckets
    const buckets = [
      { range: '0–3', min: 0, max: 3 },
      { range: '4–5', min: 4, max: 5 },
      { range: '6–7', min: 6, max: 7 },
      { range: '8–9', min: 8, max: 9 },
      { range: '10', min: 10, max: 10 },
    ];
    const scoreDistribution = buckets.map(({ range, min, max }) => ({
      range,
      count: scores.filter((s) => s >= min && s <= max).length,
    }));

    return { totalInterviews: total, completedInterviews: completed, totalQuestions: totalQ, activeInterviews: active, totalCandidates, avgScore, completionRate, monthlyData: months, scoreDistribution };
  })();

  return { interviewList, allInterviews, loading, error, refresh: fetchInterviews, stats };
};

