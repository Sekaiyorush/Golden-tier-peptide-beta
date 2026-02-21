import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useDatabase } from '@/context/DatabaseContext';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export function Contact() {
    const { db } = useDatabase();
    const settings = db.siteSettings;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <SEO
                title="Contact Support"
                description="Get in touch with Golden Tier Peptide. We're here to help with any inquiries about our research products, shipping, or your orders."
            />
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Breadcrumbs />
                <div className="text-center mb-12 mt-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
                    <p className="text-lg text-slate-500">
                        Have questions? We're here to help with any inquiries about our products or services.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { icon: Mail, title: 'Email', detail: settings.contactEmail, sub: 'We reply within 24 hours' },
                        { icon: Phone, title: 'Phone', detail: settings.contactPhone, sub: settings.businessHours },
                        { icon: MapPin, title: 'Location', detail: settings.contactLocation, sub: settings.shippingInfo },
                    ].map((item) => (
                        <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <item.icon className="h-6 w-6 text-slate-700" />
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                            <p className="text-slate-700 text-sm font-medium">{item.detail}</p>
                            <p className="text-slate-400 text-xs mt-1">{item.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageSquare className="h-6 w-6 text-slate-700" />
                        <h2 className="text-xl font-semibold text-slate-900">Send a Message</h2>
                    </div>
                    <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Message sent! We will get back to you soon.'); }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                                <input type="text" required className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-200" placeholder="Your name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                <input type="email" required className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-200" placeholder="you@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                            <input type="text" required className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-200" placeholder="How can we help?" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                            <textarea rows={4} required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-200 resize-none" placeholder="Your message..." />
                        </div>
                        <button type="submit" className="w-full h-12 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
