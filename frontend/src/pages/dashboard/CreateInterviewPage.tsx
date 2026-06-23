import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { InterviewFormData } from '@/types';
import FormContainer from '@/components/create-interview/FormContainer';
import QuestionList from '@/components/create-interview/QuestionList';
import InterviewLink from '@/components/create-interview/InterviewLink';

export default function CreateInterviewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<InterviewFormData>({});
  const [interviewId, setInterviewId] = useState<string | undefined>();

  const onHandleInputChange = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const onGoToNext = () => {
    if (!formData?.jobPosition || !formData?.jobDescription || !formData?.duration || !formData?.type?.length) {
      toast('Please enter all details');
      return;
    }
    setStep((s) => s + 1);
  };

  const onCreateLink = (id: string) => {
    setInterviewId(id);
    setStep((s) => s + 1);
  };

  const progressPct = step * 33.33;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-5">
        <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-slate-100 transition">
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">Create New Interview</h2>
      </div>

      {/* Progress bar */}
      <div className="my-5 h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-[#0f6cbd] transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {step === 1 && <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={onGoToNext} />}
      {step === 2 && <QuestionList formData={formData} onCreateLink={onCreateLink} />}
      {step === 3 && interviewId && <InterviewLink interview_id={interviewId} formData={formData} />}
    </div>
  );
}
