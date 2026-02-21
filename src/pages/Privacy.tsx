export function Privacy() {
    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm prose prose-slate max-w-none">
                    <h3>1. Information We Collect</h3>
                    <p>
                        When you create an account, place an order, or contact us, we may collect the following information:
                    </p>
                    <ul>
                        <li>Name and contact information (email, phone)</li>
                        <li>Shipping and billing addresses</li>
                        <li>Order history and research affiliation details (if applicable)</li>
                    </ul>

                    <h3>2. How We Use Your Information</h3>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul>
                        <li>Process and fulfill your orders accurately</li>
                        <li>Communicate with you regarding order statuses or customer service inquiries</li>
                        <li>Improve our website, security, and service offerings</li>
                    </ul>

                    <h3>3. Data Protection & Security</h3>
                    <p>
                        We implement industry-standard security measures, including encryption and secure server hosting, to protect your personal data. We do not store full credit card details on our servers; payments are processed securely through certified gateways.
                    </p>

                    <h3>4. Information Sharing</h3>
                    <p>
                        We do not sell, trade, or rent your personal information to third parties. We may share necessary details with trusted logistics partners strictly for the purpose of order fulfillment.
                    </p>

                    <h3>5. Your Rights</h3>
                    <p>
                        You have the right to request access to, correction of, or deletion of your personal data. Please contact our support team at support@goldentierpeptide.com for any data-related requests.
                    </p>
                </div>
            </div>
        </div>
    );
}
