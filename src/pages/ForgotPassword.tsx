import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { resetPasswordForEmail } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { success, error } = await resetPasswordForEmail(email);
            if (success) {
                setIsSuccess(true);
            } else {
                setError(error || 'Failed to send reset link. Please check your email.');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans selection:bg-amber-200">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white pointer-events-none -z-10" />

                <div className="flex-1 flex items-center justify-center py-12 px-6 relative z-10 w-full">
                    <div className="w-full max-w-md text-center bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-gold-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="w-16 h-16 bg-gradient-to-br from-gold-50 to-amber-100/50 border border-gold-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm shadow-gold-900/5">
                            <Mail className="h-6 w-6 text-gold-600" />
                        </div>
                        <h2 className="text-3xl font-serif text-slate-900 mb-3 tracking-tight">Check your email</h2>
                        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                            We've sent a password reset link to <strong className="text-gold-700">{email}</strong>.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-semibold text-xs tracking-widest uppercase border border-slate-800 hover:border-gold-500/50 shadow-md"
                        >
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans selection:bg-amber-200">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-white to-white pointer-events-none -z-10" />

            <div className="flex-1 flex items-center justify-center py-12 px-6 relative z-10 w-full">
                <div className="w-full max-w-md">
                    <Link to="/login" className="inline-flex items-center text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-gold-600 mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to login
                    </Link>

                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-6">
                            <img src="/brand-logo-gold.png" alt="Golden Tier Logo" className="h-28 w-auto object-contain drop-shadow-sm" />
                        </div>
                        <h1 className="text-3xl font-serif text-slate-900 tracking-tight mb-2">Reset Password</h1>
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-gold-600">Enter email to receive link</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gold-200/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-gold-200/60 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-8 group relative w-full h-12 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold text-xs tracking-widest uppercase hover:bg-black hover:border-gold-500/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                                <span className="relative z-10">{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
                                <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
