import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { SearchBar } from './SearchBar';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Globe } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { toggleCart, cartCount } = useCart();
  const { language, toggleLanguage } = useLanguage();
  const { isAuthenticated, isAdmin, isPartner, logout } = useAuth();

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isPartner) return '/partner';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Dashboard';
    if (isPartner) return 'Partner Dashboard';
    return 'My Account';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#D4AF37]/20 transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/brand-logo-gold.png"
            alt="Golden Tier Logo"
            className="h-20 w-auto object-contain drop-shadow-sm group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-all duration-500 transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-10">
          <Link to="/products" className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 hover:text-[#D4AF37] transition-colors duration-500">
            Products
          </Link>
          <Link to="/about" className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 hover:text-[#D4AF37] transition-colors duration-500">
            About
          </Link>
          <Link to="/research" className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 hover:text-[#D4AF37] transition-colors duration-500">
            Research
          </Link>
          <Link to="/contact" className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 hover:text-[#D4AF37] transition-colors duration-500">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex flex-1 max-w-xs mx-6">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-5">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 text-[10px] font-semibold tracking-widest text-slate-400 hover:text-gold-500 transition-colors duration-300 uppercase"
            title="Switch language"
          >
            <Globe className="h-4 w-4" />
            <span>{language}</span>
          </button>

          {isPartner && (
            <button
              onClick={toggleCart}
              aria-label={`Shopping cart with ${cartCount} items`}
              className="relative p-2 text-slate-400 hover:text-gold-500 transition-colors duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute 0 right-0 flex h-4 w-4 items-center justify-center bg-[#D4AF37] text-[9px] font-bold text-white shadow-sm shadow-[#D4AF37]/40">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-6">
              {/* Dashboard Link */}
              <Link
                to={getDashboardLink()}
                className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#AA771C] hover:text-[#D4AF37] transition-colors duration-500"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{getDashboardLabel()}</span>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  aria-label="User account menu"
                  aria-expanded={isUserMenuOpen}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-full transition-all duration-500 group"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                    <User className="h-4 w-4 text-[#AA771C] group-hover:text-[#D4AF37]" />
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-[#D4AF37]/20 p-2 shadow-xl shadow-black/5">
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center space-x-3 px-4 py-3 text-[10px] font-bold tracking-widest text-slate-600 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors uppercase"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>{getDashboardLabel()}</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-[10px] font-bold tracking-widest text-[#111] hover:text-white hover:bg-[#111] transition-colors uppercase group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_3s_infinite]" />
                      <LogOut className="h-4 w-4 relative z-10" />
                      <span className="relative z-10">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center justify-center px-8 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white bg-[#111] border border-[#111] overflow-hidden group relative shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite]" />
              <span className="relative z-10 transition-colors group-hover:text-[#D4AF37]">SIGN IN</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-500 ease-out group-hover:w-full" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle mobile menu"
          aria-expanded={isMenuOpen}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#D4AF37]/20 bg-white absolute w-full shadow-2xl">
          <div className="p-6 border-b border-[#D4AF37]/10">
            <SearchBar />
          </div>
          <nav aria-label="Mobile Navigation" className="flex flex-col py-4">
            <Link
              to="/products"
              className="px-6 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors border-b border-[#D4AF37]/5"
              onClick={() => setIsMenuOpen(false)}
            >
              Catalog
            </Link>
            <Link
              to="/about"
              className="px-6 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors border-b border-[#D4AF37]/5"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/research"
              className="px-6 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors border-b border-[#D4AF37]/5"
              onClick={() => setIsMenuOpen(false)}
            >
              Research
            </Link>
            <Link
              to="/contact"
              className="px-6 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 hover:text-[#D4AF37] hover:bg-slate-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <div className="mx-6 my-4 border-t border-[#D4AF37]/20" />
                <Link
                  to={getDashboardLink()}
                  className="px-6 py-4 text-[10px] font-bold tracking-[0.3em] uppercase text-[#AA771C] bg-[#D4AF37]/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {getDashboardLabel()}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="px-6 py-4 text-left text-[10px] font-bold tracking-[0.3em] uppercase text-slate-900 border-t border-[#D4AF37]/5"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="p-6">
                <Link
                  to="/login"
                  className="block w-full py-4 bg-[#111] text-white text-center text-[10px] font-bold tracking-[0.3em] uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
