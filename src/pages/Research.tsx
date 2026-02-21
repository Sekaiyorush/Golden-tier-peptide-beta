import { FlaskConical, ShieldCheck, FileSearch, BookOpen } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export function Research() {
    return (
        <div className="min-h-screen bg-transparent py-14 relative overflow-hidden">
            {/* Luxury Background Hint */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none -z-10" />

            <SEO
                title="Research Standards | Golden Tier"
                description="Explore Golden Tier's commitment to analytical integrity, rigorous third-party verification, and strict purity protocols for all elite compounds."
            />
            <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
                <Breadcrumbs />
                <div className="text-center mb-16 mt-8">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500 mb-4 block">Protocols</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6 tracking-tight">Analytical Excellence</h1>
                    <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
                        Our dedication to absolute scientific integrity dictates every step of our synthesis, analysis, and fulfillment processes.
                    </p>
                </div>

                <div className="space-y-8">
                    {[
                        {
                            icon: FlaskConical,
                            title: 'Independent Verification',
                            content: 'Every isolated batch undergoes rigorous, independent third-party analysis using High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) to definitively confirm identity and concentration. Comprehensive Certificates of Analysis (CoA) accompany every order upon request.',
                        },
                        {
                            icon: ShieldCheck,
                            title: 'Supreme Purity Thresholds',
                            content: 'We adhere to an uncompromising minimum purity threshold of 98%, with the majority of formulations testing significantly above 99%. Our stringent QA/QC protocol includes multiphase visual inspection, precise gravimetric verification, and final tier-approval before distribution.',
                        },
                        {
                            icon: FileSearch,
                            title: 'Complete Traceability',
                            content: 'Each distinct formulation is assigned a precise SKU and immutable batch identifier, ensuring absolute traceability from sterile synthesis to secured delivery. Our digital ledger system allows elite researchers instant access to batch-specific analytical reporting.',
                        },
                        {
                            icon: BookOpen,
                            title: 'Restricted In-Vitro Application',
                            content: 'All compounds distributed by Golden Tier are synthesized exclusively for advanced in-vitro research and highly regulated laboratory environments. They are legally restricted from human or veterinary consumption and are supplied strictly to qualified research bodies.',
                        },
                    ].map((item, index) => (
                        <div key={item.title} className="bg-white/60 backdrop-blur-xl rounded-3xl border border-gold-200/50 p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)] transition-all duration-500 group relative overflow-hidden">
                            {/* Subtle hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-gold-50/0 via-gold-50/50 to-gold-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-x-full group-hover:translate-x-full" />

                            <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group-hover:border-gold-500/50 transition-colors duration-500">
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-gold-500/20 blur-xl rounded-full" />
                                    <item.icon className="h-7 w-7 text-gold-400 group-hover:text-gold-300 transition-colors" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-[10px] font-bold text-gold-500 font-mono">0{index + 1}</span>
                                        <h3 className="text-2xl font-serif text-slate-900 tracking-tight">{item.title}</h3>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-light mt-4">{item.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
