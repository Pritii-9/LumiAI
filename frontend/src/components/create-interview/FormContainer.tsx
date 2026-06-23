import { useEffect, useState } from 'react';
import { Brain, Users, Briefcase, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const InterviewTypes: { icon: LucideIcon; title: string }[] = [
  { icon: Brain, title: 'Technical' },
  { icon: Users, title: 'Behavioral' },
  { icon: Briefcase, title: 'Experience' },
  { icon: Lightbulb, title: 'Problem Solving' },
  { icon: TrendingUp, title: 'Leadership' },
];

interface FormContainerProps {
  onHandleInputChange: (field: string, value: unknown) => void;
  GoToNext: () => void;
}

export default function FormContainer({ onHandleInputChange, GoToNext }: FormContainerProps) {
  const [interviewType, setInterviewType] = useState<string[]>([]);

  useEffect(() => {
    onHandleInputChange('type', interviewType);
  }, [interviewType]);

  const toggleType = (title: string) => {
    setInterviewType((prev) => prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]);
  };

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-sm font-medium text-slate-700">Job Position</p>
        <input
          placeholder="e.g. Full Stack Developer"
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20"
          onChange={(e) => onHandleInputChange('jobPosition', e.target.value)}
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700">Job Description</p>
        <textarea
          placeholder="Enter the role summary, responsibilities, and key expectations"
          className="mt-2 h-[150px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 resize-none"
          onChange={(e) => onHandleInputChange('jobDescription', e.target.value)}
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700">Interview Duration</p>
        <select
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20"
          onChange={(e) => onHandleInputChange('duration', e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select Duration</option>
          <option value="5 Min">5 Min</option>
          <option value="15 Min">15 Min</option>
          <option value="30 Min">30 Min</option>
          <option value="45 Min">45 Min</option>
          <option value="60 Min">60 Min</option>
        </select>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700">Interview Type</p>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
          {InterviewTypes.map((type) => {
            const active = interviewType.includes(type.title);
            return (
              <button
                key={type.title}
                onClick={() => toggleType(type.title)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all duration-200 ${
                  active ? 'border-[#0f6cbd] bg-blue-50 text-[#0f6cbd]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <type.icon className={`h-4 w-4 ${active ? 'text-[#0f6cbd]' : 'text-slate-400'}`} />
                {type.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <button
          onClick={GoToNext}
          className="flex items-center gap-2 rounded-xl bg-[#0f6cbd] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0f6cbd]/90 transition"
        >
          Generate Questions <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
