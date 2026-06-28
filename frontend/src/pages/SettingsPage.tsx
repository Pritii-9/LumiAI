import { useState } from 'react';
import { User as UserIcon, Bell, Shield, Key } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

type Tab = 'profile' | 'notifications' | 'security' | 'apikeys';

export default function SettingsPage() {
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  
  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  
  // API Key State
  const [apiKey, setApiKey] = useState('');
  
  const handleSaveProfile = () => {
    setUser({ name, email });
    toast.success('Profile updated successfully!');
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    toast.success('API Key securely saved!');
    setApiKey('');
  };

  const tabs = [
    { id: 'profile', icon: UserIcon, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'apikeys', icon: Key, label: 'API Keys' },
  ];

  return (
    <div className="page-enter mx-auto max-w-4xl py-8">
      <PageHeader
        title="Account Settings"
        subtitle="Manage your personal information, security, and notification preferences."
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`}
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-6 dark:text-slate-100">Profile Information</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#0f6cbd] to-blue-600 text-3xl font-bold text-white shadow-lg">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                    Change Avatar
                  </button>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                  <textarea 
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your company or role..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSaveProfile}
                  className="rounded-xl bg-[#0f6cbd] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0f6cbd]/90 transition shadow-md shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* API KEYS TAB */}
          {activeTab === 'apikeys' && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <Key className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Model Providers</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Connect your own API keys (like Groq, OpenAI, or Anthropic) to bypass system limits and use your own billing.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950/50">
                  <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">Groq API Key</label>
                  <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                    Used for ultra-fast LLaMA 3 inference. Get your key from <a href="https://console.groq.com/" target="_blank" className="text-[#0f6cbd] hover:underline">console.groq.com</a>.
                  </p>
                  <div className="flex gap-3">
                    <input 
                      type="password" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="gsk_..."
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-mono outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <button 
                      onClick={handleSaveApiKey}
                      className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS STUB */}
          {(activeTab === 'notifications' || activeTab === 'security') && (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
              <Bell className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Coming Soon</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This configuration area is under active development.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
