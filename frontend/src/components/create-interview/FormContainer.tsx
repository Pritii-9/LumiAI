import { useEffect, useRef, useState } from 'react';
import {
  Brain,
  Users,
  Briefcase,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  UploadCloud,
  FileText,
  Loader2,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const InterviewTypes: { icon: LucideIcon; title: string }[] = [
  { icon: Brain, title: 'Technical' },
  { icon: Users, title: 'Behavioral' },
  { icon: Briefcase, title: 'Experience' },
  { icon: Lightbulb, title: 'Problem Solving' },
  { icon: TrendingUp, title: 'Leadership' },
];

interface ResumeInsights {
  name: string;
  skills: string[];
  experienceSummary: string;
  yearsOfExperience: string;
}

interface FormContainerProps {
  onHandleInputChange: (field: string, value: unknown) => void;
  GoToNext: () => void;
}

export default function FormContainer({ onHandleInputChange, GoToNext }: FormContainerProps) {
  const [interviewType, setInterviewType] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const [insights, setInsights] = useState<ResumeInsights | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onHandleInputChange('type', interviewType);
  }, [interviewType]);

  const toggleType = (title: string) => {
    setInterviewType((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setInsights(null);
    onHandleInputChange('resumeFile', file);

    setParsing(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const { data } = await api.post('/api/ai/parse-resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setInsights(data);
    } catch (err: any) {
      toast.warning('Could not extract resume insights — questions will still be personalized.');
    } finally {
      setParsing(false);
    }
  };

  const clearResume = () => {
    setFileName(null);
    setInsights(null);
    onHandleInputChange('resumeFile', undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="rounded-[28px] bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6 border border-transparent dark:border-slate-800">
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Job Position</p>
        <input
          placeholder="e.g. Full Stack Developer"
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20"
          onChange={(e) => onHandleInputChange('jobPosition', e.target.value)}
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Job Description</p>
        <textarea
          placeholder="Enter the role summary, responsibilities, and key expectations"
          className="mt-2 h-[150px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 resize-none"
          onChange={(e) => onHandleInputChange('jobDescription', e.target.value)}
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Interview Duration</p>
        <select
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20"
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
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Interview Type</p>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
          {InterviewTypes.map((type) => {
            const active = interviewType.includes(type.title);
            return (
              <button
                key={type.title}
                onClick={() => toggleType(type.title)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all duration-200 ${
                  active
                    ? 'border-[#0f6cbd] bg-blue-50 dark:bg-[#0f6cbd]/10 text-[#0f6cbd]'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <type.icon className={`h-4 w-4 ${active ? 'text-[#0f6cbd]' : 'text-slate-400 dark:text-slate-500'}`} />
                {type.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Resume Upload ── */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Candidate Resume</p>
          <span className="text-xs text-slate-400 dark:text-slate-500 italic">Optional · PDF only · Max 5 MB</span>
        </div>

        {!fileName ? (
          <label className="mt-2 flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-[#0f6cbd]/5 hover:border-[#0f6cbd]/40 transition-all duration-200">
            <div className="flex flex-col items-center justify-center gap-1">
              <UploadCloud className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-[#0f6cbd]">Click to upload</span> or drag &amp; drop
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="mt-2 space-y-3">
            {/* File chip */}
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3">
              <FileText className="h-5 w-5 flex-shrink-0 text-emerald-500" />
              <p className="flex-1 truncate text-sm font-medium text-emerald-700 dark:text-emerald-400">{fileName}</p>
              {parsing ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#0f6cbd]" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
              <button
                onClick={clearResume}
                className="ml-1 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 transition"
                title="Remove resume"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Parsing spinner */}
            {parsing && (
              <div className="flex items-center gap-2 rounded-xl border border-blue-200 dark:border-[#0f6cbd]/30 bg-blue-50 dark:bg-[#0f6cbd]/10 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-[#0f6cbd]" />
                <p className="text-sm text-[#0f6cbd] font-medium">Extracting resume insights…</p>
              </div>
            )}

            {/* Insights card */}
            {!parsing && insights && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 dark:from-slate-800 to-blue-50/40 dark:to-[#0f6cbd]/5 p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#0f6cbd]" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0f6cbd]">
                    Resume Insights
                  </p>
                  {insights.yearsOfExperience && (
                    <span className="ml-auto rounded-full bg-[#0f6cbd]/10 px-2 py-0.5 text-xs font-medium text-[#0f6cbd]">
                      {insights.yearsOfExperience}
                    </span>
                  )}
                </div>

                {insights.name && insights.name !== 'Candidate' && (
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{insights.name}</p>
                )}

                {insights.experienceSummary && (
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{insights.experienceSummary}</p>
                )}

                {insights.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {insights.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[#0f6cbd]/20 bg-white dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-[#0f6cbd]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                  ✦ Questions will be tailored to this candidate's background
                </p>
              </div>
            )}
          </div>
        )}
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
