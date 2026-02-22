import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/context/DatabaseContext';
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
  Box,
  Eye
} from 'lucide-react';
import { OrderDetailsModal } from '@/components/OrderDetailsModal';

export function UserDashboard() {
  const { user } = useAuth();
  const { db, updateCustomer } = useDatabase();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile'>('overview');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get user's orders
  const userOrders = db.orders.filter(o => o.customerId === user?.id);

  // Get user profile
  const userProfile = db.customers.find(c => c.email === user?.email) || {
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: undefined,
    totalOrders: userOrders.length,
    totalSpent: userOrders.reduce((sum, o) => sum + o.total, 0),
    joinedAt: '2024-01-01',
    status: 'active'
  };

  const [formData, setFormData] = useState({
    name: userProfile.name,
    phone: userProfile.phone || '',
    street: userProfile.address?.street || '',
    city: userProfile.address?.city || '',
    state: userProfile.address?.state || '',
    zip: userProfile.address?.zip || '',
    country: userProfile.address?.country || '',
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateCustomer(userProfile.id, {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        }
      });
      setIsEditingProfile(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
      <div className="container px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">My Account</h1>
          <p className="text-slate-500">Welcome back, {user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats — Clean */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
                    <p className="text-2xl font-semibold text-slate-900">{userProfile.totalOrders}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Spent</p>
                    <p className="text-2xl font-semibold text-slate-900">${userProfile.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Member Since</p>
                    <p className="text-lg font-semibold text-slate-900">{new Date(userProfile.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders — Clean */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-sm text-slate-600 hover:text-slate-900 flex items-center"
                >
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {userOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Box className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{order.id}</p>
                        <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-4 justify-between md:justify-end">
                      <div className="text-left md:text-right">
                        <p className="font-semibold text-slate-900">${order.total.toFixed(2)}</p>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize ml-1">{order.status}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {userOrders.length === 0 && (
                  <div className="p-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">No orders yet.</p>
                    <Link to="/products" className="text-slate-900 font-medium hover:underline">Start shopping</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab — Clean */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Order History</h3>
            </div>
            <div className="divide-y divide-slate-200">
              {userOrders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-slate-900">{order.id}</p>
                      <p className="text-sm text-slate-500">{order.createdAt}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </div>
                  <div className="space-y-2 bg-slate-50 rounded-lg p-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{item.quantity}x <span className="font-medium text-slate-900">{item.name}</span></span>
                        <span className="text-slate-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedOrderId(order.id)}
                      className="text-sm text-slate-600 hover:text-slate-900 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2" /> View Details
                    </button>
                    <span className="font-semibold text-slate-900">Total: ${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {userOrders.length === 0 && (
                <div className="p-16 text-center">
                  <ShoppingBag className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-500 mb-4">No orders yet.</p>
                  <Link to="/products" className="text-slate-900 font-medium hover:underline">Browse products</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab — Clean */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      setFormData({
                        name: userProfile.name,
                        phone: userProfile.phone || '',
                        street: userProfile.address?.street || '',
                        city: userProfile.address?.city || '',
                        state: userProfile.address?.state || '',
                        zip: userProfile.address?.zip || '',
                        country: userProfile.address?.country || '',
                      });
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    readOnly={!isEditingProfile}
                    className={`w-full px-4 py-2.5 rounded-lg transition-all ${isEditingProfile ? 'bg-white border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900' : 'bg-slate-100 text-slate-600'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Email</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-100 text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    readOnly={!isEditingProfile}
                    className={`w-full px-4 py-2.5 rounded-lg transition-all ${isEditingProfile ? 'bg-white border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900' : 'bg-slate-100 text-slate-600'}`}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h4 className="text-base font-semibold text-slate-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-slate-500" />
                  Shipping Address
                </h4>

                {isEditingProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-500 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-2">State / Province</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-2">ZIP / Postal Code</label>
                      <input
                        type="text"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    {userProfile.address?.street ? (
                      <address className="not-italic text-slate-600 leading-relaxed">
                        {userProfile.address.street}<br />
                        {userProfile.address.city}, {userProfile.address.state} {userProfile.address.zip}<br />
                        {userProfile.address.country}
                      </address>
                    ) : (
                      <p className="text-slate-500 text-sm">No address saved yet. Click 'Edit Profile' to add one.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrderId && (
        <OrderDetailsModal
          order={userOrders.find(o => o.id === selectedOrderId)!}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
