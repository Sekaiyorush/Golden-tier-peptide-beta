import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white mt-12 md:mt-24 mb-16 px-6 md:px-12 font-sans">
      {/* Subtle Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.05)_0%,_rgba(255,255,255,1)_70%)]" />

      <div className="container relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">

        {/* Left Side: Typography */}
        <div className="flex-1 flex flex-col space-y-8 text-left">

          <div className="inline-flex items-center space-x-3 px-4 py-2 border border-[#D4AF37]/30 bg-[#D4AF37]/5 w-max">
            <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-[10px] text-[#AA771C] font-bold tracking-[0.3em] uppercase">Premium Research Grade</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-slate-900 leading-[1.1]">
            Unlock the <br />
            Future of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#AA771C] via-[#F3E5AB] to-[#D4AF37]">Research</span>
          </h1>

          <div className="w-12 h-[1px] bg-[#D4AF37] opacity-50" />

          <p className="max-w-md text-sm text-slate-500 leading-relaxed tracking-wide uppercase">
            Premium grade compounds for laboratory use. Validated purity, consistent quality, and uncompromising precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <Link
              to="/products"
              className="relative inline-flex h-14 items-center justify-center bg-[#111] px-8 text-[11px] font-bold tracking-[0.2em] text-white uppercase overflow-hidden group border border-[#111]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite]" />
              <span className="relative z-10 transition-colors group-hover:text-[#D4AF37]">View Catalog</span>
              <ArrowRight className="relative z-10 ml-3 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-[#D4AF37]" />
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-500 ease-out group-hover:w-full" />
            </Link>
          </div>
        </div>

        {/* Right Side: Abstract Visual / Stats */}
        <div className="flex-1 relative w-full lg:h-[500px] flex items-center justify-center lg:justify-end">
          {/* Architectural Wireframe Element */}
          <div className="relative w-full max-w-md aspect-square border border-[#D4AF37]/20 flex items-center justify-center p-8 shadow-[0_20px_60px_rgba(212,175,55,0.05)] bg-white/50 backdrop-blur-sm group hover:border-[#D4AF37]/40 transition-colors duration-1000">
            <div className="absolute inset-4 border border-[#D4AF37]/10 flex flex-col justify-between p-6">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#D4AF37]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#D4AF37]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#D4AF37]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#D4AF37]" />

              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-3xl font-serif text-slate-900 group-hover:text-[#AA771C] transition-colors duration-500">99%<span className="text-[#D4AF37]">+</span></p>
                  <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-slate-400">Purity</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-3xl font-serif text-slate-900 group-hover:text-[#AA771C] transition-colors duration-500">5k<span className="text-[#D4AF37]">+</span></p>
                  <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-slate-400">Clients</p>
                </div>
              </div>

              <div className="self-center">
                <div className="w-16 h-16 border-[0.5px] border-[#D4AF37] rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-full animate-pulse" />
                  <div className="w-8 h-[0.5px] bg-[#D4AF37] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                  <div className="w-8 h-[0.5px] bg-[#D4AF37] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                </div>
              </div>

              <div className="flex justify-center text-center">
                <div className="space-y-1">
                  <p className="text-3xl font-serif text-slate-900 group-hover:text-[#AA771C] transition-colors duration-500">24<span className="text-xl">h</span></p>
                  <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-slate-400">Shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
