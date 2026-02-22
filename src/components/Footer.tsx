import { useDatabase } from '@/context/DatabaseContext';

export function Footer() {
  const { db } = useDatabase();
  const { companyName } = db.siteSettings;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 text-center py-24 px-6 bg-white shrink-0">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Subtle gold line accent */}
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#D4AF37]/30 to-transparent" />

        <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37]/80 uppercase">
          © {currentYear} {companyName}
        </p>

        <p className="text-[9px] font-semibold tracking-[0.2em] text-slate-300 uppercase max-w-md leading-relaxed mx-auto">
          Premium research peptides for scientific exploration. Validated purity, consistent quality. For Research Purposes Only.
        </p>
      </div>
    </footer>
  );
}
