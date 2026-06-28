import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { LogIn, Mail, Lock, Eye, EyeOff, KeyRound, User, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

type AuthMode = 'signin' | 'signup_details' | 'signup_otp' | 'forgot_password' | 'reset_otp';

export default function AuthPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Simulate API delay
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser({ name: data.name, email: data.email });
      // Optionally store token: localStorage.setItem('token', data.token);
      toast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 8) {
      toast.error('Please fill all details and use at least an 8 character password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      toast.success(`OTP successfully sent! (Check your backend terminal console for the code)`, { duration: 8000 });
      setMode('signup_otp');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }
    setLoading(true);
    
    try {
      // Actually register the user in the database with the OTP
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password: password.trim(), otp: otp.trim() })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser({ name: data.name, email: data.email });
      // Optionally store token: localStorage.setItem('token', data.token);
      toast.success('Account verified and created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email to reset password.');
      return;
    }
    setLoading(true);
    await delay(1000); // Simulate sending reset OTP
    setLoading(false);
    toast.success(`Reset OTP sent! For this demo, use 123456.`, { duration: 6000 });
    setMode('reset_otp');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || password.length < 8) {
      toast.error('Please enter a valid 6-digit OTP and a new 8+ character password.');
      return;
    }
    setLoading(true);
    await delay(1200);
    setLoading(false);
    toast.success('Password reset successfully! You can now sign in.');
    setMode('signin');
    setPassword('');
    setOtp('');
  };

  const renderHeader = () => {
    let title = 'Welcome back';
    let subtitle = 'Sign in to your AI Interview Prep workspace';

    if (mode === 'signup_details') {
      title = 'Create an account';
      subtitle = 'Join the future of AI interviewing';
    } else if (mode === 'signup_otp') {
      title = 'Verify your email';
      subtitle = `We sent a secure code to ${email}`;
    } else if (mode === 'forgot_password') {
      title = 'Reset password';
      subtitle = "We'll send you a secure OTP to reset your password";
    } else if (mode === 'reset_otp') {
      title = 'Set new password';
      subtitle = 'Enter your OTP and choose a new password';
    }

    return (
      <div className="mb-8 text-center transition-all">
        {mode.includes('otp') ? (
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f6cbd] shadow-lg shadow-blue-500/20">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
        ) : (
          <img src="/logo.svg" alt="LumiAI Logo" className="mx-auto mb-5 h-16 w-16 drop-shadow-md" />
        )}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background gradients for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[100px]" />

      <button 
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 sm:left-6 sm:top-6 flex h-10 w-10 items-center justify-center rounded-xl btn-ghost shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-20"
        title="Back to Home"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="rounded-[32px] border border-white dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-in-out">
          
          {mode !== 'signin' && mode !== 'signup_details' && (
            <button 
              onClick={() => setMode(mode === 'signup_otp' ? 'signup_details' : 'signin')}
              className="absolute left-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          {renderHeader()}

          {/* SIGN IN MODE */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative group">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f6cbd] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full pl-10 pr-4 input shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <button 
                    type="button" 
                    onClick={() => setMode('forgot_password')}
                    className="text-xs font-semibold text-[#0f6cbd] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f6cbd] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 w-full pl-10 pr-10 input shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f6cbd] font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-[#0f6cbd]/90 hover:shadow-blue-500/40 disabled:opacity-60 transition-all"
              >
                {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <LogIn className="h-4 w-4" />}
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <button type="button" onClick={() => setMode('signup_details')} className="font-semibold text-[#0f6cbd] hover:underline">
                  Sign up
                </button>
              </p>
            </form>
          )}

          {/* SIGN UP DETAILS MODE */}
          {mode === 'signup_details' && (
            <form onSubmit={handleSignupSubmitDetails} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative group">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f6cbd] transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="h-11 w-full pl-10 pr-4 input shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative group">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f6cbd] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full pl-10 pr-4 input shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Create Password</label>
                <div className="relative group">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f6cbd] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="h-11 w-full pl-10 pr-10 input shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f6cbd] font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-[#0f6cbd]/90 hover:shadow-blue-500/40 disabled:opacity-60 transition-all"
              >
                {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Continue'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('signin')} className="font-semibold text-[#0f6cbd] hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* SIGN UP OTP MODE */}
          {mode === 'signup_otp' && (
            <form onSubmit={handleSignupVerifyOTP} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label className="mb-2 block text-center text-sm font-medium text-slate-700">Enter 6-digit OTP</label>
                <div className="relative group mx-auto w-48">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f6cbd] transition-colors" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="h-12 w-full pl-10 pr-4 input text-center text-xl tracking-[0.5em] font-mono shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:shadow-emerald-500/40 disabled:opacity-60 transition-all"
              >
                {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <ShieldCheck className="h-4 w-4" />}
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <p className="text-center text-sm text-slate-600">
                Didn't receive the code?{' '}
                <button type="button" className="font-semibold text-[#0f6cbd] hover:underline" onClick={handleSignupSubmitDetails}>
                  Resend OTP
                </button>
              </p>
            </form>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative group">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f6cbd] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full pl-10 pr-4 input shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 font-semibold text-white shadow-lg shadow-slate-900/30 hover:bg-slate-800 disabled:opacity-60 transition-all"
              >
                {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Send Reset OTP'}
              </button>

              <button 
                type="button" 
                onClick={() => setMode('signin')}
                className="w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                Back to sign in
              </button>
            </form>
          )}

          {/* RESET PASSWORD OTP MODE */}
          {mode === 'reset_otp' && (
            <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Enter 6-digit Reset OTP</label>
                <div className="relative group">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f6cbd] transition-colors" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="h-11 w-full pl-10 pr-4 input tracking-widest shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                <div className="relative group">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f6cbd] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="h-11 w-full pl-10 pr-10 input shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6 || password.length < 8}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 disabled:opacity-60 transition-all"
              >
                {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'Confirm New Password'}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-slate-400">
            Secure authentication powered by LumiAI
          </p>
        </div>
      </div>
    </div>
  );
}
