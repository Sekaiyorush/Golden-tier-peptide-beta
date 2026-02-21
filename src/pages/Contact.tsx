import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useDatabase } from '@/context/DatabaseContext';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export function Contact() {
    const { db } = useDatabase();
    const settings = db.siteSettings;

    return (
        <div className="min-h-screen bg-transparent py-14 relative overflow-hidden">
            {/* Luxury Background Hint */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none -z-10" />

            <SEO
                title="Concierge & Support | Golden Tier"
                description="Connect with Golden Tier for exclusive support regarding our premium research compounds, logistics, or partner inquiries."
            />
            <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
                <Breadcrumbs />
                <div className="text-center mb-16 mt-8">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500 mb-4 block">Concierge</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6 tracking-tight">Contact Us</h1>
                    <p className="text-lg text-slate-500 font-light max-w-xl mx-auto">
                        Our dedicated support team is available to assist you with inquiries regarding our formulations, logistics, or partner program.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { icon: Mail, title: 'Direct Email', detail: settings.contactEmail, sub: 'Priority Response' },
                        { icon: Phone, title: 'Dedicated Phone', detail: settings.contactPhone, sub: settings.businessHours },
                        { icon: MapPin, title: 'Headquarters', detail: settings.contactLocation, sub: settings.shippingInfo },
                    ].map((item) => (
                        <div key={item.title} className="bg-white/60 backdrop-blur-xl rounded-3xl border border-gold-200/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center group hover:-translate-y-1 transition-all duration-500">
                            <div className="w-14 h-14 bg-gradient-to-br from-gold-50 to-white border border-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <item.icon className="h-5 w-5 text-gold-600" />
                            </div>
                            <h3 className="font-serif text-xl text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-600 text-sm font-medium tracking-wide">{item.detail}</p>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-gold-500 mt-3">{item.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 shadow-md border border-slate-800">
                            <MessageSquare className="h-5 w-5 text-gold-400" />
                        </div>
                        <h2 className="text-3xl font-serif text-slate-900 tracking-tight">Send an Inquiry</h2>
                        <p className="text-sm font-light text-slate-500 mt-3 max-w-md">Provide detailed information so our team can assist you most effectively.</p>
                    </div>
                    <form className="space-y-6" onSubmit={e => { e.preventDefault(); alert('Message sent! We will get back to you soon.'); }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Full Name</label>
                                <input type="text" required className="w-full h-12 px-5 bg-white rounded-xl border border-gold-200/60 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all" placeholder="Dr. John Doe" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Email Address</label>
                                <input type="email" required className="w-full h-12 px-5 bg-white rounded-xl border border-gold-200/60 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all" placeholder="name@institution.edu" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Subject</label>
                            <input type="text" required className="w-full h-12 px-5 bg-white rounded-xl border border-gold-200/60 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all" placeholder="Nature of your inquiry" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Message</label>
                            <textarea rows={5} required className="w-full px-5 py-4 bg-white rounded-xl border border-gold-200/60 focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm transition-all resize-none" placeholder="Please detail your request..." />
                        </div>
                        <button type="submit" className="w-full h-14 mt-4 bg-slate-900 border border-slate-800 text-white font-semibold text-xs tracking-widest uppercase rounded-xl hover:bg-black hover:border-gold-500/50 transition-all shadow-md group relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                            <span className="relative z-10">Dispatch Message</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
