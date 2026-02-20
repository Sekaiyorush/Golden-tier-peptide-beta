import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { orders, customers } from '@/data/products';
import { 
  Package, 
  ShoppingBag, 
  User, 
  MapPin, 
  CreditCard,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  Box
} from 'lucide-react';

export function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile'>('overview');

  // Get user's orders
  const userOrders = orders.filter(o => o.customerId === user?.id || o.customerId.startsWith('c'));
  
  // Get user profile
  const userProfile = customers.find(c => c.email === user?.email) || {
    name: user?.name,
    email: user?.email,
    totalOrders: userOrders.length,
    totalSpent: userOrders.reduce((sum, o) => sum + o.total, 0),
    joinedAt: '2024-01-01',
    status: 'active'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-amber-500" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">My Account</h1>
          <p className="text-slate-500">Welcome back, {user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 mb-6 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Orders</p>
                    <p className="text-2xl font-semibold text-slate-900">{userProfile.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Spent</p>
                    <p className="text-2xl font-semibold text-slate-900">${userProfile.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Member Since</p>
                    <p className="text-2xl font-semibold text-slate-900">{userProfile.joinedAt}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Recent Orders</h3>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-sm text-slate-600 hover:text-slate-900 flex items-center"
                >
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {userOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Box className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{order.id}</p>
                        <p className="text-sm text-slate-500">{order.createdAt}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">${order.total.toFixed(2)}</p>
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
                {userOrders.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                    No orders yet. <Link to="/products" className="text-slate-900 underline">Start shopping</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Order History</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {userOrders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-slate-900">{order.id}</p>
                      <p className="text-sm text-slate-500">{order.createdAt}</p>
                    </div>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{item.quantity}x {item.name}</span>
                        <span className="text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm text-slate-500">Total</span>
                    <span className="font-semibold text-slate-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {userOrders.length === 0 && (
                <div className="p-12 text-center">
                  <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-2">No orders yet</p>
                  <Link to="/products" className="text-slate-900 underline">Browse products</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Profile Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user?.name}
                    readOnly
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    readOnly
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                  />
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-medium text-slate-900 mb-4 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Shipping Address
                </h4>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-slate-600">No address saved yet.</p>
                  <button className="mt-2 text-sm text-slate-900 underline">Add address</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
