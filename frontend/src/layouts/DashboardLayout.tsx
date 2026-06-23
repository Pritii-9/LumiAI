import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { SideBarOptions } from '@/lib/constants';
import { ChevronRight, LogOut, Plus } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardLayout() {
  const { user, setUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate('/auth', { replace: true });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-200/75 bg-white shadow-sm">
        {/* Header */}
        <div className="space-y-4 px-4 pt-5 pb-3">
          <Link to="/dashboard" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f6cbd] text-sm font-black text-white">
              AI
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">AI Interview</p>
              <p className="text-sm text-slate-500">Hiring workflow</p>
            </div>
          </Link>

          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-lg font-semibold text-slate-700">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-slate-500 truncate max-w-[120px]">{user?.email || 'No email'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create button */}
        <div className="px-4">
          <Link to="/dashboard/create-interview">
            <button className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0f6cbd] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f6cbd]/90">
              <Plus className="h-4 w-4" />
              <span>Create interview</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 pb-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Workspace</p>
          <ul className="space-y-1">
            {SideBarOptions.map((option) => {
              const isActive = location.pathname === option.path || location.pathname.startsWith(option.path + '/');
              return (
                <li key={option.path}>
                  <Link
                    to={option.path}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[#0f6cbd]/10 text-slate-900 shadow-sm ring-1 ring-[#0f6cbd]/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <option.icon className={`h-4 w-4 ${isActive ? 'text-[#0f6cbd]' : 'text-slate-400'}`} />
                    <span>{option.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 pb-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 px-6 py-6 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
