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
  BarChart3
} from 'lucide-react';

// Admin sub-pages
import { ProductsManagement } from './ProductsManagement';
import { PartnersManagement } from './PartnersManagement';
import { PartnerNetwork } from './PartnerNetwork';
import { QRCodeManager } from './QRCodeManager';
import { OrdersManagement } from './OrdersManagement';
import { CustomersManagement } from './CustomersManagement';
import { InvitationCodeManagement } from './InvitationCodeManagement';
import { PartnerAnalytics } from './PartnerAnalytics';

function DashboardHome() {
  const stats = [
    { label: 'Total Products', value: '24', change: '+3', icon: Package, color: 'bg-blue-500' },
    { label: 'Total Orders', value: '156', change: '+12', icon: ShoppingCart, color: 'bg-emerald-500' },
    { label: 'Active Partners', value: '8', change: '+2', icon: Users, color: 'bg-indigo-500' },
    { label: 'Customers', value: '124', change: '+8', icon: UserCircle, color: 'bg-amber-500' },
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
          <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-emerald-600 mt-1">{stat.change} this month</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-slate-600 hover:text-slate-900">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { id: '#ORD-001', customer: 'John Doe', amount: '$149.97', status: 'completed' },
              { id: '#ORD-002', customer: 'Jane Smith', amount: '$299.94', status: 'processing' },
              { id: '#ORD-003', customer: 'Bob Johnson', amount: '$89.99', status: 'pending' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{order.id}</p>
                  <p className="text-sm text-slate-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{order.amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
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
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Low Stock Alerts</h3>
            <Link to="/admin/products" className="text-sm text-slate-600 hover:text-slate-900">
              Manage →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Melanotan II', stock: 15, threshold: 20 },
              { name: 'GHRP-6', stock: 8, threshold: 25 },
              { name: 'TB-500', stock: 12, threshold: 30 },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">Threshold: {item.threshold}</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-semibold ${
                    item.stock < 10 ? 'text-red-500' : 'text-amber-500'
                  }`}>
                    {item.stock}
                  </span>
                  <p className="text-xs text-slate-400">units left</p>
                </div>
              </div>
            ))}
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
    { path: '/admin/customers', label: 'Customers', icon: UserCircle },
    { path: '/admin/partners', label: 'Partners', icon: Users },
    { path: '/admin/partner-network', label: 'Partner Network', icon: Network },
    { path: '/admin/partner-analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/invitation-codes', label: 'Invitation Codes', icon: LinkIcon },
    { path: '/admin/qr-codes', label: 'QR Codes', icon: QrCode },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-5 border-b border-slate-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GT</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-slate-900">Golden Tier</span>
                <span className="block text-xs text-slate-500">Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-3 border-t border-slate-200">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg mb-2">
              <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center">
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
          <Link 
            to="/" 
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            View Site
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/customers" element={<CustomersManagement />} />
            <Route path="/partners" element={<PartnersManagement />} />
            <Route path="/partner-network" element={<PartnerNetwork />} />
            <Route path="/partner-analytics" element={<PartnerAnalytics />} />
            <Route path="/invitation-codes" element={<InvitationCodeManagement />} />
            <Route path="/qr-codes" element={<QRCodeManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
