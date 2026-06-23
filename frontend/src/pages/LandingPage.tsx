import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_30px_80px_rgba(16,36,63,0.12)] backdrop-blur">
        {/* Navbar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f6cbd] text-sm font-black text-white">AI</div>
            <span className="font-bold text-slate-900">AI Interview Prep</span>
            <span className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 sm:inline-flex">
              Smarter hiring practice
            </span>
          </div>
          <Link to="/auth">
            <button className="rounded-full bg-[#0f6cbd] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0f6cbd]/90 transition">
              Launch App
            </button>
          </Link>
        </div>

        {/* Hero */}
        <div className="grid gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              Create, share, and review AI interviews in one workspace
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Interview workflows built for real hiring teams.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Create interview sessions, share secure candidate links, run AI-guided question rounds, and collect structured feedback in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/auth">
                <button className="rounded-full bg-[#0f6cbd] px-6 py-3 font-semibold text-white hover:bg-[#0f6cbd]/90 transition">
                  Get Started Free
                </button>
              </Link>
            </div>

            {/* Feature cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <Users className="h-8 w-8 text-blue-700" />
                <h2 className="mt-4 font-semibold text-slate-900">Candidate-ready links</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Share polished interview sessions with one clean link.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <Sparkles className="h-8 w-8 text-emerald-600" />
                <h2 className="mt-4 font-semibold text-slate-900">AI question generation</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Generate role-specific questions from the job brief in seconds.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <CheckCircle2 className="h-8 w-8 text-sky-700" />
                <h2 className="mt-4 font-semibold text-slate-900">Structured feedback</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Review technical, communication, and recommendation scoring clearly.</p>
              </div>
            </div>
          </div>

          {/* Demo card */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[32px] bg-[linear-gradient(135deg,rgba(15,108,189,0.12),rgba(66,184,131,0.12))]" />
            <div className="relative rounded-[32px] border border-slate-200 bg-slate-950 px-5 py-6 text-white shadow-2xl sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Interview snapshot</p>
                  <h2 className="mt-2 text-2xl font-semibold">Frontend Engineer</h2>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-300">Live</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Interview types</p>
                  <p className="mt-2 text-lg font-semibold">Technical, behavioral, problem solving</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Candidate summary</p>
                  <p className="mt-2 text-lg font-semibold">Feedback generated automatically after the call</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3 flex-wrap">
                {['AI-Powered', 'MERN Stack', 'TypeScript', 'Vite + React'].map((tag) => (
                  <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
