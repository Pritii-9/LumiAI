import { CheckCircle, Send } from 'lucide-react';

export default function InterviewCompletedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl rounded-[32px] card p-6 text-center shadow-xl sm:p-8 lg:p-10">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center justify-center rounded-full bg-green-500 p-3 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold page-title sm:text-4xl">Interview Complete!</h1>
        <p className="mb-8 text-base page-subtitle sm:text-lg">
          Thank you for completing the AI-guided interview. Your responses and feedback have been saved successfully.
        </p>

        <div className="mb-8 flex flex-col items-center justify-center rounded-lg bg-blue-500/10 p-4 sm:p-6">
          <div className="mb-3 inline-flex items-center justify-center rounded-full bg-blue-500 p-3">
            <Send className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <h2 className="mb-2 text-2xl font-semibold page-title">What's Next?</h2>
          <p className="text-sm page-subtitle sm:text-base">
            The recruiter can now review your scorecard and feedback report from the dashboard.
          </p>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => window.close()}
            className="rounded-xl bg-[#0f6cbd] px-8 py-2.5 text-sm font-bold text-white hover:bg-[#0f6cbd]/90 transition shadow-md"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
