import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Zap, ExternalLink, Globe, Link2, BarChart3, BrainCircuit } from 'lucide-react';

const SOCIAL_ICONS = [ExternalLink, Globe, Link2];

const FEATURES = [
  { icon: BrainCircuit, label: 'AI-generated questions', desc: 'Get role-specific questions tailored to your job description instantly.' },
  { icon: Zap, label: 'Real-time feedback', desc: 'Receive detailed AI feedback on your answers after every session.' },
  { icon: BarChart3, label: 'Track your progress', desc: 'Review past sessions and see how your skills improve over time.' },
];

const METRICS = [
  { value: '500+', label: 'Practice questions', desc: 'Covering frontend, backend, system design, and behavioral rounds.' },
  { value: '3x', label: 'More confident in interviews', desc: 'Users feel significantly better prepared after just a few sessions.' },
  { value: '100%', label: 'AI-powered feedback', desc: 'Every answer is analyzed and scored instantly — no waiting.' },
];

const STEPS = [
  { n: '01', title: 'Add Your Job Description', desc: 'Paste any job description or choose a role like Frontend Engineer, Full-Stack Dev, or Data Analyst. LumiAI generates a targeted question set instantly.' },
  { n: '02', title: 'Take an AI Interview Session', desc: 'Answer questions at your own pace in a distraction-free environment. The AI guides you through the session just like a real interview.' },
  { n: '03', title: 'Get Instant Feedback & Improve', desc: 'Receive detailed scoring on your technical depth, communication clarity, and suggested improvements for each answer.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] page-enter flex flex-col">
      {/* ── Navbar ─────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f6cbd] text-lg font-black text-white shadow-lg">
              L
            </div>
            <span className="text-xl font-bold page-title">LumiAI</span>
            <span className="hidden rounded-full border border-[#0f6cbd]/20 bg-[#0f6cbd]/10 px-3 py-1 text-xs font-medium text-[#0f6cbd] sm:inline-flex">
              AI Interview Platform
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-semibold page-subtitle hover:text-[#0f6cbd] transition-colors">
              Sign in
            </Link>
            <Link to="/auth">
              <button className="flex items-center gap-2 rounded-xl bg-[#0f6cbd] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#0f6cbd]/90 active:scale-95 transition-all">
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────── */}
      <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pt-20 pb-16 lg:px-8 lg:pt-32 lg:pb-24 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight page-title leading-tight">
            Nail your next interview with{' '}
            <span className="text-[#0f6cbd]">AI-powered</span> practice.
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            LumiAI generates role-specific interview questions from any job description, conducts an interactive voice session, and provides instant, detailed feedback.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0f6cbd] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-[#0f6cbd]/90 active:scale-95 transition-all w-full sm:w-auto">
                Start Practicing Free <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link to="/auth">
              <button className="flex items-center justify-center gap-2 rounded-xl btn-ghost px-8 py-3.5 text-base font-semibold w-full sm:w-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                View Dashboard
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium page-subtitle pt-6">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0f6cbd]" /> No credit card required</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0f6cbd]" /> Instant feedback</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0f6cbd]" /> Unlimited mock interviews</span>
          </div>
        </div>
      </section>

      {/* ── App Mockup / Features ──────────────── */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 space-y-10">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0f6cbd]/10 text-[#0f6cbd]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold page-title">{label}</h3>
                    <p className="mt-2 text-sm leading-relaxed page-subtitle">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 rounded-[28px] card p-2 sm:p-4 shadow-xl overflow-hidden">
              <div className="rounded-[20px] bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  </div>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Interview
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#0f6cbd]">Current Session</p>
                  <h2 className="mt-2 text-2xl font-bold page-title">Senior Frontend Engineer</h2>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-[#0f6cbd]" />
                    <p className="text-sm font-semibold text-slate-500">Question 3 of 5</p>
                  </div>
                  <p className="text-base font-medium page-title leading-relaxed">
                    "Can you explain the React reconciliation algorithm and describe a scenario where you would use useMemo to optimize performance?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold page-title sm:text-4xl">How LumiAI Works</h2>
            <p className="mt-4 text-lg page-subtitle">Three simple steps to prepare smarter and interview with confidence.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="rounded-[24px] card p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <span className="absolute -right-4 -top-4 text-9xl font-black text-slate-50 dark:text-slate-900/50 select-none z-0">{n}</span>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold page-title">{title}</h3>
                  <p className="mt-4 text-sm leading-relaxed page-subtitle">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Metrics ────────────────────────────── */}
      <section className="bg-[#0f6cbd] text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-blue-500">
            {METRICS.map(({ value, label, desc }) => (
              <div key={label} className="text-center pt-8 md:pt-0 px-4">
                <p className="text-5xl font-extrabold tracking-tight">{value}</p>
                <p className="mt-4 text-lg font-bold">{label}</p>
                <p className="mt-2 text-sm text-blue-100 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f6cbd] text-sm font-black text-white">L</div>
              <span className="font-bold tracking-tight page-title">LumiAI</span>
            </div>
            
            <p className="text-sm page-subtitle">
              © {new Date().getFullYear()} LumiAI. Built for developers by developers.
            </p>
            
            <div className="flex gap-4">
              {SOCIAL_ICONS.map((Icon, i) => (
                <a key={i} href="#" className="text-slate-400 hover:text-[#0f6cbd] transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
