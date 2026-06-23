import type { User } from '@/types';

interface WelcomeContainerProps {
  user: User | null;
}

export default function WelcomeContainer({ user }: WelcomeContainerProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f6cbd]/10 text-xl font-black text-[#0f6cbd]">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h2>
          <p className="text-sm text-slate-500">Ready to create and manage your AI-powered interviews.</p>
        </div>
      </div>
    </div>
  );
}
