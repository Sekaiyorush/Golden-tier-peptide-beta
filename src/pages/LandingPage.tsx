import { Link } from 'react-router-dom';
import { useDatabase } from '@/context/DatabaseContext';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const GoldenVine = ({ side }: { side: 'left' | 'right' }) => {
    const isLeft = side === 'left';
    return (
        <div className={`absolute top-0 ${isLeft ? '-left-10 md:left-0' : '-right-10 md:right-0'} w-48 md:w-[30vw] h-[120vh] pointer-events-none z-10 overflow-hidden mix-blend-multiply opacity-80 max-w-[400px]`}>
            <svg viewBox="0 0 100 400" className="w-full h-full drop-shadow-md" preserveAspectRatio={isLeft ? "xMinYMid slice" : "xMaxYMid slice"} style={{ transform: isLeft ? 'none' : 'scaleX(-1)' }}>
                <defs>
                    <linearGradient id="gold-vine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#AA771C" />
                        <stop offset="50%" stopColor="#F3E5AB" />
                        <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                </defs>

                {/* Main Stem */}
                <motion.path
                    d="M 10 420 Q 40 380 20 330 T 40 240 T 10 160 T 30 80 T 10 -20"
                    fill="none"
                    stroke="url(#gold-vine)"
                    strokeWidth="1.2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 6, ease: "easeInOut" }}
                />

                {/* Secondary Stem */}
                <motion.path
                    d="M 10 400 Q 30 360 40 310 Q 50 250 20 200 T 50 100 T 30 -10"
                    fill="none"
                    stroke="url(#gold-vine)"
                    strokeWidth="0.8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 7, delay: 0.5, ease: "easeInOut" }}
                />

                {/* Thorn accents */}
                <motion.path
                    d="M 27 340 L 32 335 L 25 330 M 35 250 L 40 245 L 32 240 M 15 170 L 20 165 L 12 160"
                    fill="none"
                    stroke="url(#gold-vine)"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: 3, ease: "easeOut" }}
                />

                {/* Golden Rose Buds / Leaves */}
                {[
                    [380, 20, 45, 1, 1],
                    [330, 20, -30, 0.8, 1.5],
                    [280, 35, 60, 1.2, 2.5],
                    [240, 25, -45, 0.9, 3],
                    [180, 20, 35, 1.1, 4],
                    [120, 28, -60, 0.8, 4.5],
                    [60, 35, 45, 1.2, 5.5],
                ].map(([y, offset, angle, scale, delay], i) => (
                    <motion.g
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale, opacity: 1 }}
                        transition={{ duration: 2, delay: delay as number, type: "spring", stiffness: 100 }}
                        style={{ transformOrigin: `${offset}px ${y}px`, transform: `rotate(${angle}deg)` }}
                    >
                        <path
                            d={`M ${offset} ${y} C ${offset + 10} ${y - 12}, ${offset + 25} ${y - 8}, ${offset + 30} ${y + 15} C ${offset + 15} ${y + 20}, ${offset} ${y + 10}, ${offset} ${y}`}
                            fill="url(#gold-vine)"
                            opacity="0.9"
                        />
                        <path
                            d={`M ${offset + 5} ${y + 2} C ${offset + 12} ${y - 5}, ${offset + 20} ${y - 2}, ${offset + 22} ${y + 10}`}
                            fill="none"
                            stroke="#fff"
                            strokeWidth="0.5"
                            opacity="0.5"
                        />
                    </motion.g>
                ))}
            </svg>
        </div>
    )
}

export function LandingPage() {
    const { db } = useDatabase();
    const { companyName, companyDescription } = db.siteSettings;
    const { scrollY } = useScroll();
    const ySpring = useSpring(scrollY, { stiffness: 40, damping: 20 });
    const yTitle = useTransform(ySpring, [0, 500], [0, 150]);
    const yQueen = useTransform(ySpring, [0, 500], [0, 50]);

    // Generate 25 floating gold particles
    const particles = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 15 + 15,
        delay: Math.random() * 5,
    }));

    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">

            {/* Dynamic Gold Particles Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA771C] opacity-30 shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                        style={{
                            width: p.size,
                            height: p.size,
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                        }}
                        animate={{
                            y: ["0vh", "-100vh"],
                            x: ["0vw", `${(Math.random() - 0.5) * 20}vw`],
                            opacity: [0, 0.4, 0],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: p.delay,
                        }}
                    />
                ))}
            </div>

            {/* Subtle background glow & Queen Portrait */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.03)_0%,_rgba(255,255,255,1)_60%)]" />
            <motion.div
                style={{ y: yQueen }}
                className="absolute inset-x-0 top-10 bottom-[-20%] pointer-events-none z-0 flex items-center justify-center opacity-[0.20] mix-blend-multiply"
            >
                <div className="w-full h-full max-w-[1400px] bg-[url('/queen-bg.png')] bg-contain bg-center bg-no-repeat" />
            </motion.div>

            {/* Golden Rose Vines */}
            <GoldenVine side="left" />
            <GoldenVine side="right" />

            {/* Header - Ultra Minimal */}
            <header className="relative z-20 flex items-center justify-between px-8 py-10 w-full max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-sm font-bold tracking-[0.3em] uppercase text-[#AA771C]"
                >
                    {companyName}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="flex items-center space-x-8"
                >
                    <Link
                        to="/login"
                        className="text-xs font-semibold tracking-widest uppercase text-[#AA771C] hover:text-[#D4AF37] transition-colors duration-500 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-sm"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="relative px-6 py-2 text-xs font-semibold tracking-widest uppercase text-[#333] border border-[#D4AF37]/50 hover:border-[#D4AF37] bg-white/70 backdrop-blur-md overflow-hidden group transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite]" />
                        <span className="relative z-10">Register</span>
                    </Link>
                </motion.div>
            </header>

            {/* Hero Section - Extreme Negative Space */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">

                {/* Animated Accent Line */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 80 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                    className="w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent mb-12"
                />

                <motion.div
                    style={{ y: yTitle }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Main Title - Shiny Gold Gradient with shadow overlay for contrast against background */}
                    <div className="relative">
                        <motion.h1
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                            className="text-[4.5rem] sm:text-[6rem] lg:text-[9rem] font-serif tracking-tight leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-[#AA771C] via-[#F3E5AB] to-[#D4AF37] animate-gradient-x bg-[length:200%_auto] pb-4 drop-shadow-[0_4px_4px_rgba(255,255,255,0.8)]"
                        >
                            Purity.
                            <br />
                            Precision.
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="mt-12 bg-white/40 backdrop-blur-sm p-4 rounded-xl inline-block"
                    >
                        <p className="text-sm md:text-base font-light tracking-[0.2em] text-slate-600 max-w-xl mx-auto leading-relaxed uppercase">
                            {companyDescription}
                        </p>
                    </motion.div>

                    {/* Luxury CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
                        className="mt-20 flex justify-center pb-20"
                    >
                        <Link
                            to="/login"
                            className="group relative flex items-center justify-center w-36 h-36 rounded-full border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-colors duration-700 mx-auto bg-white/50 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_50px_rgba(212,175,55,0.3)]"
                        >
                            {/* Rotating glowing arc */}
                            <div className="absolute inset-[-1px] rounded-full bg-gradient-to-tr from-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-700" />
                            <div className="absolute inset-[1px] rounded-full bg-white/80 z-0" />

                            <span className="relative z-10 text-[11px] font-bold tracking-[0.3em] uppercase text-[#AA771C] group-hover:text-[#D4AF37] transition-colors duration-500">
                                Enter <br /><span className="mt-1 block">Portal</span>
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>
            </main>

            {/* Footer - Bare Minimum */}
            <footer className="relative z-20 text-center py-12 px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 1.5 }}
                    className="flex flex-col items-center justify-center space-y-4"
                >
                    <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
                    <p className="text-[10px] font-medium tracking-widest text-[#D4AF37]/60 uppercase bg-white/50 backdrop-blur-sm px-4 py-1 rounded">
                        © {new Date().getFullYear()} {companyName}
                    </p>
                </motion.div>
            </footer>
        </div>
    );
}
