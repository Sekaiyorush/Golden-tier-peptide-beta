import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, Partner, Customer, Order } from '@/data/products';
import type { InvitationCode } from '@/data/invitations';
import type { User } from './AuthContext';
import { supabase } from '@/lib/supabase';

// We manage global mapped state here for optimistic UI updates
export interface AppDatabase {
  products: Product[];
  partners: Partner[];
  customers: Customer[];
  orders: Order[];
  invitationCodes: InvitationCode[];
  users: User[];
}

interface DatabaseContextType {
  db: AppDatabase;
  setDb: React.Dispatch<React.SetStateAction<AppDatabase>>;

  // Products
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Orders
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;

  // Partners
  updatePartner: (id: string, updates: Partial<Partner>) => void;

  // Customers
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Invitations
  addInvitationCode: (code: InvitationCode) => void;
  updateInvitationCode: (id: string, updates: Partial<InvitationCode>) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const INITIAL_DB_STATE: AppDatabase = {
  products: [],
  partners: [],
  customers: [],
  orders: [],
  invitationCodes: [],
  users: []
};

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDbState] = useState<AppDatabase>(INITIAL_DB_STATE);

  // Initial Data Fetch
  useEffect(() => {
    async function loadData() {
      try {
        const [
          { data: products },
          { data: profiles },
          { data: orders },
          { data: codes }
        ] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('profiles').select('*'),
          supabase.from('orders').select('*'),
          supabase.from('invitation_codes').select('*')
        ]);

        if (products && profiles) {
          // We will map profiles into users, partners, and customers for backwards compatibility with the UI
          const users: User[] = profiles.map(p => ({
            id: p.id,
            email: p.email,
            name: p.full_name || p.email.split('@')[0],
            role: p.role,
            discountRate: p.discount_rate,
            partnerId: p.role === 'partner' ? p.id : undefined,
            company: p.company_name,
            phone: p.phone_number,
            joinedAt: p.created_at
          }));

          const partners: Partner[] = profiles.filter(p => p.role === 'partner').map(p => ({
            id: p.id,
            name: p.full_name || '',
            email: p.email,
            company: p.company_name || '',
            phone: p.phone_number || '',
            status: p.status,
            discountRate: p.discount_rate,
            totalPurchases: p.total_purchases,
            totalResold: p.total_resold,
            joinedAt: p.created_at,
            referredBy: p.invited_by,
            referrals: [], // Would need a separate map
            notes: ''
          }));

          const customers: Customer[] = profiles.filter(p => p.role === 'customer').map(p => ({
            id: p.id,
            name: p.full_name || '',
            email: p.email,
            phone: p.phone_number || '',
            totalOrders: 0, // Calculate from orders later
            totalSpent: 0,
            joinedAt: p.created_at,
            status: 'active',
          }));

          // Maps Postgres names back to camelCase frontend types
          const mappedProducts: Product[] = products.map(p => ({
            ...p,
            fullDescription: p.full_description,
            inStock: p.in_stock,
            stockQuantity: p.stock_quantity,
            imageUrl: p.image_url,
            createdAt: p.created_at,
            updatedAt: p.updated_at
          }));

          const mappedOrders: Order[] = (orders || []).map(o => ({
            id: o.friendly_id,
            customerId: o.customer_id,
            customerName: 'Customer', // Would need a join
            items: [], // Would need to fetch from order_items table
            total: o.total_amount,
            status: o.status,
            paymentStatus: o.payment_status,
            createdAt: o.created_at,
            userType: 'customer'
          }));

          setDbState({
            products: mappedProducts,
            users,
            partners,
            customers,
            orders: mappedOrders,
            invitationCodes: codes || []
          });
        }
      } catch (err) {
        console.error("Error loading Supabase data:", err);
      }
    }
    loadData();
  }, []);

  const setDb: React.Dispatch<React.SetStateAction<AppDatabase>> = setDbState;

  // Optimistic Products CRUD
  const addProduct = async (product: Product) => {
    setDb(prev => ({ ...prev, products: [...prev.products, product] }));
    const { error } = await supabase.from('products').insert({
      sku: product.sku,
      name: product.name,
      description: product.description,
      full_description: product.fullDescription,
      price: product.price,
      category: product.category,
      purity: product.purity,
      in_stock: product.inStock,
      stock_quantity: product.stockQuantity,
      benefits: product.benefits,
      dosage: product.dosage
    });
    if (error) console.error(error);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setDb(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
    await supabase.from('products').update({
      name: updates.name,
      price: updates.price,
      stock_quantity: updates.stockQuantity,
      in_stock: updates.inStock
    }).eq('id', id);
  };

  const deleteProduct = async (id: string) => {
    setDb(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    await supabase.from('products').delete().eq('id', id);
  };

  // Orders CRUD
  const addOrder = async (order: Order) => {
    setDb(prev => ({ ...prev, orders: [...prev.orders, order] }));

    // Insert order header
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        friendly_id: order.id,
        customer_id: order.customerId,
        total_amount: order.total,
        status: order.status,
        payment_status: order.paymentStatus
      })
      .select('id')
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return;
    }

    // Insert order line items
    if (newOrder && order.items && order.items.length > 0) {
      const dbOrderItems = order.items.map(item => ({
        order_id: newOrder.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(dbOrderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
      }
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    setDb(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === id ? { ...o, ...updates } : o)
    }));
    await supabase.from('orders').update({ status: updates.status, payment_status: updates.paymentStatus }).eq('friendly_id', id);
  };

  // Partners CRUD
  const updatePartner = async (id: string, updates: Partial<Partner>) => {
    setDb(prev => ({
      ...prev,
      partners: prev.partners.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
    await supabase.from('profiles').update({ status: updates.status, discount_rate: updates.discountRate }).eq('id', id);
  };

  // Customers CRUD
  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    setDb(prev => ({
      ...prev,
      customers: prev.customers.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  // Invitations CRUD
  const addInvitationCode = async (code: InvitationCode) => {
    setDb(prev => ({ ...prev, invitationCodes: [...prev.invitationCodes, code] }));
  };

  const updateInvitationCode = async (id: string, updates: Partial<InvitationCode>) => {
    setDb(prev => ({
      ...prev,
      invitationCodes: prev.invitationCodes.map(c => c.code === id ? { ...c, ...updates } : c)
    }));
  };

  return (
    <DatabaseContext.Provider value={{
      db, setDb,
      addProduct, updateProduct, deleteProduct,
      addOrder, updateOrder,
      updatePartner,
      updateCustomer,
      addInvitationCode, updateInvitationCode
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
