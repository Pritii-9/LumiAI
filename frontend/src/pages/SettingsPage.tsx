import { Settings, User, Bell, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
        <p className="mt-2 text-slate-600">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { icon: User, label: 'Profile', active: true },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Shield, label: 'Security', active: false },
            { icon: Key, label: 'API Keys', active: false },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                item.active 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.active ? 'text-blue-700' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h3>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0f6cbd] text-3xl font-bold text-white">
                JD
              </div>
              <div>
                <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                  Change Avatar
                </button>
                <p className="mt-2 text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="john@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
                <textarea 
                  rows={4}
                  defaultValue="HR Manager at Tech Corp."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="rounded-full bg-[#0f6cbd] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0f6cbd]/90 transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
