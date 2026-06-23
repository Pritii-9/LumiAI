import { useEffect, useState } from 'react';
import axios from 'axios';
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
      const { data } = await axios.post('/api/ai/generate-questions', formData);
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
      const { data } = await axios.post('/api/interviews', {
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
        <div className="flex items-center gap-5 rounded-xl border border-[#0f6cbd] bg-blue-50 p-5">
          <Loader2 className="animate-spin text-[#0f6cbd]" />
          <div>
            <p className="font-medium">Generating Interview Questions</p>
            <p className="text-sm text-[#0f6cbd]">Our AI is crafting personalized questions based on your job position</p>
          </div>
        </div>
      )}

      {questionList.length > 0 && (
        <div className="mt-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-900">Generated Questions</h3>
          <ul className="space-y-3">
            {questionList.map((q, idx) => (
              <li key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0f6cbd]/10 text-xs font-bold text-[#0f6cbd]">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm text-slate-800">{q.question}</p>
                    <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-[#0f6cbd]">{q.type}</span>
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
          Create Interview Link & Finish
        </button>
      </div>
    </div>
  );
}
