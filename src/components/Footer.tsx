import { Link } from 'react-router-dom';
import { useDatabase } from '@/context/DatabaseContext';
import { Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const { db } = useDatabase();
  const settings = db.siteSettings;
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Show top 5 products dynamically
  const topProducts = db.products.slice(0, 5);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-gold-900/30">
      <div className="container mx-auto px-6 md:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1a1a1a] to-black border border-gold-800 rounded-xl flex items-center justify-center group-hover:border-gold-500 transition-colors duration-300">
                <span className="text-gold-500 font-serif font-bold text-sm tracking-widest">GT</span>
              </div>
              <span className="text-sm font-bold tracking-[0.2em] uppercase text-gold-500">Golden Tier</span>
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed font-light tracking-wide max-w-xs">
              Premium research peptides for scientific exploration. Committed to purity, rigorous testing, and exceptional quality.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-zinc-800 hover:border-gold-500 hover:bg-gold-500/5 rounded-full flex items-center justify-center transition-all duration-300 group" aria-label="Instagram">
                <svg className="w-4 h-4 text-zinc-500 group-hover:text-gold-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-zinc-800 hover:border-gold-500 hover:bg-gold-500/5 rounded-full flex items-center justify-center transition-all duration-300 group" aria-label="X / Twitter">
                <svg className="w-4 h-4 text-zinc-500 group-hover:text-gold-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-zinc-800 hover:border-gold-500 hover:bg-gold-500/5 rounded-full flex items-center justify-center transition-all duration-300 group" aria-label="Telegram">
                <svg className="w-4 h-4 text-zinc-500 group-hover:text-gold-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
              </a>
            </div>
          </div>

          {/* Products Column — Dynamic from DB */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-500 mb-6">
              Products
            </h4>
            <ul className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/product/${product.sku}`}
                      className="text-zinc-400 hover:text-gold-500 transition-colors text-xs font-medium tracking-wide"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link to="/products" className="text-zinc-400 hover:text-gold-500 transition-colors text-xs font-medium tracking-wide">
                    View All Products
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-500 mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Research & Quality', href: '/research' },
                { label: 'Contact Support', href: '/contact' },
                { label: 'Shipping & Returns', href: '/shipping' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-zinc-400 hover:text-gold-500 transition-colors text-xs font-medium tracking-wide">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-500 mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 group">
                <Mail className="h-4 w-4 text-zinc-500 group-hover:text-gold-500 transition-colors flex-shrink-0" />
                <span className="text-zinc-400 text-xs tracking-wide">{settings.contactEmail}</span>
              </li>
              <li className="flex items-start space-x-3 group">
                <MapPin className="h-4 w-4 text-zinc-500 group-hover:text-gold-500 transition-colors mt-0.5 flex-shrink-0" />
                <span className="text-zinc-400 text-xs tracking-wide leading-relaxed">
                  {settings.contactLocation}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900">
          {/* Newsletter Signup */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-2">Stay Updated</h4>
              <p className="text-xs font-light text-zinc-500 uppercase tracking-widest">Get notified about new products and research.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex items-center w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                required
                className="px-5 py-3 bg-zinc-900/50 border border-zinc-800 rounded-l-lg text-xs tracking-widest text-white placeholder-zinc-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500 w-full md:w-64 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-zinc-800 border border-zinc-800 border-l-0 text-gold-500 rounded-r-lg text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all flex items-center space-x-2"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{subscribed ? 'Sent' : 'Submit'}</span>
              </button>
            </form>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t border-zinc-900">
            <p className="text-zinc-600 text-[10px] font-medium tracking-widest uppercase">
              &copy; {currentYear} Golden Tier Peptide. All rights reserved.
            </p>
            <p className="text-zinc-600 text-[10px] font-medium tracking-widest uppercase">
              For Research Purposes Only. Not for Human Consumption.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
