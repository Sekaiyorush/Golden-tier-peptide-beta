import { FlaskConical, ShieldCheck, FileSearch, BookOpen } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export function Research() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <SEO
                title="Research & Quality"
                description="Learn about our commitment to scientific integrity, third-party testing, and purity standards for all research peptides."
            />
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Breadcrumbs />
                <div className="text-center mb-12 mt-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Research & Quality</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Our commitment to scientific integrity starts with how we source, test, and deliver every product.
                    </p>
                </div>

                <div className="space-y-6">
                    {[
                        {
                            icon: FlaskConical,
                            title: 'Third-Party Testing',
                            content: 'Every batch of peptides undergoes independent third-party testing using High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) to verify identity and purity. Certificates of Analysis (CoA) are available upon request for any product.',
                        },
                        {
                            icon: ShieldCheck,
                            title: 'Purity Standards',
                            content: 'We maintain a minimum purity threshold of 98% for all products, with most exceeding 99%. Our quality control process includes visual inspection, weight verification, and analytical testing before any batch is approved for distribution.',
                        },
                        {
                            icon: FileSearch,
                            title: 'Documentation & Traceability',
                            content: 'Each product is assigned a unique SKU and batch number, enabling full traceability from synthesis to delivery. Our QR code system allows researchers to instantly verify product authenticity and access batch-specific test data.',
                        },
                        {
                            icon: BookOpen,
                            title: 'Research Use Only',
                            content: 'All products sold by Golden Tier Peptide are intended strictly for in-vitro research and laboratory use. They are not intended for human or veterinary use, and should only be handled by qualified researchers in appropriate laboratory settings.',
                        },
                    ].map((item) => (
                        <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                    <item.icon className="h-6 w-6 text-slate-700" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{item.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
