# Golden Tier Peptide — Project Memory

> Premium e-commerce platform for research-grade peptides. Invitation-only registration with role-based access (`admin`, `partner`, `customer`). Brand colors: gold `#D4AF37` / `#AA771C`.

**Stack:** React 19 + Vite + TypeScript, Tailwind + shadcn/ui, Supabase (Postgres + Auth + RLS), Three.js/R3F, Framer Motion, React Router DOM, Vitest

**Supabase:** Project ID `lgyavqiqbblozvlwzqsj` — env vars `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in `.env.local`

## Provider Hierarchy
```
<DatabaseProvider>   ← all Supabase CRUD (DatabaseContext.tsx ~818 lines)
  <AuthProvider>     ← auth state + role checks
    <LanguageProvider>
      <CartProvider>
        <ToastProvider>  ← sonner
          <AppContent /> ← router + routes
```

## Auth & Routing
- Registration requires invitation code — validated via server-side RPC
- Roles: `admin`, `partner`, `customer` — auto-profile via Postgres trigger `handle_new_user()`
- `ProtectedRoute` uses `requireAdmin` / `requirePartner` props
- Unauthenticated users see only `LandingPage` (all other paths redirect)
- Lazy-loaded routes: `lazy(() => import(...).then(m => ({ default: m.ComponentName })))`
- Routes: `/admin/*`, `/partner/*`, `/dashboard/*`, `/product/:sku` (SKU, not UUID)
- Password reset: Supabase magic links → `/reset-password`

## Data Layer
- `DatabaseContext.tsx` is the sole data layer — all Supabase queries go through it
- `loadData()` on mount, `refreshData()` to re-fetch, `logAudit()` for admin action tracking
- 100% Supabase-driven — no mock data

## Database Schema
- `profiles` — extends auth.users; fields: role, status, discount_rate, partner fields
- `products` — SKU, name, price, category, purity, stock, benefits[], dosage
- `invitation_codes` — max_uses, expiry
- `orders` — friendly_id format `ORD-YYYY-NNN`, status + payment_status
- `order_items` — price_at_purchase frozen at checkout
- All tables: RLS enabled, monetary fields `numeric(10,2)`

## Key Conventions
- `@/` → `src/` path alias
- Named exports only (except `App`); lazy imports: `.then(m => ({ default: m.ComponentName }))`
- Use `cn()` from `@/lib/utils` for Tailwind class merging
- Currency formatted via `src/lib/formatPrice.ts` (THB)
- Cart + Checkout restricted to `partner` role only
- shadcn/ui components imported from `@/components/ui/`
