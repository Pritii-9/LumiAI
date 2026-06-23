import { Link } from 'react-router-dom';
import { CheckCircle, Send } from 'lucide-react';

export default function InterviewCompletedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-6 text-center shadow-xl sm:p-8 lg:p-10">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center justify-center rounded-full bg-green-500 p-3 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-slate-800 sm:text-4xl">Interview Complete!</h1>
        <p className="mb-8 text-base text-slate-600 sm:text-lg">
          Thank you for completing the AI-guided interview. Your responses and feedback have been saved successfully.
        </p>

        <div className="mb-8 flex flex-col items-center justify-center rounded-lg bg-blue-500/10 p-4 sm:p-6">
          <div className="mb-3 inline-flex items-center justify-center rounded-full bg-blue-500 p-3">
            <Send className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-slate-800">What's Next?</h2>
          <p className="text-sm text-slate-700 sm:text-base">
            The recruiter can now review your scorecard and feedback report from the dashboard.
          </p>
        </div>

        <div className="flex justify-center">
          <Link to="/">
            <button className="rounded-xl border border-slate-200 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
