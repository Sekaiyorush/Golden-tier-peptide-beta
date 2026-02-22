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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar — Clean */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200">
            <Link to="/" className="flex items-center gap-3">
              <img src="/brand-logo-gold.png" alt="Logo" className="h-12 w-auto" />
              <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${location.pathname === item.path
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-3 p-3 bg-slate-100 rounded-lg mb-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
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
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">Dashboard</h1>
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            View Site
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
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
