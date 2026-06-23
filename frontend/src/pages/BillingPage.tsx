import { WalletCards, CheckCircle2, Zap, CreditCard, Shield } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Billing & Subscription</h2>
        <p className="mt-2 text-slate-600">Manage your subscription, billing history, and payment methods.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="space-y-8">
          {/* Current Plan */}
          <div className="rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded-full bg-blue-200/50 px-3 py-1 text-xs font-semibold text-blue-700">CURRENT PLAN</span>
                <h3 className="mt-4 text-2xl font-bold text-slate-900">Pro Enterprise</h3>
                <p className="mt-1 text-slate-600">Unlimited interviews & advanced AI feedback</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900">$49</p>
                <p className="text-sm text-slate-500">/month</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4 border-t border-blue-200/50 pt-6">
              <Zap className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-slate-700">Your next billing date is <span className="font-bold">July 23, 2026</span>.</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">Payment Method</h3>
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <CreditCard className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Visa ending in 4242</p>
                  <p className="text-sm text-slate-500">Expires 12/28</p>
                </div>
              </div>
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Plan Features */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm h-fit">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">Pro Features</h3>
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
                <span className="text-sm text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>
          <button className="mt-8 w-full rounded-full bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 transition">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
