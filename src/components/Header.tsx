import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { SearchBar } from './SearchBar';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { toggleCart, cartCount } = useCart();
  const { language, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, isAdmin, isPartner, logout } = useAuth();

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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">GT</span>
          </div>
          <span className="text-lg font-semibold text-slate-900">
            Golden Tier
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/products" className="text-slate-600 hover:text-slate-900 transition-colors">
            Products
          </Link>
          <Link to="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
            About
          </Link>
          <Link to="/research" className="text-slate-600 hover:text-slate-900 transition-colors">
            Research
          </Link>
          <Link to="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex flex-1 max-w-xs mx-6">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleLanguage}
            className="text-sm text-slate-600 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            {language.toUpperCase()}
          </button>

          <button
            onClick={toggleCart}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-medium text-white">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-2">
              {/* Dashboard Link */}
              <Link
                to={getDashboardLink()}
                className="flex items-center space-x-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{getDashboardLabel()}</span>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
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
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
              className="hidden md:inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
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
