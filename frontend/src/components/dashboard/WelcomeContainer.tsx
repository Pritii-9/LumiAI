import type { User } from '@/types';

interface WelcomeContainerProps {
  user: User | null;
}

export default function WelcomeContainer({ user }: WelcomeContainerProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-5">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f6cbd] to-blue-600 text-2xl font-black text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30">
        {user?.name?.[0]?.toUpperCase() || 'U'}
      </div>
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h2>
        <p className="mt-1.5 text-slate-500 dark:text-slate-400">
          Ready to create and manage your AI-powered interviews.
        </p>
      </div>
    </div>
  );
}
