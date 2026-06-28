import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { InterviewFormData } from '@/types';
import FormContainer from '@/components/create-interview/FormContainer';
import QuestionList from '@/components/create-interview/QuestionList';
import InterviewLink from '@/components/create-interview/InterviewLink';
import { useCallback } from 'react';

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

  const stepLabels = ['Details', 'Questions', 'Share'];

  return (
    <div className="mx-auto max-w-5xl page-enter">
      {/* Header with back + stepper */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl btn-ghost hover:scale-105 active:scale-95 transition-all duration-150"
          title="Back"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold page-title">Create New Interview</h1>
          <p className="text-xs page-subtitle">Step {step} of 3 — {stepLabels[step - 1]}</p>
        </div>
        {/* Step pills */}
        <div className="hidden sm:flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                i + 1 < step ? 'bg-emerald-500 text-white' :
                i + 1 === step ? 'bg-[#0f6cbd] text-white shadow-md shadow-blue-500/30' :
                'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {i + 1 < step ? '✓' : i + 1}
              </span>
              <span className={`text-xs font-medium ${i + 1 === step ? 'text-[#0f6cbd]' : 'page-subtitle'}`}>{label}</span>
              {i < 2 && <span className="text-slate-300 dark:text-slate-600">›</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-1.5 rounded-full bg-[#0f6cbd] transition-all duration-500 shadow-sm shadow-blue-500/30"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {step === 1 && <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={onGoToNext} />}
      {step === 2 && <QuestionList formData={formData} onCreateLink={onCreateLink} />}
      {step === 3 && interviewId && <InterviewLink interview_id={interviewId} formData={formData} />}
    </div>
  );
}
