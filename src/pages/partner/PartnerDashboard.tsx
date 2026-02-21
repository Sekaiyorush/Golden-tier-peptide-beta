import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/context/DatabaseContext';
import { PartnerNetwork } from './PartnerNetwork';
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  Box,
  CreditCard,
  Landmark,
  ArrowUpRight,
  UserPlus,
  Eye,
  Percent
} from 'lucide-react';
import { OrderDetailsModal } from '@/components/OrderDetailsModal';

export function PartnerDashboard() {
  const { user } = useAuth();
  const { db } = useDatabase();
  const { orders, partners, products } = db;
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'network' | 'shop' | 'payouts'>('overview');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank');

  // Get partner details
  const partnerDetails = partners.find(p => p.id === user?.partnerId);

  // Get partner's orders
  const partnerOrders = orders.filter(o => o.partnerId === user?.partnerId);

  // Get referred partners (downline)
  const referredPartners = partners.filter(p => p.referredBy === user?.partnerId);

  // Get partner's referrer (upline)
  const referrer = partnerDetails?.referredBy
    ? partners.find(p => p.id === partnerDetails.referredBy)
    : null;

  // Calculate stats
  const totalPurchases = partnerOrders.reduce((sum, o) => sum + o.total, 0);
  const estimatedProfit = partnerDetails?.totalResold
    ? partnerDetails.totalResold - totalPurchases
    : 0;

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

  // Calculate discounted price
  const getDiscountedPrice = (price: number) => {
    if (user?.discountRate) {
      return price * (1 - user.discountRate / 100);
    }
    return price;
  };

  return (
    <div className="min-h-screen bg-transparent py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none -z-10" />
      <div className="container px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Partner Dashboard</h1>
            <span className="px-5 py-2 bg-gradient-to-r from-gold-400 to-gold-600 text-white rounded-full text-sm font-semibold tracking-wide shadow-md w-fit mx-auto md:mx-0">
              {user?.discountRate}% Advantage
            </span>
          </div>
          <p className="text-slate-500 font-light text-lg">Welcome back, {user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-10">
          {[
            { id: 'overview', label: 'Overview', icon: Package },
            { id: 'shop', label: 'Partner Shop', icon: ShoppingBag },
            { id: 'orders', label: 'Orders', icon: Box },
            { id: 'network', label: 'My Network', icon: Users },
            { id: 'payouts', label: 'Payouts', icon: Landmark },
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Discount Rate</p>
                    <p className="text-3xl font-serif text-slate-900">{user?.discountRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
                    <Percent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Total Purchases</p>
                    <p className="text-3xl font-serif text-slate-900">${totalPurchases.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-white border border-gold-200 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-gold-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Est. Profit</p>
                    <p className="text-3xl font-serif text-emerald-600">${estimatedProfit.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Network Size</p>
                    <p className="text-3xl font-serif text-slate-900">{referredPartners.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-gold-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gold-100/50 flex items-center justify-between">
                  <h3 className="font-serif text-xl tracking-tight text-slate-900">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm font-medium text-slate-500 hover:text-gold-600 flex items-center transition-colors"
                  >
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {partnerOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Box className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{order.id}</p>
                          <p className="text-sm text-slate-500">{order.createdAt}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-slate-900">${order.total.toFixed(2)}</p>
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {partnerOrders.length === 0 && (
                    <div className="p-6 text-center text-slate-500">
                      No orders yet. <button onClick={() => setActiveTab('shop')} className="text-slate-900 underline">Start shopping</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Network Preview */}
              <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gold-100/50 flex items-center justify-between">
                  <h3 className="font-serif text-xl tracking-tight text-slate-900">My Network</h3>
                  <button
                    onClick={() => setActiveTab('network')}
                    className="text-sm font-medium text-slate-500 hover:text-gold-600 flex items-center transition-colors"
                  >
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <div className="p-6">
                  {referrer && (
                    <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">My Referrer</p>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">{referrer.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{referrer.name}</p>
                          <p className="text-sm text-slate-500">{referrer.company}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">My Referrals ({referredPartners.length})</p>
                    {referredPartners.length > 0 ? (
                      <div className="space-y-3">
                        {referredPartners.slice(0, 3).map((p) => (
                          <div key={p.id} className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                              <span className="text-slate-600 font-medium">{p.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{p.name}</p>
                              <p className="text-sm text-slate-500">{p.company}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                              p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                              {p.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <UserPlus className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No referrals yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Partner Shop Tab */}
        {activeTab === 'shop' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
              <div className="flex items-center space-x-4 relative z-10 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <Percent className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-lg font-serif tracking-wide">Your Exclusive Advantage: <span className="font-bold">{user?.discountRate}%</span></span>
              </div>
              <Link
                to="/products"
                className="bg-white text-gold-600 hover:bg-gold-50 px-6 py-3 rounded-xl text-sm font-bold tracking-widest uppercase flex items-center transition-all shadow-md relative z-10"
              >
                Browse Catalog <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                  <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center p-6 overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl shadow-inner" />
                    ) : (
                      <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center shadow-inner">
                        <span className="text-slate-600 font-semibold">{product.name.split('-')[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900">{product.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{product.description}</p>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-sm text-slate-400 line-through">${product.price.toFixed(2)}</p>
                        <p className="text-xl font-semibold text-indigo-600">${getDiscountedPrice(product.price).toFixed(2)}</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                        Save ${(product.price - getDiscountedPrice(product.price)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
              {partnerOrders.map((order) => (
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
                      <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> View Tracking
                    </button>
                    <span className="font-serif text-xl text-slate-900">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {partnerOrders.length === 0 && (
                <div className="p-16 text-center">
                  <ShoppingBag className="h-16 w-16 text-gold-200 mx-auto mb-6" />
                  <p className="text-slate-500 mb-4 font-light text-lg">No acquisitions recorded yet.</p>
                  <button onClick={() => setActiveTab('shop')} className="text-gold-600 font-bold tracking-widest uppercase hover:text-gold-700 transition-colors text-sm">Access Partner Shop</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <PartnerNetwork />
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Balances */}
              <div className="col-span-1 md:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-6">Earnings Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Available to Withdraw</p>
                    <p className="text-3xl font-bold text-slate-900">${estimatedProfit.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Total Lifetime Earnings</p>
                    <p className="text-xl font-semibold text-slate-700">${estimatedProfit.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Request form */}
              <div className="col-span-1 bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Request Payout</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (Number(payoutAmount) > estimatedProfit) {
                      alert('You cannot withdraw more than your available balance.');
                    } else if (Number(payoutAmount) < 50) {
                      alert('Minimum withdrawal amount is $50.00');
                    } else {
                      alert('Payout request submitted successfully. Processing takes 2-3 business days.');
                      setPayoutAmount('');
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount ($)</label>
                    <input
                      type="number"
                      min="50"
                      step="0.01"
                      required
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-slate-400"
                      placeholder="Min $50.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Payout Method</label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                    >
                      <option value="bank">Bank Transfer (ACH)</option>
                      <option value="crypto">Cryptocurrency (USDC/USDT)</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Submit Request
                  </button>
                  <p className="text-xs text-slate-500 text-center">Minimum withdrawal: $50.00</p>
                </form>
              </div>
            </div>

            {/* Payout History */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Payout History</h3>
              </div>
              <div className="p-8 text-center">
                <CreditCard className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No payout history available yet.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrderId && (
        <OrderDetailsModal
          order={partnerOrders.find(o => o.id === selectedOrderId)!}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
