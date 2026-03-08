# Bug Fix Specification — App.tsx JSX Closing Tag Error

**Date:** 2026-03-08
**Reporter:** Juno (Planning)
**Severity:** CRITICAL — blocks all builds

---

## Root Cause

File: `src/App.tsx`, line 174
Babel/Vite error: `Expected corresponding JSX closing tag for <ProtectedRoute>`

### Exact diff required (Engineering to apply):

```diff
-              </PartnerDashboard>
+              </ProtectedRoute>
```

Context (lines 169–176):
```tsx
<Route
  path="/partner/*"
  element={
    <ProtectedRoute requirePartner={true}>
      <PartnerDashboard />
-   </PartnerDashboard>   // ← WRONG: orphaned closing tag from PartnerDashboard
+   </ProtectedRoute>     // ← CORRECT
    }
  />
```

No other structural changes are needed for this fix. The rest of `App.tsx` is syntactically correct.

---

## S2 — Route Coverage Audit Checklist

After the fix is applied and the build runs clean, QA/Design should verify:

| Route | ProtectedRoute props | Expected redirect if denied |
|-------|---------------------|----------------------------|
| `/admin/*` | `requireAdmin={true}` | → `/` |
| `/partner/*` | `requirePartner={true}` | → `/` |
| `/dashboard/*` | (none — any authenticated user) | → `/login` if unauth |
| `/checkout` | `requirePartner={true}` | → `/` |
| `/login`, `/register` | (redirects to `/` if already authenticated) | ✓ |
| `/forgot-password`, `/reset-password` | (open) | ✓ |

### Checklist items for QA sign-off:
- [ ] `admin` role user can access `/admin/*`, is blocked from `/partner/*`
- [ ] `partner` role user can access `/partner/*` and `/checkout`, cannot access `/admin/*`
- [ ] `customer` role user can access `/dashboard/*`, is blocked from `/admin/*` and `/partner/*`
- [ ] Unauthenticated user sees only `LandingPage` (all `/` sub-paths catch-all)
- [ ] Password recovery flow (`type=recovery` hash) renders `ResetPassword` regardless of auth state
- [ ] `CartSidebar` is only mounted when `isPartner === true`

---

## Engineering Action (one-line fix)

```
src/App.tsx:174  change  </PartnerDashboard>  →  </ProtectedRoute>
```

No other files need changes for this bug.
