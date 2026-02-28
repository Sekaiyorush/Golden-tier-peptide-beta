import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Product, ProductVariant } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

/** Unique key for a cart line item (product + optional variant) */
function cartItemKey(item: CartItem): string {
  return item.selectedVariant ? `${item.product.id}::${item.selectedVariant.sku}` : item.product.id;
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

const CART_STORAGE_KEY = 'goldentier_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Corrupted data — ignore
  }
  return [];
}

function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
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
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
  const [isOpen, setIsOpen] = useState(false);
  const { user, isPartner } = useAuth();

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

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

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = items.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );

  const discountAmount = isPartner && user?.discountRate ? cartSubtotal * (user.discountRate / 100) : 0;
  const cartTotal = cartSubtotal - discountAmount;

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
