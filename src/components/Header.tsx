import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/context/DatabaseContext';
import { SearchBar } from './SearchBar';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Globe } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { toggleCart, cartCount } = useCart();
  const { language, toggleLanguage } = useLanguage();
  const { isAuthenticated, isAdmin, isPartner, logout } = useAuth();
  const { db } = useDatabase();

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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gold-200/50 transition-all duration-300">
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
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-widest uppercase">
          <Link to="/products" className="text-slate-500 hover:text-gold-500 transition-colors duration-300">
            Products
          </Link>
          <Link to="/about" className="text-slate-500 hover:text-gold-500 transition-colors duration-300">
            About
          </Link>
          <Link to="/research" className="text-slate-500 hover:text-gold-500 transition-colors duration-300">
            Research
          </Link>
          <Link to="/contact" className="text-slate-500 hover:text-gold-500 transition-colors duration-300">
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
              className="relative p-2 text-slate-400 hover:text-gold-500 transition-colors duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute 0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-bold text-white shadow-sm shadow-gold-500/40">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-4">
              {/* Dashboard Link */}
              <Link
                to={getDashboardLink()}
                className="flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-slate-500 hover:text-gold-500 transition-colors duration-300"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{getDashboardLabel()}</span>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 border border-slate-100 hover:border-gold-300 rounded-full transition-colors duration-300 group"
                >
                  <div className="w-8 h-8 bg-slate-50 group-hover:bg-gold-50 rounded-full flex items-center justify-center transition-colors">
                    <User className="h-4 w-4 text-slate-400 group-hover:text-gold-500" />
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white p-2">
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center space-x-3 px-4 py-3 text-xs font-semibold tracking-wider text-slate-600 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-colors uppercase"
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
                      className="flex items-center space-x-3 w-full px-4 py-3 text-xs font-semibold tracking-wider text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors uppercase"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold tracking-widest uppercase text-white bg-slate-900 hover:bg-gold-500 rounded-xl transition-all duration-500 shadow-md shadow-slate-900/10 hover:shadow-gold-500/30"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4">
          <div className="mb-3">
            <SearchBar />
          </div>
          <nav className="flex flex-col space-y-1">
            <Link
              to="/products"
              className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/research"
              className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Research
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <div className="border-t border-slate-200 my-2" />
                <Link
                  to={getDashboardLink()}
                  className="px-3 py-2 text-slate-900 bg-slate-100 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {getDashboardLabel()}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="mt-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
