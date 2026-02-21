import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center hover:scale-110"
            aria-label="Back to top"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    );
}
