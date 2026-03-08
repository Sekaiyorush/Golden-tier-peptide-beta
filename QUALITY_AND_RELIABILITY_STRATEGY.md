# Quality & Reliability Strategy — Golden Tier Peptide

**Owner:** Clio (Senior Planning)  
**Status:** Strategic Proposal (Round 1)  
**Target:** 100% Reliability on Critical User Paths

---

## 1. Current State Assessment (Audit Verification)

As part of the "Test My Website" initiative, we have audited the current implementation against the original `SECURITY_AUDIT.md`.

### ✅ Resolved / Partially Addressed
*   **IDOR Vulnerability:** Verified RLS (Row Level Security) is enabled on `orders` and `profiles` tables. Data isolation is now enforced at the database level.
*   **Input Validation:** `Login.tsx` and `Register.tsx` now implement **Zod schemas** for strict client-side validation.
*   **Secure Transactions:** `create_secure_order` RPC has been implemented to move total recalculation and stock deduction to the server side, preventing price manipulation.
*   **User Enumeration:** `AuthContext.tsx` now returns generic error messages for login failures.
*   **Rate Limiting:** Server-side rate limiting has been added for Login, Register, and Password Reset flows.

### ⚠️ Remaining Gaps (Priority Fixes)
*   **Atomic Registration:** The registration flow is currently a multi-step process (`signUp` -> `profile insert` -> `use code RPC`). A failure in middle steps can leave accounts in a broken state.
*   **E2E Coverage:** Zero automated End-to-End tests exist for the critical checkout and registration flows.
*   **A11y (Accessibility):** Premium components (GoldenMolecule, etc.) lack ARIA labels and keyboard navigation support.
*   **Performance:** Radial gradients and high-res brand logos need optimization for Core Web Vitals (LCP).

---

## 2. Testing Tiers & Expansion Roadmap

To ensure the "Golden Tier" experience is flawless, we are implementing a three-tiered testing strategy.

### Tier 1: Unit & Integration (Expansion)
*   **Tool:** Vitest + React Testing Library.
*   **Goal:** 70% Code Coverage.
*   **Priority:**
    *   `CartContext.tsx`: Logic for quantity updates and discount application.
    *   `DatabaseContext.tsx`: Data mapping and optimistic update logic.
    *   `formatPrice.ts` / `formatDate.ts`: Utility function reliability.

### Tier 2: E2E (End-to-End) — *Recommended Addition*
*   **Tool:** Playwright (to be installed).
*   **Critical Paths to Automate:**
    1.  **Guest -> Register (Partner) -> Checkout:** Complete flow from invitation to order confirmation.
    2.  **Admin -> Product Management:** CRUD operations for the catalog.
    3.  **Cross-Browser Verification:** Ensuring luxury animations work on Safari/Mobile.

### Tier 3: Visual & UX Regression
*   **Goal:** Prevent visual "drift" in brand-sensitive components.
*   **Implementation:** Visual regression testing for the `Hero` and `ProductCard` components to ensure the Gold/Luxury aesthetic remains consistent across builds.

---

## 3. User Acceptance Testing (UAT) Scenarios

We define "Quality" as successful completion of the following high-value user stories:

| Scenario ID | User Role | Goal | Success Criteria |
|---|---|---|---|
| **UAT-01** | Partner | Register with Code | Receives 20% default discount immediately upon first login. |
| **UAT-02** | Customer | Secure Checkout | Order total exactly matches (Price * Qty) - Discount in Supabase. |
| **UAT-03** | Admin | Inventory Log | "Adjustment" entry correctly updates `stock_quantity` across all views. |
| **UAT-04** | All | Error Recovery | Database disconnect shows a branded "Maintenance" state instead of a white screen. |

---

## 4. Performance & Luxury Audit Targets

*   **LCP (Largest Contentful Paint):** < 1.5s (Critical for retention on a high-end site).
*   **CLS (Cumulative Layout Shift):** < 0.1 (Preventing "jumping" UI during logo loading).
*   **Interaction to Next Paint (INP):** < 200ms (Smooth response on the "Add to Cart" action).

---

## 5. Next Steps for Engineering & QA

1.  **[QA] Execute Round 1 Manual Audit:** Using the `QA_CHECKLIST.md` against the production staging environment.
2.  **[Dev] Install Playwright:** Initialize E2E infrastructure.
3.  **[Dev] Refactor Registration:** Wrap registration steps in a single Supabase RPC function for atomicity.
4.  **[Design] Asset Optimization:** Compress luxury images and move brand tokens to a central CSS variable system.
