export function Shipping() {
    return (
        <div className="min-h-screen bg-transparent py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none -z-10" />

            <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
                <div className="text-center mb-12">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500 mb-4 block">Logistics</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Shipping & Returns</h1>
                </div>

                <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-h3:text-2xl prose-h3:text-slate-900 prose-h3:mb-4 prose-h4:text-lg prose-h4:text-slate-800 prose-p:text-slate-500 prose-p:font-light prose-p:leading-relaxed prose-li:text-slate-500 prose-li:font-light prose-strong:text-slate-800 prose-strong:font-semibold">
                    <h3 className="flex items-center gap-3">
                        <span className="w-8 h-px bg-gold-400 inline-block" />
                        Logistics Policy
                    </h3>
                    <p>
                        We process and orchestrate secure shipping Monday through Friday. Authorizations finalized before 1:00 PM EST are typically fulfilled the exact same day. Authorizations processed post-cutoff or during weekends commence fulfillment the following business cycle.
                    </p>

                    <h4>Domestic Priority (US)</h4>
                    <ul className="marker:text-gold-500">
                        <li><strong>Standard Fulfillment:</strong> 3-5 business days</li>
                        <li><strong>Priority Fulfillment:</strong> 2-3 business days</li>
                        <li><strong>Expedited Overnight:</strong> Next business day (where infrastructure allows)</li>
                    </ul>

                    <h4>International Reach</h4>
                    <p>
                        Golden Tier provides shipping to vetted international destinations. Delivery intervals range typically from 7-14 business days. The acquirer assumes ultimate responsibility for all customs clearance, definitive import duties, and strict comprehension regarding local importation regulations of analytical compounds. We claim zero liability for pacakges seized by regulatory authorities.
                    </p>

                    <hr className="my-12 border-t border-gold-100/50" />

                    <h3 className="flex items-center gap-3">
                        <span className="w-8 h-px bg-gold-400 inline-block" />
                        Returns & Integrity
                    </h3>
                    <p>
                        Due to the ultra-sensitive nature of our synthesized compounds, returns are strictly prohibited once a package enters transit and the temperature/quality seal logic is breached. This absolute policy guarantees the pristine purity and uncompromising integrity of our entire active supply chain.
                    </p>

                    <h4>Refund Exclusions</h4>
                    <ul className="marker:text-gold-500">
                        <li><strong>Transit Compromise:</strong> Should a parcel arrive damaged, photographic documentation is required; inform our concierge within 48 hours.</li>
                        <li><strong>Fulfillment Discrepancies:</strong> If a packing sequence error occurred on our end, the accurate items will be reshipped instantly at zero cost to the client.</li>
                        <li><strong>Tracking Absences:</strong> If standard tracking reflects null updates for 14 days (domestic) or 30 days (international), a formal investigation triggers, yielding a replacement or refund based on resolution.</li>
                    </ul>

                    <p className="mt-10 p-6 bg-slate-50/50 rounded-xl border border-slate-100 text-sm text-slate-500 text-center">
                        For any logistical anomalies or integrity inquiries, direct correspondence to <a href="mailto:support@goldentierpeptide.com" className="text-gold-600 hover:text-gold-700 font-semibold transition-colors">support@goldentierpeptide.com</a> citing your Authorization ID.
                    </p>
                </div>
            </div>
        </div>
    );
}
