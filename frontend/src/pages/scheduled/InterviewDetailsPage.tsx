import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import type { Interview } from '@/types';
import { getAverageRating, formatUtcDate } from '@/lib/utils';
import { Loader2, CheckCircle2, XCircle, Star } from 'lucide-react';
import api from '@/lib/api';

export default function InterviewDetailsPage() {
  const { interview_id } = useParams<{ interview_id: string }>();
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email && interview_id) fetchDetails();
  }, [user?.email, interview_id]);

  const fetchDetails = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.get<Interview>(`/api/interviews/${interview_id}`);
      setInterviewDetail(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load interview details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="mt-5 flex justify-center p-10"><Loader2 className="h-10 w-10 animate-spin text-[#0f6cbd]" /></div>;
  if (error) return <div className="mt-5 p-5 text-center text-red-600">Error: {error}</div>;
  if (!interviewDetail) return <div className="mt-5 p-5 text-center text-slate-600">Interview not found.</div>;

  return (
    <div className="mt-5 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Interview Details</h2>
        <p className="mt-1 text-sm text-slate-500">
          {interviewDetail.jobPosition} • {interviewDetail.duration} • Created {formatUtcDate(interviewDetail.created_at)}
        </p>
      </div>

      {/* Candidate Feedback */}
      {interviewDetail.interviewFeedback?.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          No candidates have completed this interview yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {interviewDetail.interviewFeedback.map((fb, idx) => {
            const avg = getAverageRating(fb.feedback?.feedback?.rating || {});
            const rec = fb.feedback?.feedback?.recommendation;
            return (
              <div key={idx} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{fb.userName}</p>
                    <p className="text-xs text-slate-500">{fb.userEmail}</p>
                  </div>
                  {rec ? (
                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      <CheckCircle2 className="h-3 w-3" /> Recommended
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                      <XCircle className="h-3 w-3" /> Not Recommended
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-slate-900">{avg}/10</span>
                  <span className="text-xs text-slate-400">avg score</span>
                </div>

                {/* Rating bars */}
                <div className="mt-4 space-y-2">
                  {Object.entries(fb.feedback?.feedback?.rating || {}).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span>{val}/10</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100">
                        <div className="h-1.5 rounded-full bg-[#0f6cbd]" style={{ width: `${(Number(val) / 10) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-sm text-slate-600">{fb.feedback?.feedback?.summary}</p>
                <p className="mt-2 text-xs text-slate-400">{fb.feedback?.feedback?.recommendationMessage}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
