# Golden Tier Peptide — Project Memory

> Premium e-commerce platform for research-grade peptides. Luxury aesthetic with black, white, and gold palette. Invitation-only registration system with role-based access.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 20 |
| Framework | React | 19.2 |
| Build | Vite | 7.2.4 |
| Language | TypeScript | ~5.9.3 |
| CSS | Tailwind CSS | 3.4.19 |
| UI Library | shadcn/ui (Radix primitives) | 40+ components |
| Backend | Supabase (Postgres + Auth + RLS) | supabase-js 2.97 |
| 3D | Three.js + @react-three/fiber + drei | 0.183 |
| Animation | Framer Motion | 12.34 |
| Charts | Recharts | 2.15 |
| Forms | React Hook Form + Zod | 7.70 / 4.3 |
| Icons | Lucide React | 0.562 |
| Routing | React Router DOM | 7.13 |
| Testing | Vitest + Testing Library | 4.0 |

---

## Project Structure

```
src/
├── App.tsx                 # Root — context providers + lazy-loaded routes
├── main.tsx                # Entry point (renders <App />)
├── index.css               # Global styles (CSS variables for shadcn)
├── App.css                 # App-specific styles
│
├── context/                # React Context providers (4)
│   ├── AuthContext.tsx      # Supabase auth, login/register/logout, role checks
│   ├── CartContext.tsx      # Shopping cart state (partner-only checkout)
│   ├── DatabaseContext.tsx  # ALL Supabase CRUD operations (~800 lines)
│   └── LanguageContext.tsx  # i18n language toggle
│
├── lib/                    # Utilities
│   ├── supabase.ts         # Supabase client init (uses VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
│   ├── emailService.ts     # Email notification helper
│   ├── formatPrice.ts      # Currency formatting (THB/USD)
│   ├── formatDate.ts       # Date formatting
│   └── utils.ts            # cn() helper for Tailwind class merging
│
├── components/             # 82+ components
│   ├── ui/                 # shadcn/ui primitives (56 components)
│   ├── admin/              # Admin-specific components (DashboardAnalytics, etc.)
│   ├── customer/           # Customer-specific components
│   ├── partner/            # Partner-specific components (PartnerAnalytics)
│   ├── reviews/            # Review/rating system (6 components)
│   ├── skeletons/          # Loading skeleton components (3)
│   ├── animations/         # Animation components
│   ├── Header.tsx          # Main navigation header
│   ├── Footer.tsx          # Site footer
│   ├── CartSidebar.tsx     # Slide-out cart (partners only)
│   ├── ProductCard.tsx     # Product grid card
│   ├── GoldenMolecule.tsx  # Three.js 3D molecule visualization
│   ├── PremiumEffects.tsx  # Ambient visual effects (gradients, particles)
│   ├── ErrorBoundary.tsx   # React error boundary
│   ├── SEO.tsx             # SEO meta component
│   └── ...
│
├── pages/                  # Route pages
│   ├── LandingPage.tsx     # Public landing (shown to unauthenticated visitors)
│   ├── Login.tsx           # Login form
│   ├── Register.tsx        # Registration with invitation code validation
│   ├── ForgotPassword.tsx  # Password reset request
│   ├── ResetPassword.tsx   # Password reset form (Supabase magic link flow)
│   ├── Products.tsx        # Product catalog with filters
│   ├── ProductDetails.tsx  # Single product view with reviews
│   ├── Checkout.tsx        # Checkout flow (partners only)
│   ├── About.tsx           # About page
│   ├── Contact.tsx         # Contact form
│   ├── FAQ.tsx             # FAQ accordion
│   ├── Research.tsx        # Research information
│   ├── Terms.tsx           # Terms of service
│   ├── Privacy.tsx         # Privacy policy
│   ├── Shipping.tsx        # Shipping information
│   │
│   ├── admin/              # Admin panel (requireAdmin)
│   │   ├── AdminDashboard.tsx         # Admin home with analytics
│   │   ├── ProductsManagement.tsx     # Product CRUD
│   │   ├── InventoryManagement.tsx    # Stock tracking with logs
│   │   ├── OrdersManagement.tsx       # Order processing
│   │   ├── CustomersManagement.tsx    # Customer management
│   │   ├── PartnersManagement.tsx     # Partner management
│   │   ├── PartnerAnalytics.tsx       # Partner performance metrics
│   │   ├── PartnerNetwork.tsx         # Partner network visualization
│   │   ├── InvitationCodeManagement.tsx # Invite code generation
│   │   ├── QRCodeManager.tsx          # QR code generation for products
│   │   ├── AuditLogViewer.tsx         # Audit trail viewer
│   │   └── SettingsManagement.tsx     # Site settings
│   │
│   ├── partner/            # Partner portal (requirePartner)
│   │   ├── PartnerDashboard.tsx       # Partner home with stats
│   │   └── PartnerNetwork.tsx         # Referral network
│   │
│   └── dashboard/          # Customer dashboard (authenticated)
│       └── UserDashboard.tsx          # Order history, profile
│
├── sections/               # Landing page sections
│   ├── Hero.tsx            # Hero section with 3D molecule
│   ├── FeaturedProducts.tsx # Featured product carousel
│   └── TrustFeatures.tsx   # Trust badges and features
│
├── data/                   # Type definitions and static data
│   ├── products.ts         # Product, Partner, Customer, Order types
│   ├── invitations.ts      # InvitationCode types
│   └── locales.ts          # i18n translation strings
│
├── hooks/                  # Custom hooks
│   └── ...
│
└── test/                   # Test utilities
    └── ...
```

---

## Architecture & Patterns

### Context Provider Hierarchy
```
<DatabaseProvider>        ← All Supabase data + CRUD operations
  <AuthProvider>          ← Auth state + user session + role checks
    <LanguageProvider>    ← i18n strings
      <CartProvider>      ← Shopping cart state
        <ToastProvider>   ← Toast notifications (sonner)
          <AppContent />  ← Router + routes
```

### Authentication Flow
- Uses **Supabase Auth** with email/password
- **Invitation code required** for registration (validated via server-side RPC)
- Three roles: `admin`, `partner`, `customer`
- Auto-profile creation via Postgres trigger (`handle_new_user()`)
- Password recovery via Supabase magic links → `/reset-password`
- `ProtectedRoute` component checks `requireAdmin` / `requirePartner` props

### Routing Strategy
- **Unauthenticated**: Only sees `<LandingPage />` (all paths redirect)
- **Auth pages**: `/login`, `/register`, `/forgot-password`, `/reset-password` (always accessible)
- **Authenticated**: Full site with lazy-loaded routes via `React.lazy()` + `Suspense`
- **Admin**: `/admin/*` → `AdminDashboard` (internal sub-routing)
- **Partner**: `/partner/*` → `PartnerDashboard`
- **Customer**: `/dashboard/*` → `UserDashboard`
- Product detail: `/product/:sku` (uses SKU, not UUID)

### Data Layer
- **`DatabaseContext.tsx`** (~818 lines) is the central data layer
- All Supabase queries go through the `DatabaseProvider`
- Provides CRUD functions: `addProduct`, `updateProduct`, `deleteProduct`, `addOrder`, `createSecureOrder`, `addPartner`, `updatePartner`, etc.
- Includes audit logging via `logAudit()` helper
- Initial data load happens in `loadData()` on mount
- Uses `refreshData()` for re-fetching

### No Mock Data
- All data comes from Supabase — mock data was removed in a previous session
- Products, orders, partners, customers are all live from the database

---

## Database Schema (Supabase / Postgres)

### Core Tables
| Table | Description | RLS |
|---|---|---|
| `profiles` | Extends auth.users — role, status, partner fields, discount_rate | ✅ |
| `products` | SKU, name, price, category, purity, stock, benefits[], dosage | ✅ |
| `invitation_codes` | Code-based registration system, max_uses, expiry | ✅ |
| `orders` | friendly_id (ORD-YYYY-NNN), status workflow, payment_status | ✅ |
| `order_items` | Line items with price_at_purchase (frozen at checkout) | ✅ |

### Key Features
- **RLS enabled on all tables** — role-based policies for admin, partner, customer
- **Trigger: `handle_new_user()`** — auto-creates profile on auth signup
- **Trigger: `update_modified_column()`** — auto-updates `updated_at` timestamps
- **Indexes** on foreign keys (`customer_id`, `order_id`, `product_id`, `invited_by`)
- **Currency precision**: `numeric(10,2)` on all monetary fields

### Profile Roles
- `admin` — Full platform management access
- `partner` — Can browse, order products at discount, see partner analytics
- `customer` — Basic access, order history

---

## Design System

### Colors
- **Primary Gold**: `#D4AF37` (gold-500) — main brand metallic
- **Deep Gold**: `#AA771C` (gold-600) — hover/active states
- Full gold scale: 50-900 with warm, metallic progression
- **Backgrounds**: White (`bg-white`) with subtle amber gradients
- **Text**: Slate scale (slate-50 through slate-900)
- **Accents**: Emerald (success), Amber (warning), Rose (error)
- CSS variables for shadcn theming via HSL

### Typography
- **Font**: Inter (loaded from Google Fonts or system stack)
- Font family: `['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']`

### Animations
- `gradient-x` — animated gradient backgrounds (5s loop)
- `shimmer` — shimmer loading effect
- `spin-slow` — slow rotation (8s, used for 3D molecule)
- `accordion-down/up` — Radix accordion transitions
- Framer Motion for page transitions and micro-interactions

### Component Library
Uses **shadcn/ui** with 56 primitives. Import pattern:
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
```

---

## Environment Variables

Required in `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## Commands

```bash
npm run dev          # Start Vite dev server (default: localhost:5173)
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run test         # Vitest watch mode
npm run test:run     # Vitest single run
npm run test:coverage # Vitest with coverage
npm run preview      # Preview production build
```

---

## Supabase Project

- **Project ID**: `lgyavqiqbblozvlwzqsj`
- **Region**: Check Supabase dashboard
- Connected via `@supabase/supabase-js` with anon key
- Uses RPC functions for secure operations (invitation validation, order creation)
- Admin operations use service role where needed

---

## Key Conventions

1. **Path alias**: `@/` maps to `./src/` (configured in `vite.config.ts` + `tsconfig`)
2. **Named exports**: Components use named exports, lazy imports destructure them:
   ```tsx
   const Products = lazy(() => import('@/pages/Products').then(m => ({ default: m.Products })));
   ```
3. **No default exports** for page/component modules (except `App`)
4. **Tailwind + shadcn**: Use `cn()` from `@/lib/utils` for conditional classes
5. **Currency**: Prices stored as `numeric(10,2)` in DB, formatted via `formatPrice.ts`
6. **Product routing**: Uses SKU (`/product/:sku`), not UUID
7. **Cart**: Only visible/functional for **partner** role users
8. **Checkout**: Restricted to partners via `ProtectedRoute`
9. **Toast notifications**: Use `sonner` via `<ToastProvider>`
10. **Error boundaries**: `<ErrorBoundary>` wraps critical sections

---

## Git & Deployment

- **Repository**: Connected to GitHub (Sekaiyorush/Golden-tier-peptide-beta)
- **Deploy workflow**: `.github/workflows/deploy.yml`
- **Production build**: `dist/` directory (Vite output, `base: './'`)
- **Domain**: `golden-tier.online` (referenced in previous sessions)

---

## Known Context from Previous Sessions

- CSP errors were debugged for 3D asset loading (Three.js models/textures)
- Mock data was fully removed — app is 100% Supabase-driven
- Partner portal includes commission tracking and analytics
- QR code generation exists for product labels
- Audit logging tracks admin actions
- Demand aggregation ("Lab Requests") system was implemented
- Prompt DNA feature exists with modifier presets
- Two Claude Code worktrees exist: `elastic-banach` and `hardcore-murdock`
