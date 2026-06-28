import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/context/UserContext';
import type { InterviewFormData, InterviewQuestion } from '@/types';
import { extractJsonPayload } from '@/lib/utils';

interface QuestionListProps {
  formData: InterviewFormData;
  onCreateLink: (id: string) => void;
}

export default function QuestionList({ formData, onCreateLink }: QuestionListProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [savedLoading, setSavedLoading] = useState(false);
  const [questionList, setQuestionList] = useState<InterviewQuestion[]>([]);

  useEffect(() => {
    if (formData?.jobPosition && formData?.jobDescription && formData?.duration && formData?.type?.length) {
      generateQuestions();
    }
  }, []);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      let payload: any = formData;
      let headers: any = {};

      if (formData.resumeFile) {
        const fd = new FormData();
        if (formData.jobPosition) fd.append('jobPosition', formData.jobPosition);
        if (formData.jobDescription) fd.append('jobDescription', formData.jobDescription);
        if (formData.duration) fd.append('duration', formData.duration);
        if (formData.type) formData.type.forEach(t => fd.append('type', t));
        fd.append('resume', formData.resumeFile);
        payload = fd;
        headers = { 'Content-Type': 'multipart/form-data' };
      }

      const { data } = await api.post('/api/ai/generate-questions', payload, { headers });
      const parsed = extractJsonPayload(data.content);
      setQuestionList(parsed?.interviewQuestions || []);
      if (data.warning) toast.warning(data.warning);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Unable to generate questions right now.');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    if (!questionList?.length) { toast('Please wait for questions to finish loading.'); return; }
    setSavedLoading(true);
    const interview_id = uuidv4();
    try {
      const { data } = await api.post('/api/interviews', {
        ...formData,
        questionList,
        userEmail: user?.email,
        interview_id,
      });
      if (data?.interview_id || data?._id) {
        onCreateLink(interview_id);
      } else {
        throw new Error('Failed to save interview.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Server error. Try again.');
    } finally {
      setSavedLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="flex items-center gap-5 rounded-xl border border-[#0f6cbd] bg-blue-50 dark:bg-[#0f6cbd]/10 p-5">
          <Loader2 className="animate-spin text-[#0f6cbd]" />
          <div className="flex-1">
            <p className="font-medium text-slate-900 dark:text-slate-100">Generating Interview Questions</p>
            <p className="text-sm text-[#0f6cbd]">
              {formData.resumeFile
                ? "Tailoring questions based on the candidate's resume & job description…"
                : 'Our AI is crafting personalized questions based on your job position'}
            </p>
          </div>
          {formData.resumeFile && (
            <span className="flex-shrink-0 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ✦ Resume Personalized
            </span>
          )}
        </div>
      )}

      {questionList.length > 0 && (
        <div className="mt-5 rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Generated Questions</h3>
            {formData.resumeFile && (
              <span className="rounded-full border border-[#0f6cbd]/30 bg-blue-50 dark:bg-[#0f6cbd]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0f6cbd]">
                ✦ Resume-tailored
              </span>
            )}
          </div>
          <ul className="space-y-3">
            {questionList.map((q, idx) => (
              <li key={idx} className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0f6cbd]/10 text-xs font-bold text-[#0f6cbd]">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm text-slate-800 dark:text-slate-200">{q.question}</p>
                    <span className="mt-1 inline-block rounded-full bg-blue-50 dark:bg-[#0f6cbd]/10 px-2 py-0.5 text-xs text-[#0f6cbd]">{q.type}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 flex justify-end">
        <button
          onClick={onFinish}
          disabled={savedLoading || loading}
          className="flex items-center gap-2 rounded-xl bg-[#0f6cbd] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60 hover:bg-[#0f6cbd]/90 transition"
        >
          {savedLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Interview Link &amp; Finish
        </button>
      </div>
    </div>
  );
}
