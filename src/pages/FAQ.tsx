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
        <div className="min-h-screen bg-slate-50 py-12">
            <SEO
                title="Frequently Asked Questions"
                description="Find answers to common questions about our research peptides, shipping, and quality standards."
            />

            <div className="container mx-auto px-4 max-w-4xl">
                <Breadcrumbs />

                <div className="text-center mb-12 mt-6">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Everything you need to know about our products, quality standards, and ordering process.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border-b border-slate-100 last:border-0 transition-colors ${openIndex === index ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}
                        >
                            <button
                                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                onClick={() => toggleFaq(index)}
                            >
                                <span className="text-lg font-medium text-slate-900 pr-8">{faq.question}</span>
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform duration-200">
                                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </span>
                            </button>

                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-slate-600 leading-relaxed text-base">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
                    <p className="text-slate-400 mb-6">Our research support team is here to help.</p>
                    <a href="/contact" className="inline-block bg-white text-slate-900 font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition-colors">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
