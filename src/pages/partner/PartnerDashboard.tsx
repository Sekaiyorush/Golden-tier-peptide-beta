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
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Partner Dashboard</h1>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              {user?.discountRate}% Discount
            </span>
          </div>
          <p className="text-slate-500">Welcome back, {user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-slate-200 mb-6 w-fit">
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Discount Rate</p>
                    <p className="text-2xl font-semibold text-indigo-600">{user?.discountRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Percent className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Purchases</p>
                    <p className="text-2xl font-semibold text-slate-900">${totalPurchases.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Est. Profit</p>
                    <p className="text-2xl font-semibold text-emerald-600">${estimatedProfit.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Network Size</p>
                    <p className="text-2xl font-semibold text-slate-900">{referredPartners.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-slate-600 hover:text-slate-900 flex items-center"
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
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">My Network</h3>
                  <button
                    onClick={() => setActiveTab('network')}
                    className="text-sm text-slate-600 hover:text-slate-900 flex items-center"
                  >
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <div className="p-5">
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
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Percent className="h-5 w-5 text-indigo-600" />
                <span className="text-indigo-900 font-medium">Your Partner Discount: {user?.discountRate}% off all products</span>
              </div>
              <Link
                to="/products"
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
              >
                Browse Catalog <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Order History</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {partnerOrders.map((order) => (
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
                    <button
                      onClick={() => setSelectedOrderId(order.id)}
                      className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1.5" /> View Details & Tracking
                    </button>
                    <span className="font-semibold text-slate-900">Total (with discount): ${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {partnerOrders.length === 0 && (
                <div className="p-12 text-center">
                  <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-2">No orders yet</p>
                  <button onClick={() => setActiveTab('shop')} className="text-slate-900 underline">Shop with discount</button>
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
