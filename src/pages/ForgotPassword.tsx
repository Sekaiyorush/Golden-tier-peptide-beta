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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md text-center bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Check your email</h2>
                    <p className="text-slate-500 mb-6">
                        We've sent a password reset link to <strong>{email}</strong>.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <Link to="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-slate-900">Reset Password</h1>
                    <p className="text-slate-500 mt-1">Enter your email to receive a reset link</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 mt-4 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
