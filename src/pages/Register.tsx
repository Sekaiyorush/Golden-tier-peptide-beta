import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Ticket, Check, X, ArrowRight } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeValidating, setCodeValidating] = useState(false);
  const [codeValidation, setCodeValidation] = useState<{ valid: boolean; message: string; type?: string } | null>(null);
  const { register, validateCode } = useAuth();
  const navigate = useNavigate();

  const validateInvitationCode = async (code: string) => {
    if (!code) {
      setCodeValidation(null);
      return;
    }

    setCodeValidating(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const result = await validateCode(code);

    if (result.valid && result.code) {
      let typeLabel = 'User';
      if (result.code.type === 'admin_partner') typeLabel = 'Partner';
      if (result.code.type === 'partner_user') typeLabel = 'Customer (via Partner)';

      setCodeValidation({
        valid: true,
        message: `Valid ${typeLabel} invitation code`,
        type: result.code.type,
      });
    } else {
      setCodeValidation({
        valid: false,
        message: result.error || 'Invalid invitation code',
      });
    }
    setCodeValidating(false);
  };

  const handleCodeChange = (value: string) => {
    setInvitationCode(value.toUpperCase());
    if (value.length >= 6) {
      validateInvitationCode(value.toUpperCase());
    } else {
      setCodeValidation(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!invitationCode) {
      setError('Invitation code is required');
      return;
    }

    if (!codeValidation?.valid) {
      setError('Please enter a valid invitation code');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    const result = await register(name, email, password, invitationCode);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.03)_0%,_rgba(255,255,255,1)_60%)]" />

      <div className="flex-1 flex items-center justify-center py-12 px-6 relative z-10 w-full">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <img src="/brand-logo-gold.png" alt="Golden Tier Logo" className="h-28 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
            </div>
            <h1 className="text-4xl font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#AA771C] via-[#F3E5AB] to-[#D4AF37] mb-3">Create Account</h1>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#AA771C]">Invitation-only Registration</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md border border-[#D4AF37]/20 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] relative">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Invitation Code - First and most important */}
              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">
                  Invitation Code <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/50" />
                  <input
                    type="text"
                    value={invitationCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className={`w-full h-12 pl-12 pr-12 bg-transparent border focus:ring-0 transition-all uppercase text-sm text-slate-800 placeholder-slate-300 ${codeValidation?.valid
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                      : codeValidation && !codeValidation.valid
                        ? 'border-red-300 bg-red-50/50'
                        : 'border-[#D4AF37]/20 focus:border-[#D4AF37]'
                      }`}
                    placeholder="ENTER INVITATION CODE"
                    required
                  />
                  {codeValidating && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {!codeValidating && codeValidation && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {codeValidation.valid ? (
                        <Check className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {codeValidation && (
                  <p className={`text-xs mt-1.5 ${codeValidation.valid ? 'text-emerald-600' : 'text-red-600'}`}>
                    {codeValidation.message}
                  </p>
                )}
                <p className="text-[10px] tracking-wide uppercase text-slate-400 mt-2">
                  Need a code? Contact an admin
                </p>
              </div>

              <div className="border-t border-[#D4AF37]/20 pt-6">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/50" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 bg-transparent border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 text-sm transition-all text-slate-800 placeholder-slate-300"
                      placeholder="ENTER FULL NAME"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-transparent border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 text-sm transition-all text-slate-800 placeholder-slate-300"
                    placeholder="ENTER YOUR EMAIL"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 bg-transparent border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 text-sm transition-all text-slate-800 placeholder-slate-300"
                    placeholder="CREATE PASSWORD"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#D4AF37] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-transparent border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 text-sm transition-all text-slate-800 placeholder-slate-300"
                    placeholder="CONFIRM PASSWORD"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !codeValidation?.valid}
                className="mt-8 group relative w-full h-12 bg-[#111] text-white font-semibold text-[10px] tracking-[0.2em] uppercase transition-all disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite]" />
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-500 ease-out group-hover:w-full" />
              </button>
            </form>

            <div className="mt-8 text-center text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400">
              <span>Already have an account? </span>
              <Link to="/login" className="text-[#AA771C] hover:text-[#D4AF37] ml-2 transition-colors border-b border-[#AA771C]/30 hover:border-[#D4AF37] pb-0.5">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
