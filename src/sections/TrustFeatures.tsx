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
      title: 'Expert Research Support',
      description: 'Dedicated team of specialists available to help with dosage guidance and product selection.',
    },
    {
      icon: FlaskConical,
      title: 'Laboratory Certified',
      description: 'All products manufactured in ISO-certified facilities with strict quality control.',
    },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-[#D4AF37]/10 pb-8 gap-6">
          <div>
            <span className="text-[10px] font-bold text-[#AA771C] uppercase tracking-[0.3em] mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">
              The Golden Standard
            </h2>
          </div>
          <p className="max-w-md text-xs text-slate-500 uppercase tracking-widest leading-relaxed">
            Uncompromising quality control and precision manufacturing for the world's leading research institutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Animated line on hover */}
              <div className="absolute -left-6 top-0 w-[1px] h-0 bg-gradient-to-b from-[#D4AF37] to-transparent transition-all duration-700 group-hover:h-full opacity-0 group-hover:opacity-100 hidden md:block" />

              {/* Icon */}
              <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center mb-6 group-hover:border-[#D4AF37] transition-colors duration-500 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <feature.icon className="h-5 w-5 text-[#AA771C] relative z-10" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl text-slate-900 mb-4 group-hover:text-[#AA771C] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-wider">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
