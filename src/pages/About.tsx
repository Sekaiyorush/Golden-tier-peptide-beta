import { Shield, Award, Microscope, Users } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export function About() {
    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden">
            {/* Luxury Background Hint */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none -z-10" />

            <SEO
                title="About | Golden Tier"
                description="Learn about Golden Tier's mission to provide the highest-purity, reliable research compounds for scientific exploration."
            />
            <div className="container mx-auto px-6 md:px-12 pt-12 relative z-10">
                <Breadcrumbs />
            </div>

            {/* Hero Section */}
            <section className="relative py-24 md:py-32 bg-slate-900 text-white mt-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-900/20 blur-3xl -translate-y-1/2 translate-x-1/3 rounded-full" />
                <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
                    <div className="max-w-3xl">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500 mb-6 block">Our Purpose</span>
                        <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-tight leading-tight">Elevating Scientific Discovery</h1>
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
                            We are an ultra-premium research compound supplier committed to absolute purity, rigorous analytical testing, and exceptional quality for the global scientific community.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 md:px-12 max-w-5xl py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {[
                        { icon: Shield, title: 'Uncompromising Quality', desc: 'Every formulation undergoes rigorous third-party HPLC and mass spectrometry testing to guarantee purity levels above 99%.' },
                        { icon: Award, title: 'Elite Standards', desc: 'We adhere to strict GMP-compliant protocols and maintain comprehensive analytical documentation for every single batch.' },
                        { icon: Microscope, title: 'Dedicated Research', desc: 'Our compounds are synthesized exclusively for legitimate scientific research, analytical progression, and laboratory applications.' },
                        { icon: Users, title: 'Global Network', desc: 'We collaborate with distinguished researchers and leading institutions worldwide through our vetted, exclusive partner program.' },
                    ].map((item) => (
                        <div key={item.title} className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)] transition-all duration-500">
                            <div className="w-14 h-14 bg-gradient-to-br from-gold-50 to-white border border-gold-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                <item.icon className="h-6 w-6 text-gold-600" />
                            </div>
                            <h3 className="text-2xl font-serif text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-light">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-[2rem] border border-gold-100/50 p-12 md:p-20 shadow-sm text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-50/50 via-transparent to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500 mb-4 block">The Vision</span>
                        <h2 className="text-4xl font-serif text-slate-900 mb-6 tracking-tight">Our Philosophy</h2>
                        <p className="text-slate-500 leading-relaxed max-w-2xl mx-auto font-light text-lg">
                            Golden Tier exists to arm elite researchers with the highest-quality compounds attainable. We believe that absolute analytical purity is the non-negotiable foundation of meaningful scientific discovery. Every formulation we provide is backed by transparent, verifiable data and handled with precise care.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
