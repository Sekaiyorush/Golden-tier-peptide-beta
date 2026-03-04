import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import type { Product, ProductVariant } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

/** Get the effective unit price for a cart item */
export function getItemPrice(item: CartItem): number {
  return item.selectedVariant?.price ?? item.product.price;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantSku?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantSku?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  discountAmount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// G5: Namespace cart key by userId
function getCartStorageKey(userId: string | undefined): string {
  return userId ? `goldentier_cart_${userId}` : 'goldentier_cart_guest';
}

// G7: Zod schema for cart validation
const CartItemSchema = z.array(z.object({
  product: z.object({ id: z.string() }).passthrough(),
  quantity: z.number().int().min(1).max(999),
  selectedVariant: z.any().optional(),
}));

function loadCartFromStorage(userId: string | undefined): CartItem[] {
  try {
    const stored = localStorage.getItem(getCartStorageKey(userId));
    if (stored) {
      const parsed = JSON.parse(stored);
      const result = CartItemSchema.safeParse(parsed);
      if (!result.success) return [];
      return result.data as CartItem[];
    }
  } catch {
    // Corrupted data — ignore
  }
  return [];
}

function saveCartToStorage(items: CartItem[], userId: string | undefined) {
  try {
    localStorage.setItem(getCartStorageKey(userId), JSON.stringify(items));
  } catch {
    // Storage full or unavailable — ignore
  }
}

function matchesItem(item: CartItem, productId: string, variantSku?: string): boolean {
  if (item.product.id !== productId) return false;
  if (variantSku) return item.selectedVariant?.sku === variantSku;
  return !item.selectedVariant;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isPartner } = useAuth();
  const userId = user?.id;

  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage(userId));
  const [isOpen, setIsOpen] = useState(false);

  // G9: Ref for debounce timer
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // G5+G6: Reload cart when userId changes; clear on logout
  useEffect(() => {
    if (userId === undefined) {
      // User logged out — clear cart state and remove previous storage entry
      setItems([]);
    } else {
      setItems(loadCartFromStorage(userId));
    }
  }, [userId]);

  // G9: Persist cart to localStorage with 500ms debounce
  useEffect(() => {
    if (saveTimerRef.current !== null) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveCartToStorage(items, userId);
    }, 500);
    return () => {
      if (saveTimerRef.current !== null) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [items, userId]);

  const addToCart = useCallback((product: Product, variant?: ProductVariant) => {
    setItems((prev) => {
      const existing = prev.find((item) => matchesItem(item, product.id, variant?.sku));
      if (existing) {
        return prev.map((item) =>
          matchesItem(item, product.id, variant?.sku)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedVariant: variant }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, variantSku?: string) => {
    setItems((prev) => prev.filter((item) => !matchesItem(item, productId, variantSku)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantSku?: string) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => !matchesItem(item, productId, variantSku)));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        matchesItem(item, productId, variantSku) ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // G8: useMemo for cart calculations
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const cartSubtotal = useMemo(
    () => items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0),
    [items]
  );

  const discountAmount = useMemo(
    () => (isPartner && user?.discountRate ? cartSubtotal * (user.discountRate / 100) : 0),
    [cartSubtotal, isPartner, user?.discountRate]
  );

  const cartTotal = useMemo(
    () => cartSubtotal - discountAmount,
    [cartSubtotal, discountAmount]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        isOpen,
        setIsOpen,
        cartCount,
        cartSubtotal,
        discountAmount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
