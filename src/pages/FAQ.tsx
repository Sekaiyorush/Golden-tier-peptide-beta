import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: 'Are your products for human consumption?',
        answer: 'No. All products sold by Golden Tier Peptide are strictly for laboratory and research use only. They are not intended for human consumption, diagnostic, therapeutic, or agricultural purposes.',
    },
    {
        question: 'How do you verify the purity of your peptides?',
        answer: 'We utilize independent third-party laboratories to conduct High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) testing on every batch. We guarantee a minimum of 99% purity.',
    },
    {
        question: 'How should peptides be stored?',
        answer: 'Lyophilized (freeze-dried) peptides should be stored in a freezer at -20°C or below for long-term storage. Once reconstituted with bacteriostatic water, they should be stored in a refrigerator at 2°C to 8°C and used within their stable timeframe, typically 2-4 weeks.',
    },
    {
        question: 'What is your shipping policy?',
        answer: 'We offer same-day shipping on all orders placed before 2:00 PM EST. Standard shipping takes 3-5 business days, while expedited options are available at checkout. All packages are shipped discreetly.',
    },
    {
        question: 'Do you ship internationally?',
        answer: 'Yes, we offer international shipping to select countries. However, the buyer is solely responsible for ensuring that the products comply with their local customs and import regulations. We do not take responsibility for seized packages.',
    },
    {
        question: 'What is your return or refund policy?',
        answer: 'Due to the nature of research chemicals and potential degradation if mishandled, we cannot accept returns once the product has left our facility. However, if there is a documented issue with purity or damage during transit, please contact our support team within 48 hours of delivery.',
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-transparent py-14 relative overflow-hidden">
            {/* Luxury Background Hint */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none -z-10" />

            <SEO
                title="FAQ | Golden Tier"
                description="Find answers to common questions about our research peptides, shipping, and quality standards."
            />

            <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
                <Breadcrumbs />

                <div className="text-center mb-16 mt-8">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500 mb-4 block">Inquiries</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
                        Comprehensive information regarding our formulations, analytical standards, and acquisition protocols.
                    </p>
                </div>

                <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border-b border-gold-100/50 last:border-0 transition-colors ${openIndex === index ? 'bg-gold-50/30' : 'hover:bg-slate-50/50'}`}
                        >
                            <button
                                className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none group"
                                onClick={() => toggleFaq(index)}
                            >
                                <span className="text-lg font-serif text-slate-900 pr-8 group-hover:text-gold-600 transition-colors">{faq.question}</span>
                                <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 ${openIndex === index ? 'bg-gold-500 text-white shadow-md' : 'bg-slate-100 text-slate-400 group-hover:bg-gold-100 group-hover:text-gold-600'}`}>
                                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </span>
                            </button>

                            <div
                                className={`px-8 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-slate-500 font-light leading-relaxed text-sm md:text-base">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-slate-900 text-white rounded-[2rem] p-12 text-center relative overflow-hidden shadow-xl border border-slate-800">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-900/20 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500 mb-4 block">Further Assistance</span>
                        <h2 className="text-3xl font-serif mb-4 tracking-tight">Require Special Attention?</h2>
                        <p className="text-slate-400 mb-8 font-light max-w-md mx-auto">Our scientific concierge team is available to assist with specific inquiries and partner arrangements.</p>
                        <a href="/contact" className="inline-block bg-white text-slate-900 font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-gold-50 transition-colors shadow-md">
                            Contact Concierge
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
