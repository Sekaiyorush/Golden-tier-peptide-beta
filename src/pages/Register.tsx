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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">GT</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
          <p className="text-slate-500 mt-1">Invitation-only registration</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Invitation Code - First and most important */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Invitation Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={invitationCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className={`w-full h-11 pl-10 pr-10 rounded-lg border focus:ring-2 transition-all uppercase ${
                    codeValidation?.valid 
                      ? 'border-emerald-300 bg-emerald-50 focus:ring-emerald-200' 
                      : codeValidation && !codeValidation.valid
                      ? 'border-red-300 bg-red-50 focus:ring-red-200'
                      : 'border-slate-200 focus:ring-slate-200'
                  }`}
                  placeholder="Enter invitation code"
                  required
                />
                {codeValidating && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {!codeValidating && codeValidation && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
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
              <p className="text-xs text-slate-400 mt-1.5">
                Need a code? Contact an admin or partner
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !codeValidation?.valid}
              className="w-full h-11 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="text-slate-900 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
