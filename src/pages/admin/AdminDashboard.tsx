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

import { useDatabase } from '@/context/DatabaseContext';

function DashboardHome() {
  const { db } = useDatabase();

  const stats = [
    { label: 'Total Products', value: db.products.length.toString(), change: '+0', icon: Package, color: 'bg-gradient-to-br from-gold-400 to-gold-600' },
    { label: 'Total Orders', value: db.orders.length.toString(), change: '+0', icon: ShoppingCart, color: 'bg-gradient-to-br from-gold-400 to-gold-600' },
    { label: 'Active Partners', value: db.partners.length.toString(), change: '+0', icon: Users, color: 'bg-gradient-to-br from-gold-400 to-gold-600' },
    { label: 'Customers', value: db.customers.length.toString(), change: '+0', icon: UserCircle, color: 'bg-gradient-to-br from-gold-400 to-gold-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] selection:bg-gold-200/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium tracking-wide uppercase text-slate-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-serif text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg shadow-gold-500/20`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl tracking-tight text-slate-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-slate-600 hover:text-slate-900">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {db.orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{order.id}</p>
                  <p className="text-sm text-slate-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">${order.total}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl tracking-tight text-slate-900">Low Stock Alerts</h3>
            <Link to="/admin/products" className="text-sm text-slate-600 hover:text-slate-900">
              Manage →
            </Link>
          </div>
          <div className="space-y-3">
            {db.products.filter(p => p.stockQuantity < (p.lowStockThreshold || 10)).slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">Threshold: {item.lowStockThreshold || 10}</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-semibold ${item.stockQuantity < 5 ? 'text-red-500' : 'text-amber-500'
                    }`}>
                    {item.stockQuantity}
                  </span>
                  <p className="text-xs text-slate-400">units left</p>
                </div>
              </div>
            ))}
            {db.products.filter(p => p.stockQuantity < (p.lowStockThreshold || 10)).length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">All products are well stocked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
            <Route path="/" element={<DashboardHome />} />
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
