export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  category: string;
  purity: string;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  benefits?: string[];
  dosage?: string;
  createdAt: string;
  updatedAt: string;
}

// Mocks exported to Supabase


// Categories
export const categories = [
  "Healing",
  "Recovery",
  "Growth",
  "Research",
  "Performance",
  "Anti-Aging",
];

// Partner with discount-based system (partners buy at discount to resell)
export interface Partner {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  discountRate: number; // Percentage discount (e.g., 20 = 20% off retail)
  totalPurchases: number; // Total amount partner has purchased
  totalResold: number; // Estimated amount partner has resold
  joinedAt: string;
  referredBy?: string; // ID of partner who referred this partner
  referrals: string[]; // IDs of partners referred by this partner
  notes?: string;
}

// Customer data
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrderAt?: string;
  status: 'active' | 'inactive';
  notes?: string;
  // Invitation tracking
  invitedBy?: string;
  invitedByName?: string;
  invitationCode?: string;
  partnerId?: string;
}

// Orders
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  userType: 'customer' | 'partner';
  partnerId?: string;
}
