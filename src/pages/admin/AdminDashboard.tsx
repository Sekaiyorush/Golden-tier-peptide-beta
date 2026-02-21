import { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Users,
  QrCode,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  UserCircle,
  Network,
  Link as LinkIcon,
  BarChart3,
  Settings
} from 'lucide-react';

// Admin sub-pages
import { ProductsManagement } from './ProductsManagement';
import { PartnersManagement } from './PartnersManagement';
import { PartnerNetwork } from './PartnerNetwork';
import { QRCodeManager } from './QRCodeManager';
import { OrdersManagement } from './OrdersManagement';
import { CustomersManagement } from './CustomersManagement';
import { InventoryManagement } from './InventoryManagement';
import { InvitationCodeManagement } from './InvitationCodeManagement';
import { PartnerAnalytics } from './PartnerAnalytics';
import { SettingsManagement } from './SettingsManagement';
import { DashboardAnalytics } from '@/components/admin/DashboardAnalytics';

export function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/inventory', label: 'Inventory', icon: Package },
    { path: '/admin/customers', label: 'Customers', icon: UserCircle },
    { path: '/admin/partners', label: 'Partners', icon: Users },
    { path: '/admin/partner-network', label: 'Partner Network', icon: Network },
    { path: '/admin/partner-analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/invitation-codes', label: 'Invitation Codes', icon: LinkIcon },
    { path: '/admin/qr-codes', label: 'QR Codes', icon: QrCode },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-transparent flex relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none -z-10" />
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-gold-200/50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gold-100/50">
            <Link to="/" className="flex items-center flex-col items-start gap-2 group">
              <img src="/brand-logo-gold.png" alt="Golden Tier Logo" className="h-20 w-auto object-contain drop-shadow-sm group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] transition-all duration-300" />
              <span className="block text-[10px] uppercase tracking-widest text-gold-600 font-semibold mt-2">Admin Portal</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.path
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-gold-50/50 hover:text-gold-700'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gold-100/50">
            <div className="flex items-center space-x-3 p-3 bg-white/50 border border-gold-100/50 rounded-2xl mb-3 shadow-sm">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Header */}
        <header className="bg-white/60 backdrop-blur-xl border-b border-gold-200/50 p-4 lg:p-6 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gold-50/50 hover:text-gold-600 rounded-xl transition-colors"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <h1 className="text-xl font-serif text-slate-900 tracking-tight hidden sm:block">Command Center</h1>
          <Link
            to="/"
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-gold-300 hover:bg-gold-50 hover:text-gold-700 rounded-full transition-all duration-300 shadow-sm"
          >
            View Live Site
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gold-200/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-300/50">
          <Routes>
            <Route path="/" element={<DashboardAnalytics />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/customers" element={<CustomersManagement />} />
            <Route path="/partners" element={<PartnersManagement />} />
            <Route path="/partner-network" element={<PartnerNetwork />} />
            <Route path="/partner-analytics" element={<PartnerAnalytics />} />
            <Route path="/invitation-codes" element={<InvitationCodeManagement />} />
            <Route path="/qr-codes" element={<QRCodeManager />} />
            <Route path="/settings" element={<SettingsManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
