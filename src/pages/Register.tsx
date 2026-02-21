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

    const result = validateCode(code);

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

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
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
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans selection:bg-amber-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white pointer-events-none -z-10" />

      <div className="flex-1 flex items-center justify-center py-12 px-6 relative z-10 w-full">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1a1a1a] to-black border border-gold-800 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gold-900/10">
              <span className="text-gold-500 font-serif font-bold tracking-widest text-sm">GT</span>
            </div>
            <h1 className="text-3xl font-serif text-slate-900 tracking-tight mb-2">Create Account</h1>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gold-600">Invitation-only Registration</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gold-200/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Invitation Code - First and most important */}
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">
                  Invitation Code <span className="text-gold-500">*</span>
                </label>
                <div className="relative">
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400" />
                  <input
                    type="text"
                    value={invitationCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className={`w-full h-12 pl-11 pr-11 rounded-xl bg-white border focus:ring-2 transition-all uppercase text-sm ${codeValidation?.valid
                      ? 'border-emerald-300 bg-emerald-50/50 focus:ring-emerald-200'
                      : codeValidation && !codeValidation.valid
                        ? 'border-red-300 bg-red-50/50 focus:ring-red-200'
                        : 'border-gold-200/60 focus:ring-gold-500/20 focus:border-gold-500'
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

              <div className="border-t border-gold-100 pt-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-gold-200/60 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              </div>

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
                    placeholder="Create a password"
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

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-gold-200/60 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !codeValidation?.valid}
                className="mt-6 group relative w-full h-12 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold text-xs tracking-widest uppercase hover:bg-black hover:border-gold-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                <span className="relative z-10">{isLoading ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center text-xs tracking-wide">
              <span className="text-slate-500">Already have an account? </span>
              <Link to="/login" className="text-gold-600 font-bold uppercase tracking-widest hover:text-gold-500 ml-1 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
