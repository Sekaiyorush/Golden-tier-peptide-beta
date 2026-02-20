import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Package, 
  ChevronDown, 
  ChevronUp,
  Truck,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
    },
    items: [
      { productId: 'bpc-157', name: 'BPC-157', quantity: 2, price: 49.99 },
      { productId: 'tb-500', name: 'TB-500', quantity: 1, price: 54.99 },
    ],
    total: 154.97,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-02-15',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
  },
  {
    id: 'ORD-2024-002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 987-6543',
    },
    items: [
      { productId: 'cjc-1295', name: 'CJC-1295', quantity: 3, price: 44.99 },
      { productId: 'ipamorelin', name: 'Ipamorelin', quantity: 2, price: 39.99 },
    ],
    total: 214.95,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: '2024-02-16',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA',
    },
  },
  {
    id: 'ORD-2024-003',
    customer: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1 (555) 456-7890',
    },
    items: [
      { productId: 'melanotan-2', name: 'Melanotan II', quantity: 1, price: 59.99 },
    ],
    total: 59.99,
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: '2024-02-17',
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA',
    },
  },
  {
    id: 'ORD-2024-004',
    customer: {
      name: 'Alice Williams',
      email: 'alice@example.com',
      phone: '+1 (555) 234-5678',
    },
    items: [
      { productId: 'ghrp-6', name: 'GHRP-6', quantity: 2, price: 42.99 },
      { productId: 'bpc-157', name: 'BPC-157', quantity: 1, price: 49.99 },
    ],
    total: 135.97,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2024-02-18',
    shippingAddress: {
      street: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'USA',
    },
  },
  {
    id: 'ORD-2024-005',
    customer: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      phone: '+1 (555) 876-5432',
    },
    items: [
      { productId: 'tb-500', name: 'TB-500', quantity: 3, price: 54.99 },
    ],
    total: 164.97,
    status: 'cancelled',
    paymentStatus: 'failed',
    createdAt: '2024-02-14',
    shippingAddress: {
      street: '654 Maple Dr',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'USA',
    },
  },
];

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Orders Management</h2>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-foreground' },
          { label: 'Pending', value: orders.filter((o) => o.status === 'pending').length, color: 'text-orange-600' },
          { label: 'Processing', value: orders.filter((o) => o.status === 'processing').length, color: 'text-yellow-600' },
          { label: 'Shipped', value: orders.filter((o) => o.status === 'shipped').length, color: 'text-blue-600' },
          { label: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-background p-4 rounded-lg border border-border text-center">
            <p className="text-2xl font-bold {stat.color}">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders by ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg bg-background focus:ring-primary focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <>
                  <tr key={order.id} className="hover:bg-surface-alt/50">
                    <td className="px-4 py-3">
                      <span className="font-medium">{order.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{order.createdAt}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="p-2 hover:bg-surface-alt rounded-lg text-muted-foreground hover:text-primary"
                      >
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 bg-surface-alt/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">Order Items</h4>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.productId}
                                  className="flex items-center justify-between p-2 bg-background rounded"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <span>{item.name}</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {item.quantity} x ${item.price.toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-3">Shipping Address</h4>
                            <div className="p-3 bg-background rounded text-sm">
                              <p>{order.shippingAddress.street}</p>
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                {order.shippingAddress.zip}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">Contact</h4>
                              <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
