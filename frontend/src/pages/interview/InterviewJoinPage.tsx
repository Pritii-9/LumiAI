import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Clock, Info, Loader2, Video, ArrowLeft } from 'lucide-react';
import { InterviewDataContext } from '@/context/InterviewDataContext';
import type { Interview } from '@/types';
import api from '@/lib/api';

export default function InterviewJoinPage() {
  const { interview_id } = useParams<{ interview_id: string }>();
  const [interviewData, setInterviewData] = useState<Interview | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const { setInterviewInfo } = useContext(InterviewDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (interview_id) fetchInterview();
  }, [interview_id]);

  const fetchInterview = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Interview>(`/api/interviews/${interview_id}`);
      setInterviewData(data);
    } catch {
      toast.error('Interview not found. Please check the link.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onJoinInterview = async () => {
    if (!userName.trim()) { toast.error('Please enter your full name.'); return; }
    if (!isValidEmail(userEmail)) { toast.error('Please enter a valid email.'); return; }
    if (!interviewData) { toast.error('Interview data unavailable.'); return; }

    setInterviewInfo({ userName: userName.trim(), userEmail: userEmail.trim(), interviewData });
    navigate(`/interview/${interview_id}/start`);
  };

  if (loading && !interviewData) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-[#0f6cbd]" /></div>;
  }

  if (!interviewData && !loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-slate-600">
        <p className="text-xl">Interview not found.</p>
        <button onClick={fetchInterview} className="rounded-xl bg-[#0f6cbd] px-4 py-2 text-white text-sm">Retry</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 relative page-enter">
      <button 
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 sm:left-6 sm:top-6 flex h-10 w-10 items-center justify-center rounded-xl btn-ghost shadow-sm z-10"
        title="Back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="mt-8 flex flex-col items-center justify-center rounded-[28px] card shadow-lg p-6 sm:p-8 lg:px-20 xl:px-28">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f6cbd] text-xl font-black text-white mb-3">AI</div>
        <h2 className="mt-3 text-center text-sm font-medium uppercase tracking-[0.24em] page-subtitle">AI-Powered Interview Platform</h2>
        <Video className="my-6 h-24 w-24 text-[#0f6cbd]/30" />
        <h2 className="text-center text-2xl font-bold page-title">{interviewData?.jobPosition}</h2>
        <h2 className="mt-2 flex items-center gap-2 page-subtitle">
          <Clock className="h-4 w-4" /> {interviewData?.duration}
        </h2>

        <div className="mt-6 grid w-full gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium label">Enter your full name</p>
            <input
              placeholder="e.g. Lisa Watson"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="h-11 w-full rounded-xl input px-4 text-sm"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium label">Enter your email</p>
            <input
              placeholder="e.g. lisa@gmail.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              type="email"
              className="h-11 w-full rounded-xl input px-4 text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex w-full flex-col gap-2 rounded-2xl bg-blue-50 dark:bg-[#0f6cbd]/10 border border-blue-100 dark:border-[#0f6cbd]/20 p-4">
          <div className="flex items-center gap-2">
            <Info className="text-[#0f6cbd]" />
            <p className="font-bold">Before you begin</p>
          </div>
          <ul className="ml-2 list-inside list-disc space-y-1">
            <li className="text-sm text-[#0f6cbd]">Test your camera and microphone.</li>
            <li className="text-sm text-[#0f6cbd]">Ensure you have a suitable internet connection.</li>
            <li className="text-sm text-[#0f6cbd]">Find a quiet place for the interview.</li>
          </ul>
        </div>

        <button
          className="mt-6 flex h-11 items-center gap-2 rounded-xl bg-[#0f6cbd] px-8 font-bold text-white disabled:opacity-50 hover:bg-[#0f6cbd]/90 transition"
          onClick={onJoinInterview}
          disabled={!userName.trim() || !isValidEmail(userEmail) || !interviewData}
        >
          <Video className="h-4 w-4" /> Join Interview
        </button>
      </div>
    </div>
  );
}
