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
  inventoryLogs: InventoryLog[];
}

export interface InventoryLog {
  id: string;
  productId: string;
  changeQuantity: number;
  reason: 'received' | 'sold' | 'damaged' | 'returned' | 'adjustment';
  notes?: string;
  performedBy?: string;
  performedByName?: string;
  createdAt: string;
}

interface DatabaseContextType {
  db: AppDatabase;
  setDb: React.Dispatch<React.SetStateAction<AppDatabase>>;
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // Products
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Orders
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;

  // Partners
  addPartner: (data: { name: string; email: string; password: string; company: string; phone: string; discountRate: number; status: string; referredBy?: string; notes?: string }) => Promise<{ success: boolean; error?: string }>;
  updatePartner: (id: string, updates: Partial<Partner>) => void;

  // Customers
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Invitations
  addInvitationCode: (code: InvitationCode) => Promise<void>;
  updateInvitationCode: (id: string, updates: Partial<InvitationCode>) => Promise<void>;
  deleteInvitationCode: (codeStr: string) => Promise<void>;

  // Inventory
  addInventoryLog: (log: Omit<InventoryLog, 'id' | 'createdAt' | 'performedByName'>) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const INITIAL_DB_STATE: AppDatabase = {
  products: [],
  partners: [],
  customers: [],
  orders: [],
  invitationCodes: [],
  users: [],
  inventoryLogs: []
};

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDbState] = useState<AppDatabase>(INITIAL_DB_STATE);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [
        { data: products },
        { data: profiles },
        { data: ordersRaw },
        { data: codes },
        { data: orderItemsRaw },
        { data: inventoryLogsRaw }
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('invitation_codes').select('*'),
        supabase.from('order_items').select('*, products(name)'),
        supabase.from('inventory_log').select('*, profiles(full_name)')
      ]);

      if (products && profiles) {
        // Build a lookup map for profiles
        const profileMap = new Map(profiles.map(p => [p.id, p]));

        // Map profiles into users, partners, and customers
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
          status: p.status || 'pending',
          discountRate: p.discount_rate || 0,
          totalPurchases: Number(p.total_purchases) || 0,
          totalResold: Number(p.total_resold) || 0,
          joinedAt: p.created_at,
          referredBy: p.invited_by,
          referrals: profiles.filter(r => r.invited_by === p.id).map(r => r.id),
          notes: ''
        }));

        // Group order items by order_id
        const itemsByOrderId = new Map<string, any[]>();
        (orderItemsRaw || []).forEach(item => {
          const existing = itemsByOrderId.get(item.order_id) || [];
          existing.push(item);
          itemsByOrderId.set(item.order_id, existing);
        });

        // Map orders with items and customer names
        const mappedOrders: Order[] = (ordersRaw || []).map(o => {
          const customerProfile = profileMap.get(o.customer_id);
          const items = (itemsByOrderId.get(o.id) || []).map((item: any) => ({
            productId: item.product_id,
            name: item.products?.name || 'Unknown Product',
            quantity: item.quantity,
            price: Number(item.price_at_purchase)
          }));

          return {
            id: o.friendly_id,
            customerId: o.customer_id,
            customerName: customerProfile?.full_name || customerProfile?.email?.split('@')[0] || 'Unknown',
            items,
            total: Number(o.total_amount),
            status: o.status,
            paymentStatus: o.payment_status,
            createdAt: o.created_at,
            userType: customerProfile?.role === 'partner' ? 'partner' as const : 'customer' as const,
            partnerId: customerProfile?.role === 'partner' ? o.customer_id : undefined
          };
        });

        // Compute customer stats from orders
        const customerOrderCounts = new Map<string, { count: number; total: number; lastOrder?: string }>();
        mappedOrders.forEach(o => {
          const existing = customerOrderCounts.get(o.customerId) || { count: 0, total: 0 };
          existing.count++;
          existing.total += o.total;
          if (!existing.lastOrder || o.createdAt > existing.lastOrder) {
            existing.lastOrder = o.createdAt;
          }
          customerOrderCounts.set(o.customerId, existing);
        });

        const customers: Customer[] = profiles.filter(p => p.role === 'customer').map(p => {
          const stats = customerOrderCounts.get(p.id) || { count: 0, total: 0 };
          return {
            id: p.id,
            name: p.full_name || '',
            email: p.email,
            phone: p.phone_number || '',
            totalOrders: stats.count,
            totalSpent: stats.total,
            joinedAt: p.created_at,
            lastOrderAt: stats.lastOrder,
            status: 'active' as const,
            invitedBy: p.invited_by,
            invitedByName: p.invited_by ? profileMap.get(p.invited_by)?.full_name : undefined,
          };
        });

        // Map invitation codes from Supabase snake_case to frontend camelCase
        const mappedCodes: InvitationCode[] = (codes || []).map(c => {
          const creator = c.created_by ? profileMap.get(c.created_by) : null;
          return {
            id: c.code, // PK is the code itself
            code: c.code,
            type: (c.type || (c.role === 'partner' ? 'admin_partner' : 'admin_user')) as any,
            createdBy: c.created_by || '',
            createdByName: creator?.full_name || creator?.email?.split('@')[0] || 'System',
            createdAt: c.created_at?.split('T')[0] || '',
            expiresAt: c.expires_at?.split('T')[0],
            maxUses: c.max_uses || 1,
            usedCount: c.current_uses || 0,
            usedBy: [], // Would need a separate tracking table for detailed usage
            isActive: c.is_active !== false,
            notes: c.notes || '',
            partnerId: c.partner_id,
            partnerName: c.partner_id ? profileMap.get(c.partner_id)?.full_name : undefined,
            defaultDiscountRate: c.default_discount_rate,
          };
        });

        // Map products
        const mappedProducts: Product[] = products.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          fullDescription: p.full_description,
          price: Number(p.price),
          category: p.category,
          purity: p.purity || '',
          inStock: p.in_stock !== false,
          stockQuantity: p.stock_quantity || 0,
          sku: p.sku,
          benefits: p.benefits || [],
          dosage: p.dosage,
          imageUrl: p.image_url,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          lowStockThreshold: p.low_stock_threshold || 10,
        }));

        // Map inventory logs
        const mappedLogs: InventoryLog[] = (inventoryLogsRaw || []).map(l => ({
          id: l.id,
          productId: l.product_id,
          changeQuantity: l.change_quantity,
          reason: l.reason,
          notes: l.notes,
          performedBy: l.performed_by,
          performedByName: l.profiles?.full_name || 'Unknown',
          createdAt: l.created_at,
        }));

        setDbState({
          products: mappedProducts,
          users,
          partners,
          customers,
          orders: mappedOrders,
          invitationCodes: mappedCodes,
          inventoryLogs: mappedLogs,
        });
      }
    } catch (err) {
      console.error("Error loading Supabase data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    loadData();
  }, []);

  const setDb: React.Dispatch<React.SetStateAction<AppDatabase>> = setDbState;

  // ─── Products CRUD ──────────────────────────────────────────────
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
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.fullDescription !== undefined) dbUpdates.full_description = updates.fullDescription;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.purity !== undefined) dbUpdates.purity = updates.purity;
    if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
    if (updates.stockQuantity !== undefined) dbUpdates.stock_quantity = updates.stockQuantity;
    if (updates.benefits !== undefined) dbUpdates.benefits = updates.benefits;
    if (updates.dosage !== undefined) dbUpdates.dosage = updates.dosage;
    if (updates.sku !== undefined) dbUpdates.sku = updates.sku;

    await supabase.from('products').update(dbUpdates).eq('id', id);
  };

  const deleteProduct = async (id: string) => {
    setDb(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    await supabase.from('products').delete().eq('id', id);
  };

  // ─── Orders CRUD ──────────────────────────────────────────────
  const addOrder = async (order: Order) => {
    setDb(prev => ({ ...prev, orders: [...prev.orders, order] }));

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
    // Check if we're marking as delivered — need to deduct inventory
    const currentOrder = db.orders.find(o => o.id === id);
    const isBeingDelivered = updates.status === 'delivered' && currentOrder?.status !== 'delivered';

    setDb(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === id ? { ...o, ...updates } : o)
    }));

    const dbUpdates: any = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;
    await supabase.from('orders').update(dbUpdates).eq('friendly_id', id);

    // Auto-deduct inventory when order is marked as delivered
    if (isBeingDelivered && currentOrder?.items && currentOrder.items.length > 0) {
      for (const item of currentOrder.items) {
        const product = db.products.find(p => p.name === item.name || p.id === item.productId);
        if (product) {
          // Create inventory log entry
          await supabase.from('inventory_log').insert({
            product_id: product.id,
            change_quantity: -item.quantity,
            reason: 'sold',
            notes: `Order ${id} delivered`,
            performed_by: null, // system action
          });

          // Update product stock
          const newQty = Math.max(0, product.stockQuantity - item.quantity);
          await supabase.from('products').update({
            stock_quantity: newQty,
            in_stock: newQty > 0,
          }).eq('id', product.id);
        }
      }
      // Refresh data to reflect new stock levels
      await loadData();
    }
  };

  // ─── Partners CRUD ──────────────────────────────────────────────
  const addPartner = async (data: {
    name: string; email: string; password: string; company: string;
    phone: string; discountRate: number; status: string; referredBy?: string; notes?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      // Create auth user via signUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) return { success: false, error: authError.message };
      if (!authData.user) return { success: false, error: 'Failed to create user account' };

      // Create profile with partner role
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.name,
        role: 'partner',
        company_name: data.company,
        phone_number: data.phone,
        discount_rate: data.discountRate,
        status: data.status || 'active',
        invited_by: data.referredBy || null,
      });

      if (profileError) return { success: false, error: profileError.message };

      // Refresh data to pick up the new partner
      await loadData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updatePartner = async (id: string, updates: Partial<Partner>) => {
    setDb(prev => ({
      ...prev,
      partners: prev.partners.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
    const dbUpdates: any = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.discountRate !== undefined) dbUpdates.discount_rate = updates.discountRate;
    if (updates.name !== undefined) dbUpdates.full_name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.company !== undefined) dbUpdates.company_name = updates.company;
    if (updates.phone !== undefined) dbUpdates.phone_number = updates.phone;
    if (updates.referredBy !== undefined) dbUpdates.invited_by = updates.referredBy;
    await supabase.from('profiles').update(dbUpdates).eq('id', id);
  };

  // ─── Customers CRUD ──────────────────────────────────────────────
  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    setDb(prev => ({
      ...prev,
      customers: prev.customers.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  // ─── Invitations CRUD (NOW WRITES TO SUPABASE) ──────────────────
  const addInvitationCode = async (code: InvitationCode) => {
    setDb(prev => ({ ...prev, invitationCodes: [...prev.invitationCodes, code] }));

    const { error } = await supabase.from('invitation_codes').insert({
      code: code.code,
      role: code.type === 'admin_partner' ? 'partner' : 'customer',
      type: code.type,
      created_by: code.createdBy || null,
      max_uses: code.maxUses,
      current_uses: 0,
      expires_at: code.expiresAt || null,
      is_active: true,
      notes: code.notes || null,
      partner_id: code.partnerId || null,
      default_discount_rate: code.defaultDiscountRate || null,
    });

    if (error) console.error("Error creating invitation code:", error);
  };

  const updateInvitationCode = async (codeStr: string, updates: Partial<InvitationCode>) => {
    setDb(prev => ({
      ...prev,
      invitationCodes: prev.invitationCodes.map(c =>
        (c.code === codeStr || c.id === codeStr) ? { ...c, ...updates } : c
      )
    }));

    const dbUpdates: any = {};
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.maxUses !== undefined) dbUpdates.max_uses = updates.maxUses;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.usedCount !== undefined) dbUpdates.current_uses = updates.usedCount;

    // Find the actual code string
    const actualCode = db.invitationCodes.find(c => c.code === codeStr || c.id === codeStr)?.code || codeStr;
    await supabase.from('invitation_codes').update(dbUpdates).eq('code', actualCode);
  };

  const deleteInvitationCode = async (codeStr: string) => {
    setDb(prev => ({
      ...prev,
      invitationCodes: prev.invitationCodes.filter(c => c.code !== codeStr)
    }));
    await supabase.from('invitation_codes').update({ is_active: false }).eq('code', codeStr);
  };

  // ─── Inventory Logs ──────────────────────────────────────────────
  const addInventoryLog = async (log: Omit<InventoryLog, 'id' | 'createdAt' | 'performedByName'>) => {
    const { error } = await supabase.from('inventory_log').insert({
      product_id: log.productId,
      change_quantity: log.changeQuantity,
      reason: log.reason,
      notes: log.notes || null,
      performed_by: log.performedBy || null,
    });

    if (error) {
      console.error("Error adding inventory log:", error);
      return;
    }

    // Update product stock quantity
    const product = db.products.find(p => p.id === log.productId);
    if (product) {
      const newQty = product.stockQuantity + log.changeQuantity;
      await updateProduct(log.productId, {
        stockQuantity: Math.max(0, newQty),
        inStock: newQty > 0,
      });
    }

    // Refresh to get latest data
    await loadData();
  };

  return (
    <DatabaseContext.Provider value={{
      db, setDb, isLoading, refreshData: loadData,
      addProduct, updateProduct, deleteProduct,
      addOrder, updateOrder,
      addPartner, updatePartner,
      updateCustomer,
      addInvitationCode, updateInvitationCode, deleteInvitationCode,
      addInventoryLog,
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
