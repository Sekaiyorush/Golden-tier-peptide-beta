import { useEffect, useState } from 'react';

export function PremiumEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Gold Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.3); }
          50% { box-shadow: 0 0 40px rgba(212,175,55,0.6); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .gold-shimmer {
          background: linear-gradient(
            90deg,
            rgba(212,175,55,0) 0%,
            rgba(212,175,55,0.3) 50%,
            rgba(212,175,55,0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-gold {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .text-gradient-gold {
          background: linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #AA771C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .border-gradient {
          border: 2px solid transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, #D4AF37, #AA771C) border-box;
        }
      `}</style>
    </>
  );
}
