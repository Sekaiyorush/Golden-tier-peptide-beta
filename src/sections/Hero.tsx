import { Link } from 'react-router-dom';
import { ArrowRight, Beaker } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-slate opacity-[0.03]" />
      
      <div className="container relative z-10 px-4 md:px-6 py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-full mx-auto lg:mx-0">
                <Beaker className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-slate-600 font-medium">Premium Research Grade</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 leading-tight">
                Unlock the Future of
                <span className="block text-slate-600">Research</span>
              </h1>
              
              <p className="max-w-lg mx-auto lg:mx-0 text-lg text-slate-500 leading-relaxed">
                Premium grade peptides for laboratory research. Validated purity, consistent quality, and rapid delivery for your scientific needs.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/products"
                className="group inline-flex h-12 items-center justify-center rounded-lg bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
              >
                View Catalog
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/quality"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Quality Guarantee
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 pt-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-slate-900">99%+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Purity</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-semibold text-slate-900">5000+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Customers</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-semibold text-slate-900">24h</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Shipping</p>
              </div>
            </div>
          </div>
          
          <div className="relative mx-auto w-full max-w-lg">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
              {/* Abstract product representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-slate-200 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-slate-300 rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center">
                      <Beaker className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-8 right-8 px-4 py-2 bg-white rounded-lg shadow-card">
                <span className="text-sm font-medium text-slate-900">HPLC Tested</span>
              </div>
              <div className="absolute bottom-8 left-8 px-4 py-2 bg-slate-900 rounded-lg shadow-card">
                <span className="text-sm font-medium text-white">Lab Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
