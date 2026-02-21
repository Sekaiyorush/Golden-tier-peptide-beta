import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans selection:bg-amber-200">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white pointer-events-none -z-10" />

      <div className="flex-1 flex items-center justify-center py-12 px-6 relative z-10 w-full">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <img src="/brand-logo-gold.png" alt="Golden Tier Logo" className="h-28 w-auto object-contain drop-shadow-sm" />
            </div>
            <h1 className="text-3xl font-serif text-slate-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gold-600">Access Your Portal</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gold-200/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-gold-200/60 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-11 pr-11 rounded-xl bg-white border border-gold-200/60 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gold-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 group cursor-pointer">
                  <input type="checkbox" className="rounded border-gold-300 text-gold-500 focus:ring-gold-500/30" />
                  <span className="text-slate-500 group-hover:text-slate-800 transition-colors">Remember me</span>
                </label>
                <Link to="/forgot-password" className="font-semibold text-gold-600 hover:text-gold-500 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full h-12 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold text-xs tracking-widest uppercase hover:bg-black hover:border-gold-500/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                <span className="relative z-10">{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center text-xs tracking-wide">
              <span className="text-slate-500">Don&apos;t have an account? </span>
              <Link to="/register" className="text-gold-600 font-bold uppercase tracking-widest hover:text-gold-500 ml-1 transition-colors">
                Apply
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
