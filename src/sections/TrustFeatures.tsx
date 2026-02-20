import { Shield, Clock, Award, FlaskConical } from 'lucide-react';

export function TrustFeatures() {
  const features = [
    {
      icon: Shield,
      title: '99% Purity Guaranteed',
      description: 'Every batch is third-party tested (HPLC/MS) to ensure highest research standards.',
    },
    {
      icon: Clock,
      title: 'Fast & Secure Shipping',
      description: 'Discreet packaging with same-day shipping on orders placed before 2PM EST.',
    },
    {
      icon: Award,
      title: 'Review Loyalty Program',
      description: 'Earn points for every purchase and review to use on future research supplies.',
    },
    {
      icon: FlaskConical,
      title: 'Laboratory Certified',
      description: 'All products manufactured in ISO-certified facilities with strict quality control.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3 block">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
            The Golden Standard
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
