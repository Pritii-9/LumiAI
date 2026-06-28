import { CheckCircle2, Zap, CreditCard, Shield } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export default function BillingPage() {
  return (
    <div className="page-enter mx-auto max-w-5xl py-8">
      <PageHeader
        title="Billing & Subscription"
        subtitle="Manage your subscription, billing history, and payment methods."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="space-y-8">
          {/* Current Plan */}
          <div className="rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm dark:border-blue-900/50 dark:from-slate-900 dark:to-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded-full bg-blue-200/50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">CURRENT PLAN</span>
                <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Pro Enterprise</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">Unlimited interviews & advanced AI feedback</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">$49</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">/month</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4 border-t border-blue-200/50 pt-6 dark:border-slate-700/50">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Your next billing date is <span className="font-bold">July 23, 2026</span>.</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Payment Method</h3>
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
                  <CreditCard className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">Visa ending in 4242</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Expires 12/28</p>
                </div>
              </div>
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Plan Features */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm h-fit dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pro Features</h3>
          </div>
          <ul className="mt-6 space-y-4">
            {[
              'Unlimited AI Interviews',
              'Advanced Groq AI Models',
              'Detailed Candidate Feedback',
              'Custom Interview Questions',
              'Team Collaboration (Up to 5)',
              'Priority 24/7 Support'
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>
          <button className="mt-8 w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 transition dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 shadow-md">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
