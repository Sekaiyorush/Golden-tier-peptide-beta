import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

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
          </div>

          {/* Products Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Products
            </h4>
            <ul className="space-y-2">
              {['BPC-157', 'TB-500', 'CJC-1295', 'Ipamorelin', 'GHRP-6'].map((product) => (
                <li key={product}>
                  <Link 
                    to={`/products`} 
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {product}
                  </Link>
                </li>
              ))}
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
                { label: 'Quality Control', href: '/quality' },
                { label: 'Shipping & Returns', href: '/shipping' },
                { label: 'Contact Support', href: '/contact' },
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
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  123 Research Blvd, Suite 100<br />
                  San Diego, CA 92121
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">+1 (800) 555-0123</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">support@goldentier.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
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
