export function Privacy() {
    return (
        <div className="min-h-screen bg-transparent py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none -z-10" />

            <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
                <div className="text-center mb-12">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-500 mb-4 block">Data Security</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Privacy Policy</h1>
                </div>

                <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-h3:text-2xl prose-h3:text-slate-900 prose-h3:mb-4 prose-h4:text-lg prose-h4:text-slate-800 prose-p:text-slate-500 prose-p:font-light prose-p:leading-relaxed prose-li:text-slate-500 prose-li:font-light prose-strong:text-slate-800 prose-strong:font-semibold">
                    <h3 className="flex items-center gap-3">
                        <span className="w-8 h-px bg-gold-400 inline-block" />
                        1. Information We Collect
                    </h3>
                    <p>
                        When you create an elite account, place an order authorization, or contact our concierge, we discreetly collect the following telemetry:
                    </p>
                    <ul className="marker:text-gold-500">
                        <li>Name and primary contact information (email, verified phone)</li>
                        <li>Encrypted logistics and billing addresses</li>
                        <li>Acquisition history and institutional research affiliations (contingent on partner status)</li>
                    </ul>

                    <h3 className="flex items-center gap-3 mt-10">
                        <span className="w-8 h-px bg-gold-400 inline-block" />
                        2. How We Utilize Your Telemetry
                    </h3>
                    <p>
                        We deploy encrypted information precisely to:
                    </p>
                    <ul className="marker:text-gold-500">
                        <li>Process and execute secure compound authorizations flawlessly</li>
                        <li>Communicate critical updates pertaining to vector tracking or concierge inquiries</li>
                        <li>Evolve our platform infrastructure, security protocols, and exclusive offerings</li>
                    </ul>

                    <h3 className="flex items-center gap-3 mt-10">
                        <span className="w-8 h-px bg-gold-400 inline-block" />
                        3. Defense & Encryption
                    </h3>
                    <p>
                        We enforce strict, military-grade defensive protocols, encompassing end-to-end encryption frameworks and heavily isolated server infrastructure, protecting all telemetry. We explicitly do not log or store full financial details internally; transactions pass securely through compliant, sovereign-grade gateways.
                    </p>

                    <h3 className="flex items-center gap-3 mt-10">
                        <span className="w-8 h-px bg-gold-400 inline-block" />
                        4. Sovereign Non-Sharing Policy
                    </h3>
                    <p>
                        Golden Tier firmly does not broker, distribute, or rent your identity telemetry to arbitrary third parties. Relevant data chunks are exclusively relayed to vetted, sworn logistics integrators, solely to execute physical fulfillment sequences.
                    </p>

                    <h3 className="flex items-center gap-3 mt-10">
                        <span className="w-8 h-px bg-gold-400 inline-block" />
                        5. Client Supremacy
                    </h3>
                    <p>
                        You command supreme authority to demand access to, real-time modification of, or total destruction of your personal data node. To execute these directives, petition the support tier via <a href="mailto:support@goldentierpeptide.com" className="text-gold-600 hover:text-gold-700 font-semibold transition-colors">support@goldentierpeptide.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
