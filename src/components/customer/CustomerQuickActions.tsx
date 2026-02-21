import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/context/DatabaseContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { 
  ShoppingBag, 
  Heart, 
  RotateCcw,
  Bell,
  Package,
  Star,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'shipping' | 'promo' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
}

interface QuickReorderItem {
  productId: string;
  name: string;
  price: number;
  lastOrdered: string;
  timesOrdered: number;
}

export function CustomerQuickActions() {
  const { user } = useAuth();
  const { db } = useDatabase();
  const { addToCart } = useCart();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [quickReorderItems, setQuickReorderItems] = useState<QuickReorderItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const userOrders = db.orders.filter(o => o.customerId === user?.id);
  const userProfile = db.customers.find(c => c.email === user?.email);

  // Generate quick reorder items from order history
  useEffect(() => {
    const productOrders: Record<string, { name: string; price: number; dates: string[] }> = {};
    
    userOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productOrders[item.productId]) {
          productOrders[item.productId] = {
            name: item.name,
            price: item.price,
            dates: []
          };
        }
        productOrders[item.productId].dates.push(order.createdAt);
      });
    });

    const items: QuickReorderItem[] = Object.entries(productOrders)
      .map(([productId, data]) => ({
        productId,
        name: data.name,
        price: data.price,
        lastOrdered: data.dates.sort().reverse()[0],
        timesOrdered: data.dates.length
      }))
      .sort((a, b) => new Date(b.lastOrdered).getTime() - new Date(a.lastOrdered).getTime())
      .slice(0, 5);

    setQuickReorderItems(items);
  }, [userOrders]);

  // Generate notifications
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    // Order updates
    userOrders.slice(0, 3).forEach(order => {
      let message = '';
      switch (order.status) {
        case 'delivered':
          message = `Order #${order.id} has been delivered!`;
          break;
        case 'shipped':
          message = `Order #${order.id} is on its way`;
          break;
        case 'processing':
          message = `Order #${order.id} is being processed`;
          break;
        default:
          message = `Order #${order.id} received`;
      }
      
      newNotifications.push({
        id: `order-${order.id}`,
        type: 'shipping',
        message,
        timestamp: order.createdAt,
        read: order.status === 'delivered'
      });
    });

    // Welcome notification for new users
    if (userProfile?.joinedAt) {
      const joinedDate = new Date(userProfile.joinedAt);
      const daysSinceJoined = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceJoined < 7) {
        newNotifications.push({
          id: 'welcome',
          type: 'promo',
          message: 'Welcome! Use code WELCOME10 for 10% off your first order',
          timestamp: userProfile.joinedAt,
          read: false
        });
      }
    }

    setNotifications(newNotifications.slice(0, 10));
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  }, [userOrders, userProfile]);

  // Load wishlist from localStorage or Supabase
  useEffect(() => {
    const saved = localStorage.getItem(`wishlist-${user?.id}`);
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, [user?.id]);

  // Save wishlist
  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    
    setWishlist(newWishlist);
    localStorage.setItem(`wishlist-${user?.id}`, JSON.stringify(newWishlist));
  };

  // Handle quick reorder
  const handleQuickReorder = (item: QuickReorderItem) => {
    const product = db.products.find(p => p.id === item.productId);
    if (product) {
      addToCart(product);
    }
  };

  // Subscribe to real-time order updates
  useEffect(() => {
    const subscription = supabase
      .channel('customer-updates')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `customer_id=eq.${user?.id}` }, 
        (payload) => {
          const updatedOrder = payload.new as any;
          const newNotification: Notification = {
            id: `update-${updatedOrder.id}`,
            type: 'shipping',
            message: `Order #${updatedOrder.id} status: ${updatedOrder.status}`,
            timestamp: new Date().toISOString(),
            read: false
          };
          setNotifications(prev => [newNotification, ...prev].slice(0, 10));
          setUnreadCount(c => c + 1);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="h-4 w-4 text-emerald-500" />;
      case 'shipping': return <Package className="h-4 w-4 text-blue-500" />;
      case 'promo': return <Star className="h-4 w-4 text-gold-500" />;
      case 'system': return <AlertCircle className="h-4 w-4 text-amber-500" />;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
          <p className="text-slate-500">Reorder favorites and check updates</p>
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

      {/* Quick Reorder Section */}
      {quickReorderItems.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl tracking-tight text-slate-900">Quick Reorder</h3>
            <Link to="/products" className="text-sm text-gold-600 hover:text-gold-700 font-medium">
              Browse Catalog →
            </Link>
          </div>
          
          <div className="space-y-3">
            {quickReorderItems.map((item) => (
              <div 
                key={item.productId} 
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-gold-50/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <RotateCcw className="h-5 w-5 text-gold-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <div className="flex items-center space-x-3 text-sm text-slate-500">
                      <span>${item.price.toFixed(2)}</span>
                      <span>•</span>
                      <span>Ordered {item.timesOrdered} time{item.timesOrdered > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleWishlist(item.productId)}
                    className={`p-2 rounded-xl transition-colors ${wishlist.includes(item.productId) ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <Heart className={`h-5 w-5 ${wishlist.includes(item.productId) && 'fill-current'}`} />
                  </button>
                  
                  <button
                    onClick={() => handleQuickReorder(item)}
                    className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-shadow"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Products (if no order history) */}
      {quickReorderItems.length === 0 && (
        <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-[2rem] p-8 text-center">
          <ShoppingBag className="h-12 w-12 text-white/80 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-white mb-2">Welcome to Golden Tier!</h3>
          <p className="text-white/80 mb-6">Start building your order history for quick reordering</p>
          <Link 
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-white text-gold-600 font-medium rounded-xl hover:shadow-lg transition-shadow"
          >
            Browse Products →
          </Link>
        </div>
      )}

      {/* Recent Notifications */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl tracking-tight text-slate-900">Updates</h3>
          <button className="text-sm text-gold-600 hover:text-gold-700 font-medium">
            Mark all read
          </button>
        </div>
        
        <div className="space-y-3">
          {notifications.length > 0 ? notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex items-center justify-between p-4 rounded-xl transition-colors ${notification.read ? 'bg-slate-50' : 'bg-gold-50/50 border border-gold-100/50'}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notification.read ? 'bg-white' : 'bg-white shadow-sm'}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{notification.message}</p>
                  <p className="text-sm text-slate-500">{formatTimeAgo(notification.timestamp)}</p>
                </div>
              </div>
              {!notification.read && (
                <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
              )}
            </div>
          )) : (
            <p className="text-slate-500 text-center py-8">No new updates</p>
          )}
        </div>
      </div>

      {/* Wishlist Preview */}
      {wishlist.length > 0 && (
        <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-gold-200/50 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl tracking-tight text-slate-900">Your Wishlist</h3>
            <span className="text-sm text-slate-500">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {wishlist.slice(0, 5).map(productId => {
              const product = db.products.find(p => p.id === productId);
              if (!product) return null;
              
              return (
                <div key={productId} className="flex items-center space-x-2 px-4 py-2 bg-gold-50 rounded-xl border border-gold-100">
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                  <span className="text-sm font-medium text-slate-700">{product.name}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="ml-2 text-gold-600 hover:text-gold-700"
                  >
                    +
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
