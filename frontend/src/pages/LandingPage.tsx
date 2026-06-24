import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, Users, ArrowRight, Zap, Shield, ExternalLink, Globe, Link2 } from 'lucide-react';

const SOCIAL_ICONS = [ExternalLink, Globe, Link2];

const FEATURES = [
  { icon: Zap, color: 'text-blue-400', label: 'AI-generated questions', desc: 'Get role-specific questions tailored to your job description instantly.' },
  { icon: Sparkles, color: 'text-emerald-400', label: 'Real-time feedback', desc: 'Receive detailed AI feedback on your answers after every session.' },
  { icon: CheckCircle2, color: 'text-sky-400', label: 'Track your progress', desc: 'Review past sessions and see how your skills improve over time.' },
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

const FOOTER_COLS = [
  { title: 'Product', links: ['Features', 'How It Works', 'Changelog', 'Pricing'] },
  { title: 'Resources', links: ['Documentation', 'Practice Tips', 'Interview Guides', 'FAQ'] },
  { title: 'Company', links: ['About', 'Blog', 'Contact', 'Careers'] },
  { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security', 'Cookies'] },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#090d16] text-white antialiased">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[500px] rounded-full bg-indigo-600/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full bg-purple-600/6 blur-[100px]" />
      </div>

      {/* ── Navbar ─────────────────────────────── */}
      <nav className="relative z-10 border-b border-white/5 bg-[#090d16]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="LumiAI" className="h-9 w-9" />
            <span className="text-base font-bold tracking-tight">LumiAI</span>
            <span className="hidden rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-xs font-medium text-blue-400 sm:inline-flex">
              AI Interview Prep
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium text-slate-400 transition hover:text-white">Sign in</Link>
            <Link to="/auth">
              <button className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 active:scale-95">
                Start Practicing <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              ✨ Smarter interview practice — powered by AI
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight md:text-6xl">
                Practice interviews.{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Get real feedback.
                </span>{' '}
                Land the job.
              </h1>
              <p className="max-w-2xl text-lg font-light leading-relaxed text-slate-400">
                LumiAI generates role-specific interview questions from any job description, runs you through an AI-guided session, and gives you instant, honest feedback — so you walk into every real interview fully prepared.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/auth">
                <button className="flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold shadow-xl shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95">
                  Start Practicing Free <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/auth">
                <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/10">
                  See How It Works
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
              {['No credit card required', 'Free to get started', 'Instant AI feedback'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t}
                </span>
              ))}
            </div>

            {/* Feature chips */}
            <div className="grid gap-3 sm:grid-cols-3">
              {FEATURES.map(({ icon: Icon, color, label, desc }) => (
                <div key={label} className="group rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/60">
                  <Icon className={`h-6 w-6 ${color}`} />
                  <h3 className="mt-3 text-sm font-semibold text-slate-100">{label}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: App UI mockup */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/10 blur-2xl" />
            <div className="relative rounded-3xl border border-white/8 bg-[#0f1420] shadow-2xl">
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                <div className="flex gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400">
                  ● Practice Session Active
                </span>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Current Session</p>
                  <h2 className="mt-2 text-2xl font-bold">Frontend Engineer</h2>
                  <p className="mt-1 text-sm text-slate-500">React · TypeScript · System Design</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[['12', 'Questions'], ['45 min', 'Duration'], ['2/5', 'Completed']].map(([v, l]) => (
                    <div key={l} className="rounded-xl border border-white/5 bg-white/3 p-3 text-center">
                      <p className="text-lg font-bold">{v}</p>
                      <p className="text-xs text-slate-500">{l}</p>
                    </div>
                  ))}
                </div>

                {/* Current question */}
                <div className="rounded-xl border border-white/5 bg-white/3 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-yellow-400" />
                    <p className="text-xs font-medium text-slate-400">Current Question</p>
                  </div>
                  <p className="text-sm font-semibold leading-6">"Explain how the React reconciliation algorithm works and when you'd use useMemo."</p>
                </div>

                {/* Feedback preview */}
                <div className="rounded-xl border border-white/5 bg-white/3 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-blue-400" />
                    <p className="text-xs font-medium text-slate-400">AI Feedback (prev. answer)</p>
                  </div>
                  <p className="text-sm text-slate-300">Strong technical explanation. Consider adding a real-world use case to improve depth. <span className="text-emerald-400 font-semibold">Score: 8/10</span></p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Technical', 'Behavioral', 'System Design', 'Groq AI'].map(tag => (
                    <span key={tag} className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">{tag}</span>
                  ))}
                </div>

                <Link to="/auth" className="block">
                  <button className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold transition hover:bg-blue-500">
                    Start Your Practice Session →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics ────────────────────────────── */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Built to get you hired</h2>
            <p className="mt-3 text-slate-400">Everything you need to ace your next technical interview.</p>
          </div>
          <div className="grid gap-px rounded-3xl border border-white/6 bg-white/6 sm:grid-cols-3">
            {METRICS.map(({ value, label, desc }, i) => (
              <div key={label} className={`bg-[#090d16] p-10 text-center ${i === 0 ? 'rounded-l-3xl' : i === 2 ? 'rounded-r-3xl' : ''}`}>
                <p className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent">{value}</p>
                <p className="mt-3 text-base font-semibold text-slate-100">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────── */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-400">How it works</span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">From job description to job offer</h2>
            <p className="mt-3 text-slate-400">Three simple steps to prepare smarter and interview with confidence.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="group relative rounded-3xl border border-slate-800/60 bg-slate-900/30 p-8 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/50">
                <span className="text-5xl font-black tracking-tighter text-slate-800 transition-colors group-hover:text-slate-700">{n}</span>
                <h3 className="mt-4 text-lg font-bold text-slate-100">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{desc}</p>
                <div className="mt-6 h-px w-12 bg-gradient-to-r from-blue-500 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────── */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-blue-950/60 via-[#0f1420] to-indigo-950/60 p-12 text-center shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-96 rounded-full bg-blue-600/15 blur-3xl" />
            </div>
            <div className="relative z-10 space-y-6">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">Start for free</span>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Ready to ace your next<br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">technical interview?</span>
              </h2>
              <p className="mx-auto max-w-xl text-slate-400">
                Join thousands of developers using LumiAI to practice smarter, get AI feedback, and land their dream roles faster.
              </p>
              <Link to="/auth">
                <button className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold shadow-xl shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95">
                  Start Practicing Free <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <p className="text-xs text-slate-600">No credit card required · Free to get started</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 bg-[#060910]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="LumiAI" className="h-8 w-8" />
                <span className="font-bold tracking-tight">LumiAI</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-600">AI-powered interview prep for developers and engineers.</p>
              <div className="mt-5 flex gap-4">
                {SOCIAL_ICONS.map((Icon, i) => (
                  <a key={i} href="#" className="text-slate-600 transition-colors hover:text-slate-400">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            {FOOTER_COLS.map(({ title, links }) => (
              <div key={title}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">{title}</h4>
                <ul className="space-y-3">
                  {links.map(l => (
                    <li key={l}><a href="#" className="text-sm text-slate-600 transition-colors hover:text-white">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
            <p className="text-xs text-slate-700">© {new Date().getFullYear()} LumiAI. All rights reserved.</p>
            <p className="text-xs text-slate-700">Built with React · TypeScript · Groq AI</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
