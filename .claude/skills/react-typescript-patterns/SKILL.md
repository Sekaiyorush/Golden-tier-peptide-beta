---
name: react-typescript-patterns
description: React 19 + TypeScript patterns and conventions for Golden Tier Peptide. Auto-activates when creating components, pages, contexts, or hooks. Enforces named exports, lazy loading, context patterns, and project structure conventions.
user-invocable: false
---

# React + TypeScript Patterns — Golden Tier Peptide

## Project Stack
- React 19 + Vite + TypeScript
- React Router DOM (file-based routing)
- Framer Motion (animations)
- shadcn/ui components from `@/components/ui/`
- Path alias: `@/` → `src/`

## Export Rules — Critical
```typescript
// ✅ Named exports ONLY for all components
export function ProductCard() { ... }
export const CartSidebar = () => { ... }

// ❌ Never use default exports except for App.tsx
export default function ProductCard() { ... } // WRONG
```

## Lazy Loading Routes
```typescript
// ✅ Correct lazy import pattern
const ProductDetails = lazy(() =>
  import('@/pages/ProductDetails').then(m => ({ default: m.ProductDetails }))
);

// ❌ Wrong — no .then() needed only if it's a default export (which we don't use)
const ProductDetails = lazy(() => import('@/pages/ProductDetails'));
```

## Provider Hierarchy (do not reorder)
```
<DatabaseProvider>
  <AuthProvider>
    <LanguageProvider>
      <CartProvider>
        <ToastProvider>
          <AppContent />
```
When adding a new provider, place it at the appropriate level. DatabaseProvider must always be outermost (other providers need DB access). AuthProvider must be inside DatabaseProvider.

## Context Pattern
```typescript
// ✅ Standard context pattern for this project
interface MyContextValue {
  data: DataType[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const MyContext = createContext<MyContextValue | null>(null);

export function MyProvider({ children }: { children: React.ReactNode }) {
  // ... state and logic
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

export function useMyContext() {
  const ctx = useContext(MyContext);
  if (!ctx) throw new Error('useMyContext must be used within MyProvider');
  return ctx;
}
```

## Accessing Auth & Database
```typescript
// Auth state
import { useAuth } from '@/context/AuthContext';
const { user, isAdmin, isPartner, isCustomer } = useAuth();

// All Supabase data (products, orders, profiles, etc.)
import { useDatabase } from '@/context/DatabaseContext';
const { products, orders, profiles, refreshData, logAudit } = useDatabase();

// Cart
import { useCart } from '@/context/CartContext';
const { items, addToCart, cartTotal } = useCart();
```

## Route Protection
```typescript
// ✅ Use ProtectedRoute with props
<ProtectedRoute requireAdmin>
  <AdminPage />
</ProtectedRoute>

<ProtectedRoute requirePartner>
  <PartnerPage />
</ProtectedRoute>

// Unauthenticated users always redirect to LandingPage
```

## Route Paths
- `/` — LandingPage (public)
- `/products` — product catalog
- `/product/:sku` — product detail (SKU-based, NOT UUID)
- `/checkout` — partner only
- `/dashboard/*` — customer dashboard
- `/partner/*` — partner dashboard
- `/admin/*` — admin panel
- `/reset-password` — Supabase magic link target

## TypeScript Patterns

### Component props
```typescript
// ✅ Inline interface for props
interface ProductCardProps {
  product: Product;
  index?: number;
  onSelect?: (id: string) => void;
}

export function ProductCard({ product, index = 0, onSelect }: ProductCardProps) { ... }
```

### Event handlers
```typescript
// ✅ Type events properly
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... };
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); ... };
```

### Async data fetching
```typescript
// ✅ Pattern used in this project
const [data, setData] = useState<DataType[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchData() {
    setIsLoading(true);
    try {
      const result = await someAsyncFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }
  fetchData();
}, [dependency]);
```

## Component File Structure
```typescript
// Standard file layout order:
// 1. Imports
// 2. Types/interfaces
// 3. Constants (outside component)
// 4. Component function
// 5. Sub-components (if small enough to co-locate)
// 6. Named export
```

## Price Formatting — Always use formatTHB
```typescript
import { formatTHB } from '@/lib/formatPrice';

// ✅ Always use for any monetary display
<span>{formatTHB(product.price)}</span>
<span>{formatTHB(order.total)}</span>

// ❌ Never use raw formatting
<span>฿{price.toFixed(2)}</span>   // WRONG
<span>${price.toLocaleString()}</span>  // WRONG
```

## cn() for Class Merging
```typescript
import { cn } from '@/lib/utils';

// ✅ Always use cn() for conditional/merged Tailwind classes
<div className={cn(
  'base-classes here',
  isActive && 'active-classes',
  variant === 'gold' && 'text-[#D4AF37]'
)} />
```

## Framer Motion Pattern
```typescript
import { motion } from 'framer-motion';

// ✅ Standard card animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
>
```

## shadcn/ui Import Pattern
```typescript
// ✅ Always import from @/components/ui/
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
```

## Toast Notifications
```typescript
import { toast } from 'sonner';

toast.success('Order placed successfully!');
toast.error('Something went wrong');
toast.info('Please check your email');
```
