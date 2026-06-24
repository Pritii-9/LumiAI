import type { User } from '@/types';

interface WelcomeContainerProps {
  user: User | null;
}

export default function WelcomeContainer({ user }: WelcomeContainerProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mb-6 relative overflow-hidden rounded-[32px] border border-blue-100/50 bg-gradient-to-r from-blue-50/50 via-white to-emerald-50/30 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80">
      {/* Decorative background shapes */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-400/10 blur-[40px] dark:bg-blue-500/10" />
      <div className="absolute right-20 -bottom-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-[30px] dark:bg-emerald-500/5" />
      
      <div className="relative z-10 flex items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f6cbd] to-blue-600 text-2xl font-black text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Ready to create and manage your AI-powered interviews.
          </p>
        </div>
      </div>
    </div>
  );
}
