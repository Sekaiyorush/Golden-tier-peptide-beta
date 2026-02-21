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
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">GT</span>
              </div>
              <span className="text-lg font-semibold">Golden Tier</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium research peptides for scientific exploration. Committed to purity, rigorous testing, and exceptional quality.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors" aria-label="X / Twitter">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors" aria-label="Telegram">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
              </a>
            </div>
          </div>

          {/* Products Column — Dynamic from DB */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Products
            </h4>
            <ul className="space-y-2">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/product/${product.sku}`}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link to="/products" className="text-slate-400 hover:text-white transition-colors text-sm">
                    View All Products
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Research & Quality', href: '/research' },
                { label: 'Contact Support', href: '/contact' },
                { label: 'Shipping & Returns', href: '/shipping' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">{settings.contactEmail}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  {settings.contactLocation}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          {/* Newsletter Signup */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-white">Stay Updated</h4>
              <p className="text-xs text-slate-500">Get notified about new products and research updates.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-l-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 w-56"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white text-slate-900 rounded-r-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center space-x-1"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{subscribed ? 'Subscribed!' : 'Subscribe'}</span>
              </button>
            </form>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-6 border-t border-slate-800">
            <p className="text-slate-500 text-sm">
              &copy; {currentYear} Golden Tier Peptide. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs">
              For Research Purposes Only. Not for Human Consumption.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
