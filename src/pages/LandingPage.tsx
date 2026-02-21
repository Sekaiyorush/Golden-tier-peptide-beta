import { Link } from 'react-router-dom';
import { useDatabase } from '@/context/DatabaseContext';
import { Beaker, ArrowRight, Shield, FlaskConical, Award } from 'lucide-react';

export function LandingPage() {
    const { db } = useDatabase();
    const { companyName, companyDescription } = db.siteSettings;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Subtle background pattern */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Beaker className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">{companyName}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <Link
                        to="/login"
                        className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="px-5 py-2.5 text-sm font-medium text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                    >
                        Register
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-12">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-sm text-slate-400 font-medium">Research Grade Compounds</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                        {companyName}
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        {companyDescription}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            to="/login"
                            className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-xl transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30"
                        >
                            Sign In to Continue
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/register"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-300 border border-white/10 hover:bg-white/5 hover:border-white/20 rounded-xl transition-all backdrop-blur-sm"
                        >
                            Create Account
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="flex items-center justify-center space-x-3 px-6 py-4 bg-white/[0.03] border border-white/[0.06] rounded-xl backdrop-blur-sm">
                            <Shield className="h-5 w-5 text-amber-400 shrink-0" />
                            <span className="text-sm text-slate-400">99%+ Purity Guaranteed</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3 px-6 py-4 bg-white/[0.03] border border-white/[0.06] rounded-xl backdrop-blur-sm">
                            <FlaskConical className="h-5 w-5 text-amber-400 shrink-0" />
                            <span className="text-sm text-slate-400">Lab Certified Quality</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3 px-6 py-4 bg-white/[0.03] border border-white/[0.06] rounded-xl backdrop-blur-sm">
                            <Award className="h-5 w-5 text-amber-400 shrink-0" />
                            <span className="text-sm text-slate-400">Trusted by Researchers</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 text-center py-8 px-6">
                <p className="text-sm text-slate-600">
                    © {new Date().getFullYear()} {companyName}. All rights reserved. For research use only.
                </p>
            </footer>
        </div>
    );
}
