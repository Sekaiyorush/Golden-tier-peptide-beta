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
    <div className="min-h-screen bg-transparent py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none -z-10" />
      <div className="container px-6 md:px-12 max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight mb-3">My Account</h1>
          <p className="text-slate-500 font-light text-lg">Welcome back, {user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-10">
          {[
            { id: 'overview', label: 'Overview', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-md shadow-gold-500/20'
                : 'bg-white/60 backdrop-blur-md text-slate-600 border border-transparent hover:border-gold-200 hover:bg-gold-50/50 hover:text-gold-700'
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
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Total Orders</p>
                    <p className="text-3xl font-serif text-slate-900">{userProfile.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-white border border-gold-200 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-gold-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Total Spent</p>
                    <p className="text-3xl font-serif text-slate-900">${userProfile.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Member Since</p>
                    <p className="text-2xl font-serif text-slate-900">{new Date(userProfile.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-gold-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-gold-100/50 flex items-center justify-between">
                <h3 className="font-serif text-xl tracking-tight text-slate-900">Recent Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-sm font-medium text-slate-500 hover:text-gold-600 flex items-center transition-colors"
                >
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="divide-y divide-gold-100/30">
                {userOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-gold-50/30 transition-colors gap-4">
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-white border border-gold-100/50 shadow-sm rounded-xl flex items-center justify-center shrink-0">
                        <Box className="h-5 w-5 text-gold-500" />
                      </div>
                      <div>
                        <p className="font-bold tracking-widest text-slate-900 uppercase text-xs mb-1">{order.id}</p>
                        <p className="text-sm font-light text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-6 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gold-100/30">
                      <div className="text-left md:text-right">
                        <p className="font-serif text-xl text-slate-900 mb-1">${order.total.toFixed(2)}</p>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        className="p-3 text-gold-600/70 hover:text-gold-600 hover:bg-gold-50 border border-transparent hover:border-gold-100 rounded-xl transition-all"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {userOrders.length === 0 && (
                  <div className="p-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-gold-200 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4 font-light text-lg">No orders yet.</p>
                    <Link to="/products" className="text-gold-600 font-bold tracking-widest uppercase hover:text-gold-700 transition-colors text-sm">Start shopping</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-gold-100/50">
              <h3 className="font-serif text-2xl tracking-tight text-slate-900">Order History</h3>
            </div>
            <div className="divide-y divide-gold-100/30">
              {userOrders.map((order) => (
                <div key={order.id} className="p-6 md:p-8">
                  <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                    <div>
                      <p className="font-bold tracking-widest text-slate-900 uppercase text-xs mb-1">{order.id}</p>
                      <p className="text-sm font-light text-slate-500">{order.createdAt}</p>
                    </div>
                    <span className={`inline-flex items-center space-x-1 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </div>
                  <div className="space-y-3 bg-white/50 rounded-2xl p-5 border border-gold-100/50">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-light">{item.quantity}x <span className="font-medium text-slate-900">{item.name}</span></span>
                        <span className="text-slate-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedOrderId(order.id)}
                      className="text-sm text-gold-600 font-bold tracking-wide uppercase hover:text-gold-700 flex items-center group"
                    >
                      <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> View Details & Tracking
                    </button>
                    <span className="font-serif text-xl text-slate-900">Total: ${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {userOrders.length === 0 && (
                <div className="p-16 text-center">
                  <ShoppingBag className="h-16 w-16 text-gold-200 mx-auto mb-6" />
                  <p className="text-slate-500 mb-4 font-light text-lg">No orders yet.</p>
                  <Link to="/products" className="text-gold-600 font-bold tracking-widest uppercase hover:text-gold-700 transition-colors text-sm">Browse products</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-gold-100/50 flex flex-wrap gap-4 items-center justify-between">
              <h3 className="font-serif text-2xl tracking-tight text-slate-900">Profile Information</h3>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-sm font-bold tracking-widest uppercase text-gold-600 hover:text-gold-700 bg-white/50 px-4 py-2 border border-gold-200 rounded-lg hover:bg-gold-50 shadow-sm transition-all"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      // Reset form
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
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="text-sm font-bold tracking-widest uppercase text-white bg-gradient-to-r from-gold-500 to-gold-600 shadow-md shadow-gold-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all px-6 py-2.5 rounded-xl disabled:opacity-50"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    readOnly={!isEditingProfile}
                    className={`w-full px-4 py-3 rounded-xl transition-all ${isEditingProfile ? 'bg-white border border-gold-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-sm' : 'bg-slate-50/50 border border-transparent text-slate-600'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Email (Cannot be changed)</label>
                  <input
                    type="email"
                    value={userProfile.email}
                    readOnly
                    className="w-full px-4 py-3 border border-transparent rounded-xl bg-slate-50/50 text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    readOnly={!isEditingProfile}
                    className={`w-full px-4 py-3 rounded-xl transition-all ${isEditingProfile ? 'bg-white border border-gold-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-sm' : 'bg-slate-50/50 border border-transparent text-slate-600'}`}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="border-t border-gold-100/50 pt-8">
                <h4 className="font-serif text-xl tracking-tight text-slate-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gold-500" />
                  Shipping Address
                </h4>

                {isEditingProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">State / Province</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">ZIP / Postal Code</label>
                      <input
                        type="text"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gold-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-white/50 rounded-2xl border border-gold-100/50 shadow-sm">
                    {userProfile.address?.street ? (
                      <address className="not-italic text-slate-600 font-light leading-relaxed text-lg">
                        {userProfile.address.street}<br />
                        {userProfile.address.city}, {userProfile.address.state} {userProfile.address.zip}<br />
                        {userProfile.address.country}
                      </address>
                    ) : (
                      <p className="text-slate-500 text-sm font-light">No address saved yet. Click 'Edit Profile' to add one.</p>
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
