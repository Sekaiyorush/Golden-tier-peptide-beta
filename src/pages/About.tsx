import { Shield, Award, Microscope, Users } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export function About() {
    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="About Us"
                description="Learn about Golden Tier Peptide's mission to provide the highest-purity, reliable research compounds for scientific exploration."
            />
            <Breadcrumbs />

            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            We are a premium research peptide supplier committed to purity, rigorous testing, and exceptional quality for the scientific community.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 max-w-4xl py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {[
                        { icon: Shield, title: 'Quality Assurance', desc: 'Every batch undergoes third-party HPLC and mass spectrometry testing to guarantee purity levels above 99%.' },
                        { icon: Award, title: 'Industry Standards', desc: 'We follow strict GMP-compliant processes and maintain comprehensive documentation for every product.' },
                        { icon: Microscope, title: 'Research Focus', desc: 'Our products are designed exclusively for legitimate scientific research and laboratory applications.' },
                        { icon: Users, title: 'Partner Network', desc: 'We work with trusted researchers and institutions worldwide through our vetted partner program.' },
                    ].map((item) => (
                        <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                                <item.icon className="h-6 w-6 text-slate-700" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">Our Mission</h2>
                    <p className="text-slate-500 leading-relaxed max-w-2xl mx-auto">
                        Golden Tier Peptide exists to provide researchers with the highest-quality peptides available. We believe that reliable, pure compounds are the foundation of meaningful scientific discovery. Every product we offer is backed by transparent testing data and handled with the utmost care.
                    </p>
                </div>
            </div>
        </div>
    );
}
