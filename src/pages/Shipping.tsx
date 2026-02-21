export function Shipping() {
    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Shipping & Returns</h1>

                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm prose prose-slate max-w-none">
                    <h3>Shipping Policy</h3>
                    <p>
                        We process and ship orders Monday through Friday. Orders placed before 1:00 PM EST typically ship the same day. Orders placed after the cutoff or on weekends will ship the next business day.
                    </p>

                    <h4>Domestic Shipping (US)</h4>
                    <ul>
                        <li><strong>Standard Shipping:</strong> 3-5 business days</li>
                        <li><strong>Priority Shipping:</strong> 2-3 business days</li>
                        <li><strong>Overnight Shipping:</strong> Next business day (where available)</li>
                    </ul>

                    <h4>International Shipping</h4>
                    <p>
                        We ship to select international destinations. Delivery times vary by location, typically ranging from 7-14 business days. The buyer is responsible for all customs clearance, import duties, and understanding their local regulations regarding the importation of research peptides. We are not liable for packages seized by customs.
                    </p>

                    <hr className="my-8" />

                    <h3>Returns & Refunds</h3>
                    <p>
                        Due to the sensitive nature of our research compounds, we cannot accept returns once the product has been shipped and the quality seal has been compromised. This ensures the absolute purity and integrity of our supply chain.
                    </p>

                    <h4>Exceptions for Refunds</h4>
                    <ul>
                        <li><strong>Transit Damage:</strong> If your package arrives damaged, please document the damage with photos and contact us within 48 hours of delivery.</li>
                        <li><strong>Order Errors:</strong> If we made a mistake in packing your order, we will reship the correct items immediately at no cost to you.</li>
                        <li><strong>Lost Packages:</strong> If your tracking shows no updates for 14 days (domestic) or 30 days (international), we will investigate and provide a replacement or refund.</li>
                    </ul>

                    <p className="mt-6 text-sm text-slate-500">
                        For any shipping issues or return inquiries, please email support@goldentierpeptide.com with your Order ID.
                    </p>
                </div>
            </div>
        </div>
    );
}
