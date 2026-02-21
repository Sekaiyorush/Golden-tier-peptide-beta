import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '@/context/DatabaseContext';
import { supabase } from '@/lib/supabase';
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Package,
  Users,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'order' | 'user' | 'inventory' | 'partner';
  message: string;
  timestamp: string;
  read: boolean;
}

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  newCustomers: number;
  customersChange: number;
  lowStockCount: number;
}

export function DashboardAnalytics() {
  const { db } = useDatabase();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    newCustomers: 0,
    customersChange: 0,
    lowStockCount: 0
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate stats from real data
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Current month orders
    const currentMonthOrders = db.orders.filter(o => 
      new Date(o.createdAt) >= thirtyDaysAgo
    );
    const previousMonthOrders = db.orders.filter(o => 
      new Date(o.createdAt) >= sixtyDaysAgo && new Date(o.createdAt) < thirtyDaysAgo
    );

    // Revenue
    const currentRevenue = currentMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const previousRevenue = previousMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    // Orders change
    const ordersChange = previousMonthOrders.length > 0
      ? ((currentMonthOrders.length - previousMonthOrders.length) / previousMonthOrders.length) * 100
      : 0;

    // New customers
    const currentCustomers = db.customers.filter(c => 
      new Date(c.joinedAt) >= thirtyDaysAgo
    ).length;
    const previousCustomers = db.customers.filter(c => 
      new Date(c.joinedAt) >= sixtyDaysAgo && new Date(c.joinedAt) < thirtyDaysAgo
    ).length;
    const customersChange = previousCustomers > 0
      ? ((currentCustomers - previousCustomers) / previousCustomers) * 100
      : 0;

    // Low stock
    const lowStockCount = db.products.filter(p => 
      p.stockQuantity < (p.lowStockThreshold || 10)
    ).length;

    setStats({
      totalRevenue: currentRevenue,
      revenueChange,
      totalOrders: currentMonthOrders.length,
      ordersChange,
      newCustomers: currentCustomers,
      customersChange,
      lowStockCount
    });
  }, [db.orders, db.customers, db.products]);

  // Generate activity feed
  useEffect(() => {
    const newActivities: Activity[] = [];
    
    // Recent orders
    db.orders.slice(0, 5).forEach(order => {
      newActivities.push({
        id: `order-${order.id}`,
        type: 'order',
        message: `New order #${order.id} for $${order.total.toFixed(2)}`,
        timestamp: order.createdAt,
        read: false
      });
    });

    // Low stock alerts
    db.products
      .filter(p => p.stockQuantity < (p.lowStockThreshold || 10))
      .slice(0, 3)
      .forEach(product => {
        newActivities.push({
          id: `stock-${product.id}`,
          type: 'inventory',
          message: `Low stock alert: ${product.name} (${product.stockQuantity} units left)`,
          timestamp: new Date().toISOString(),
          read: false
        });
      });

    // Sort by timestamp
    newActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setActivities(newActivities.slice(0, 10));
    setUnreadCount(newActivities.filter(a => !a.read).length);
  }, [db.orders, db.products]);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        // Refresh activities when new order comes in
        if (payload.eventType === 'INSERT') {
          const newOrder = payload.new as any;
          const newActivity: Activity = {
            id: `order-${newOrder.id}`,
            type: 'order',
            message: `New order #${newOrder.id} for $${Number(newOrder.total).toFixed(2)}`,
            timestamp: newOrder.created_at,
            read: false
          };
          setActivities(prev => [newActivity, ...prev].slice(0, 10));
          setUnreadCount(c => c + 1);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case 'inventory': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'partner': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header with notifications */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500">Real-time business insights</p>
        </div>
        <button className="relative p-2 text-slate-600 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-colors">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium tracking-wide uppercase text-slate-500 mb-1">30-Day Revenue</p>
              <p className="text-3xl font-serif text-slate-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className={`flex items-center text-sm ${stats.revenueChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {stats.revenueChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span className="font-medium">{Math.abs(stats.revenueChange).toFixed(1)}%</span>
            <span className="text-slate-400 ml-1">vs last month</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium tracking-wide uppercase text-slate-500 mb-1">Orders</p>
              <p className="text-3xl font-serif text-slate-900">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className={`flex items-center text-sm ${stats.ordersChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {stats.ordersChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span className="font-medium">{Math.abs(stats.ordersChange).toFixed(1)}%</span>
            <span className="text-slate-400 ml-1">vs last month</span>
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-gold-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium tracking-wide uppercase text-slate-500 mb-1">New Customers</p>
              <p className="text-3xl font-serif text-slate-900">{stats.newCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className={`flex items-center text-sm ${stats.customersChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {stats.customersChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            <span className="font-medium">{Math.abs(stats.customersChange).toFixed(1)}%</span>
            <span className="text-slate-400 ml-1">vs last month</span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className={`p-6 rounded-[2rem] border shadow-[0_4px_20px_rgb(0,0,0,0.03)] ${stats.lowStockCount > 0 ? 'bg-amber-50/60 border-amber-200/50' : 'bg-white/60 border-gold-200/50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium tracking-wide uppercase text-slate-500 mb-1">Low Stock Alerts</p>
              <p className={`text-3xl font-serif ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{stats.lowStockCount}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${stats.lowStockCount > 0 ? 'bg-amber-500 shadow-amber-500/20' : 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-gold-500/20'}`}>
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-slate-500">
            {stats.lowStockCount > 0 ? 'Products need attention' : 'All stock levels healthy'}
          </p>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl tracking-tight text-slate-900">Recent Activity</h3>
            <Link to="/admin/orders" className="text-sm text-slate-600 hover:text-slate-900">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {activities.length > 0 ? activities.map((activity) => (
              <div key={activity.id} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${activity.read ? 'bg-slate-50' : 'bg-gold-50/50 border border-gold-100/50'}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.read ? 'bg-white' : 'bg-white shadow-sm'}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{activity.message}</p>
                    <p className="text-sm text-slate-500">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
                {!activity.read && (
                  <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                )}
              </div>
            )) : (
              <p className="text-slate-500 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <h3 className="font-serif text-xl tracking-tight text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/admin/products/new" className="flex items-center space-x-3 p-4 bg-slate-50 hover:bg-gold-50 rounded-xl transition-colors group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                <Package className="h-5 w-5 text-gold-600" />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-slate-900">Add New Product</span>
            </Link>
            <Link to="/admin/orders" className="flex items-center space-x-3 p-4 bg-slate-50 hover:bg-gold-50 rounded-xl transition-colors group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-slate-900">View Orders</span>
            </Link>
            <Link to="/admin/invitation-codes" className="flex items-center space-x-3 p-4 bg-slate-50 hover:bg-gold-50 rounded-xl transition-colors group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-slate-900">Generate Invite Code</span>
            </Link>
            {stats.lowStockCount > 0 && (
              <Link to="/admin/inventory" className="flex items-center space-x-3 p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors group border border-amber-200">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <span className="font-medium text-amber-700">Restock Inventory ({stats.lowStockCount})</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
