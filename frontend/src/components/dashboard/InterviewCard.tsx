import type { Interview } from '@/types';
import { ArrowRight, Copy, ExternalLink, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { formatUtcDate, getInterviewPath, getInterviewUrl } from '@/lib/utils';

interface InterviewCardProps {
  interview: Interview;
  viewDetail?: boolean;
}

export default function InterviewCard({ interview, viewDetail = false }: InterviewCardProps) {
  const interviewPath = getInterviewPath(interview.interview_id);

  const copyLink = async () => {
    await navigator.clipboard.writeText(getInterviewUrl(interview.interview_id));
    toast.success('Link copied to clipboard!');
  };

  const onSend = () => {
    const subject = encodeURIComponent(`Interview Link: ${interview.jobPosition || 'AI Interview'}`);
    const body = encodeURIComponent(`Here is the interview link: ${getInterviewUrl(interview.interview_id)}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-full bg-[#0f6cbd]/15 dark:bg-[#0f6cbd]/30" />
        <p className="text-sm text-slate-500 dark:text-slate-400">{formatUtcDate(interview.created_at)}</p>
      </div>
      <h2 className="mt-3 text-lg font-black text-slate-900 dark:text-slate-100">{interview.jobPosition}</h2>
      <div className="mt-2 flex justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>{interview.duration}</span>
        <span className="text-green-700 dark:text-green-400">{interview.interviewFeedback?.length ?? 0} Candidates</span>
      </div>

      {!viewDetail ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link to={interviewPath} className="flex-1">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-sm hover:bg-slate-50 transition dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
              <ExternalLink className="h-4 w-4" /> Open
            </button>
          </Link>
          <button onClick={copyLink} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-sm hover:bg-slate-50 transition dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
            <Copy className="h-4 w-4" /> Copy Link
          </button>
          <button onClick={onSend} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0f6cbd] py-2 text-sm text-white hover:bg-[#0f6cbd]/90 transition dark:shadow-sm dark:shadow-blue-500/20">
            <Send className="h-4 w-4" /> Send
          </button>
        </div>
      ) : (
        <Link to={`/scheduled-interview/${interview.interview_id}/details`} className="mt-5 block">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-sm hover:bg-slate-50 transition dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
            View Details <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      )}
    </div>
  );
}
