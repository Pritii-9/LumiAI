import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useInterviewList } from '@/hooks/useInterviewList';
import InterviewCard from './InterviewCard';
import { Plus, Video, Loader2, RefreshCw, Search } from 'lucide-react';

export default function LatestInterviewList() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const { interviewList, loading, error, refresh, stats } = useInterviewList({ limit: 6 });

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return interviewList;
    const term = searchTerm.toLowerCase();
    return interviewList.filter(
      (i) => i.jobPosition?.toLowerCase().includes(term) || i.jobDescription?.toLowerCase().includes(term)
    );
  }, [interviewList, searchTerm]);

  return (
    <div className="my-6">
      <div className="mb-5 rounded-[32px] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Previously Created Interviews</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Saved interviews appear here for quick review, sharing, and scheduling.</p>
          </div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-3">
            {[
              { label: 'Saved', value: stats.totalInterviews },
              { label: 'AI Questions', value: stats.totalQuestions },
              { label: 'Open', value: stats.activeInterviews },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl bg-white p-4 text-center shadow-sm dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title or description"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <button onClick={refresh} className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 p-10">
          <Loader2 className="h-10 w-10 animate-spin text-[#0f6cbd]" />
          <p>Loading your interviews...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 p-10 text-red-600">
          <p>{error}</p>
          <button onClick={refresh} className="rounded-xl bg-[#0f6cbd] px-4 py-2 text-sm text-white">Retry</button>
        </div>
      ) : !user?.email ? (
        <div className="flex flex-col items-center gap-3 p-10 text-slate-700 dark:text-slate-300">
          <Video className="h-10 w-10 text-[#0f6cbd]" />
          <p>Please sign in to view your saved interviews.</p>
          <Link to="/auth"><button className="rounded-xl bg-[#0f6cbd] px-4 py-2 text-sm text-white">Sign In</button></Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 p-10 dark:text-slate-300">
          <Video className="h-10 w-10 text-[#0f6cbd]" />
          <p>{searchTerm ? 'No interviews matched your search.' : 'You have no interviews yet.'}</p>
          <Link to="/dashboard/create-interview">
            <button className="flex items-center gap-2 rounded-xl bg-[#0f6cbd] px-4 py-2 text-sm text-white">
              <Plus className="h-4 w-4" /> Create New Interview
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((interview, idx) => (
            <InterviewCard key={interview.interview_id || idx} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}
