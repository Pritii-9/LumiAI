import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Clock, Copy, ExternalLink, List, Mail, MessageCircle, Plus, Hash } from 'lucide-react';
import { getInterviewPath, getInterviewUrl } from '@/lib/utils';
import type { InterviewFormData } from '@/types';

interface InterviewLinkProps {
  interview_id: string;
  formData: InterviewFormData;
}

export default function InterviewLink({ interview_id, formData }: InterviewLinkProps) {
  const url = getInterviewPath(interview_id);

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(getInterviewUrl(interview_id));
    toast.success('Link copied!');
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(`Interview Link: ${formData?.jobPosition || 'AI Interview'}`);
    const body = encodeURIComponent(`Here is the interview link: ${getInterviewUrl(interview_id)}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareBySlack = () => {
    window.open(`https://slack.com/app_redirect?channel=general&team=&text=${encodeURIComponent(getInterviewUrl(interview_id))}`, '_blank');
  };

  const shareByWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Interview link: ${getInterviewUrl(interview_id)}`)}`, '_blank');
  };

  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
          <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">Your AI interview is ready!</h2>
      <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">Share this link with your candidates to start the interview process.</p>

      <div className="mt-6 w-full rounded-[28px] bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 p-7 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Interview Link</h2>
          <span className="rounded bg-blue-50 dark:bg-[#0f6cbd]/10 px-2 py-1 text-sm text-[#0f6cbd]">Valid for 30 Days</span>
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={url}
            readOnly
            className="h-11 flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 text-sm outline-none"
          />
          <button
            onClick={onCopyLink}
            className="flex items-center gap-2 rounded-xl bg-[#0f6cbd] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f6cbd]/90 transition sm:min-w-36"
          >
            <Copy className="h-4 w-4" /> Copy Link
          </button>
          <Link to={url} className="sm:min-w-36">
            <button className="flex w-full items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <ExternalLink className="h-4 w-4" /> Open
            </button>
          </Link>
        </div>
        <hr className="my-5 border-slate-100 dark:border-slate-800" />
        <div className="flex flex-wrap gap-5">
          <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Clock className="h-4 w-4" /> {formData?.duration}</span>
          <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><List className="h-4 w-4" /> AI-generated questions</span>
        </div>
      </div>

      <div className="mt-7 w-full rounded-[28px] bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 p-5 shadow-sm">
        <h2 className="font-bold text-slate-900 dark:text-slate-100">Share Via</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:justify-around">
          <button onClick={shareByEmail} className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <Mail className="h-4 w-4" /> Email
          </button>
          <button onClick={shareBySlack} className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <Hash className="h-4 w-4" /> Slack
          </button>
          <button onClick={shareByWhatsApp} className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
        </div>
      </div>

      <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
        <Link to="/dashboard">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        </Link>
        <Link to="/dashboard/create-interview">
          <button className="flex items-center gap-2 rounded-xl bg-[#0f6cbd] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f6cbd]/90 transition">
            <Plus className="h-4 w-4" /> Create New Interview
          </button>
        </Link>
      </div>
    </div>
  );
}
