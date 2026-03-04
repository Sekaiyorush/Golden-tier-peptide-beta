# Security Audit Report — Golden Tier Peptide
> Generated: 2026-03-02 | Branch: claude/hardcore-murdock

---

## 1. Authentication & Authorization

### Alert messages expose error details
**File**: `src/context/AuthContext.tsx:94,100`
**Severity**: Medium
**Detail**: `alert(error.message)` displays raw Supabase error messages. Auth errors could leak information about user enumeration or service internals.
**Fix**: Replace raw error messages with generic messages. Log detailed errors server-side only.

---

### Missing email validation in login/register flows
**File**: `src/pages/Login.tsx`, `src/pages/Register.tsx`
**Severity**: Low
**Detail**: HTML5 `type="email"` provides minimal protection. No Zod validation schema found for authentication forms.
**Fix**: Implement Zod schema for email validation with proper error handling before submission.

---

### Password strength requirements are client-side only
**File**: `src/pages/Register.tsx:79-81`
**Severity**: Medium
**Detail**: Minimum 8 characters validated client-side only. No complexity requirements (uppercase, numbers, special chars). Server must also enforce.
**Fix**: Implement server-side password policy in Supabase auth or RPC function.

---

### Role determination relies on client-side invitation code response
**File**: `src/context/AuthContext.tsx:165-168`
**Severity**: High
**Detail**: User role is determined from invitation code validation response. If validation RPC response is tampered, roles could be escalated (partner → admin).
**Fix**: Role assignment MUST only happen via server-side RPC within a database transaction. Never trust client-provided role values.

---

### ProtectedRoute is client-side only — no real authorization enforcement
**File**: `src/App.tsx:46-66`
**Severity**: High
**Detail**: ProtectedRoute checks `isAdmin` / `isPartner` against auth context state. A user could modify localStorage or context in DevTools to bypass these checks.
**Fix**: ProtectedRoute should only handle redirects. Actual data access must be protected at the RLS level in Supabase.

---

## 2. RLS & Database Security

### Anon key used for all database access without RLS verification
**File**: `src/context/DatabaseContext.tsx:156-162`
**Severity**: Critical
**Detail**: All queries run with the anon key. RLS is documented as enabled but not programmatically verified at runtime.
**Fix**: Audit Supabase RLS policies in the console. Add error handling for RLS denials. Move admin operations to a secure backend with service role key.

---

### Temporary Supabase client created on frontend
**File**: `src/context/DatabaseContext.tsx:582-586`
**Severity**: Critical
**Detail**: A secondary Supabase client is created client-side. Any frontend auth client is a risk surface if the key is exposed in build artifacts.
**Fix**: Move all user-creation/admin operations to a Supabase Edge Function or secure backend API.

---

### Supabase anon key is in build output
**File**: `src/lib/supabase.ts`, `.env.local`
**Severity**: Critical
**Detail**: The anon key is compiled into `dist/assets/index-*.js` and is visible in version control if `.env.local` was ever committed.
**Fix**: Ensure `.env.local` is in `.gitignore`. Rotate key if committed. Use deployment-time environment injection.

---

### Order RPC does not enforce server-side total recalculation
**File**: `src/context/DatabaseContext.tsx:501-528`
**Severity**: Medium
**Detail**: `CartContext` calculates discount client-side (`cartTotal = cartSubtotal - discountAmount`). If cart state is manipulated, wrong totals could be sent to RPC.
**Fix**: RPC must re-calculate all totals from authoritative DB sources (product prices, user discount_rate), ignoring client-provided amounts.

---

## 3. Input Validation

### No Zod validation on login/register forms
**File**: `src/pages/Login.tsx`, `src/pages/Register.tsx`
**Severity**: Medium
**Detail**: Forms use HTML5 type attributes only. No schema validation before submission.
**Fix**:
```typescript
const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Invalid credentials'),
});
```

---

### Checkout shipping form has minimal validation
**File**: `src/pages/Checkout.tsx:177-242`
**Severity**: Low
**Detail**: Phone number has no format validation. Zip code accepts any text. No length constraints on address fields.
**Fix**: Add Zod validation for phone format, zip code regex, and address length. Sanitize on server before storing.

---

### Contact form stores unvalidated input
**File**: `src/pages/Contact.tsx:55-79`
**Severity**: Medium
**Detail**: No validation. If data is stored in DB and displayed in admin panels without escaping, this is a stored XSS vector.
**Fix**: Add Zod validation. Sanitize all inputs server-side. Always escape user content when rendering in admin panels.

---

### Invitation code accepts any string format
**File**: `src/pages/Register.tsx:52`
**Severity**: Low
**Detail**: Code is uppercased but not validated for format (length, character set) before calling `validateCode` RPC.
**Fix**: Add: `code.length >= 6 && /^[A-Z0-9]+$/.test(code)` before calling RPC.

---

## 4. Environment & Secrets

### Supabase anon key committed or exposed in .env.local
**File**: `.env.local`
**Severity**: Critical
**Detail**: `.env.local` contains plaintext `VITE_SUPABASE_ANON_KEY`. Key is compiled into the production bundle.
**Fix**: Ensure `.env.local` is in `.gitignore`. Rotate key immediately if previously committed. Use deployment-time injection instead of committed `.env` files.

---

### Missing Supabase URL/key format validation
**File**: `src/lib/supabase.ts:6-8`
**Severity**: Medium
**Detail**: Env vars throw on missing but don't validate format. Invalid values silently fail.
**Fix**:
```typescript
if (!supabaseUrl.startsWith('https://')) throw new Error('Invalid Supabase URL');
if (!supabaseAnonKey.startsWith('eyJ')) throw new Error('Invalid anon key format');
```

---

## 5. Business Logic

### Discount rate calculated client-side, not verified by RPC
**File**: `src/context/CartContext.tsx:116-117`
**Severity**: High
**Detail**: `user?.discountRate` is fetched from local state. An attacker can modify localStorage or context state in DevTools to inflate discount.
**Fix**: `createSecureOrder` RPC must:
1. Fetch `discount_rate` from `profiles` table for `auth.uid()`
2. Fetch current prices from `products` table
3. Recalculate total server-side
4. Reject if client total doesn't match (within rounding tolerance)

---

### Partner creation allows arbitrary discount rate from frontend
**File**: `src/context/DatabaseContext.tsx:576-621`
**Severity**: High
**Detail**: `addPartner()` accepts `discountRate` from frontend without server-side range validation.
**Fix**:
```typescript
if (data.discountRate < 0 || data.discountRate > 50) {
  return { success: false, error: 'Discount rate must be 0-50%' };
}
```
Add audit logging for all discount rate changes.

---

### Order creation may not be atomic (stock + order in single transaction)
**File**: `src/context/DatabaseContext.tsx:501-528`
**Severity**: High
**Detail**: If RPC fails after order is created but before stock deduction (or vice versa), inventory and order state become inconsistent.
**Fix**: Ensure Supabase RPC uses a database transaction with `ROLLBACK` on any error.

---

### order_items price_at_purchase not validated against product price
**File**: `src/context/DatabaseContext.tsx:461-476`
**Severity**: Medium
**Detail**: RPC inserts `price_at_purchase` without verifying it matches current product price. Attacker could send artificially low prices.
**Fix**: RPC should fetch current price from `products` and reject if provided price deviates more than the allowed discount amount.

---

## 6. Client-Side Security

### Cart in localStorage is not validated on load
**File**: `src/context/CartContext.tsx:35-46`
**Severity**: Medium
**Detail**: Cart is loaded from `localStorage.goldentier_cart` without schema validation. User could inject malicious product objects.
**Fix**:
```typescript
const schema = z.array(z.object({
  product: z.object({ id: z.string(), price: z.number().positive() }),
  quantity: z.number().int().min(1).max(999),
}));
const parsed = schema.safeParse(stored);
if (!parsed.success) return [];
```

---

### IDOR vulnerability — UserDashboard filters orders client-side
**File**: `src/pages/dashboard/UserDashboard.tsx:32`
**Severity**: Critical
**Detail**: Orders are filtered by `user?.id` client-side. If RLS is not enforced on the `orders` table, users could see other users' orders.
**Fix**: Verify RLS policy:
```sql
CREATE POLICY "Users see only their own orders"
  ON orders FOR SELECT
  USING (customer_id = auth.uid());
```

---

### Error messages may enable user enumeration
**File**: `src/context/AuthContext.tsx:100`
**Severity**: Medium
**Detail**: `alert(error.message)` may return "User with this email already exists" or similar, leaking whether an email is registered.
**Fix**: Return generic "Invalid email or password" for all authentication failures regardless of cause.

---

## 7. Dependencies & Configuration

### No Content-Security-Policy headers configured
**Severity**: Medium
**Detail**: No CSP configuration visible in `vite.config.ts` or server configuration.
**Fix**: Add CSP headers to Vite dev server and production server. Start restrictive and loosen as needed.

---

### console.error in handlers may leak database structure
**File**: `src/context/DatabaseContext.tsx:59,353,384`
**Severity**: Low
**Detail**: `console.error()` calls may expose RPC error messages, table names, or SQL fragments to browser console.
**Fix**: Log only error codes/types to browser console. Full details should go to Supabase server logs only.

---

### Missing CSRF token implementation
**File**: `src/context/AuthContext.tsx`
**Severity**: Medium
**Detail**: Login/register/logout operations don't include explicit CSRF tokens. Supabase session cookies handle some of this, but verify `SameSite=Strict` is set.
**Fix**: Add CSRF token headers to all state-changing RPC calls.

---

## Summary — Priority Matrix

| Severity | Count | Issues |
|---|---|---|
| **Critical** | 5 | Anon key exposure, service-role client on frontend, IDOR in UserDashboard, RLS not verified, .env.local committed |
| **High** | 5 | Role escalation via invitation code, client-side auth bypass, discount manipulation, partner discount not validated, non-atomic stock/order |
| **Medium** | 10 | Alert error leakage, password policy, Zod missing, CSP, CSRF, order price manipulation, contact XSS, cart injection, user enumeration, url validation |
| **Low** | 7 | Email validation, invitation format, shipping validation, code format, console.error leakage, timing attacks, product visibility |

### Immediate Actions Required
1. Rotate Supabase anon key if `.env.local` was ever committed to git
2. Verify RLS on `orders` table prevents IDOR (UserDashboard)
3. Ensure `createSecureOrder` RPC recalculates all totals server-side
4. Move service-role operations to Edge Functions or secure backend
5. Implement Zod schemas on all forms (Login, Register, Checkout, Contact)
6. Add generic error responses to prevent user enumeration
7. Audit all RPC functions for atomic transaction usage
