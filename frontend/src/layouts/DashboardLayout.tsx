import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { SideBarOptions } from '@/lib/constants';
import { ChevronRight, LogOut, Plus, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

export default function DashboardLayout() {
  const { user, setUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setUser(null);
    navigate('/auth', { replace: true });
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/75 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Header */}
        <div className="space-y-4 px-4 pt-5 pb-3 relative">
          <button 
            className="absolute right-4 top-5 rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>

          <Link to="/dashboard" className="inline-flex items-center gap-3">
            <img src="/logo.svg" alt="LumiAI Logo" className="h-11 w-11" />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Interview</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Hiring workflow</p>
            </div>
          </Link>

          <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-lg font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-slate-500 truncate dark:text-slate-400">{user?.email || 'No email'}</p>
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
        <nav className="flex-1 px-2 pb-6 overflow-y-auto">
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
                        ? 'bg-[#0f6cbd]/10 text-slate-900 shadow-sm ring-1 ring-[#0f6cbd]/20 dark:text-slate-100 dark:ring-[#0f6cbd]/40'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
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
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col lg:ml-64 min-w-0 w-full transition-all duration-300">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between gap-3 border-b border-slate-200/75 bg-white/50 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800/75 dark:bg-slate-950/50 lg:justify-end lg:px-10 sticky top-0 z-10">
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <img src="/logo.svg" alt="LumiAI" className="h-8 w-8" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex h-11 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 sm:px-5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Sign out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
