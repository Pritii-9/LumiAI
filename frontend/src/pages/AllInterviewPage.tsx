import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useInterviewList } from '@/hooks/useInterviewList';
import InterviewCard from '@/components/dashboard/InterviewCard';
import { Plus, Video, Loader2, Search, RefreshCw } from 'lucide-react';

export default function AllInterviewPage() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const { interviewList, loading, error, refresh, stats } = useInterviewList();

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return interviewList;
    const term = searchTerm.toLowerCase();
    return interviewList.filter(
      (i) => i.jobPosition?.toLowerCase().includes(term) || i.jobDescription?.toLowerCase().includes(term)
    );
  }, [interviewList, searchTerm]);

  return (
    <div className="my-5">
      <div className="mb-5 flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Previously Created Interviews</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Browse all saved interviews and manage candidate-ready sessions from one place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-300">Total: {stats.totalInterviews}</span>
          <button onClick={refresh} className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="mb-5">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search interviews by job title"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 p-10 dark:text-slate-300">
          <Loader2 className="h-10 w-10 animate-spin text-[#0f6cbd]" />
          <p>Loading your interviews...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 p-10 text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button onClick={refresh} className="rounded-xl bg-[#0f6cbd] px-4 py-2 text-sm text-white">Retry</button>
        </div>
      ) : !user?.email ? (
        <div className="flex flex-col items-center gap-3 p-10 text-slate-700 dark:text-slate-300">
          <Video className="h-10 w-10 text-[#0f6cbd]" />
          <p>Please sign in to access your interview list.</p>
          <Link to="/auth"><button className="rounded-xl bg-[#0f6cbd] px-4 py-2 text-sm text-white">Sign In</button></Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 p-10 dark:text-slate-300">
          <Video className="h-10 w-10 text-[#0f6cbd]" />
          <p>{searchTerm ? 'No interviews matched your search.' : 'You have no interviews saved yet.'}</p>
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
