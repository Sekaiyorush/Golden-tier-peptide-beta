# Strategic Remediation Plan for Backend/Security Fixes

**Owner:** Development (Bolt)
**Date:** 2026-03-09

## Overview
This document outlines the technical strategy for addressing the remaining high and critical backend and security vulnerabilities identified in the audit. Immediate mitigations have been applied where feasible without infrastructure changes.

## Implemented Mitigations (Concrete Diffs Produced)
1. **Content-Security-Policy (CSP):** Added robust CSP headers to `vite.config.ts` to mitigate XSS risks.
2. **Contact Form Validation:** Implemented Zod schema validation (`ContactSchema`) in `src/pages/Contact.tsx` to prevent unvalidated input and mitigate stored XSS.
3. **Supabase Environment Validation:** Updated `src/lib/supabase.ts` to explicitly `throw new Error` if the URL or anon key formats are invalid, preventing silent failures.

## Phase 1: Architectural Security Refactoring (Requires Infrastructure Updates)

### 1. Removing Frontend Service/Temp Clients
**Issue:** `src/context/DatabaseContext.tsx` uses a temporary Supabase client to create users/partners, which is an anti-pattern and security risk.
**Remediation Strategy:**
- Create a Supabase Edge Function (`create-partner`) utilizing the Service Role Key.
- Update `addPartner` in `DatabaseContext.tsx` to call this Edge Function via `supabase.functions.invoke()`.
- Ensure the Edge Function enforces authorization by verifying the calling user's JWT has the `admin` role before processing.

### 2. Enforcing Server-Side Role Assignments
**Issue:** `AuthContext.tsx` uses client-side RPC responses to determine and assign roles during registration.
**Remediation Strategy:**
- Enhance the `validate_invitation_code` RPC or introduce a `register_with_invitation` RPC that automatically assigns the correct role inside a secure Postgres transaction.
- Do not trust client-provided role strings or rely on client-side state mapping.

### 3. Securing Protected Routes via RLS
**Issue:** `App.tsx` handles `ProtectedRoute` solely via client-side state (`isAdmin`, `isPartner`), allowing potential bypass via DevTools.
**Remediation Strategy:**
- Verify and audit Row Level Security (RLS) policies on all tables (`orders`, `profiles`, `products`).
- Ensure that even if a user bypasses the client-side route, all Supabase data fetching automatically rejects unauthorized access (e.g., `orders` table only returns rows where `customer_id = auth.uid()` or the user is an admin).

### 4. Password Policy Enforcement
**Issue:** Password strength is only validated via Zod on the frontend.
**Remediation Strategy:**
- Enable Supabase Auth password complexity requirements in the Supabase Dashboard (Auth -> Providers -> Email -> Password Length/Characters).
- Alternatively, implement a Postgres trigger on `auth.users` to enforce complexity via regular expressions before insert/update.

## Phase 2: Refactoring Data Layer
### 1. DatabaseContext Decoupling
**Issue:** `DatabaseContext.tsx` is monolithic and handles mixed domains (Products, Orders, Partners).
**Remediation Strategy:**
- Split into `useProducts`, `useOrders`, and `usePartners` hooks using React Query or SWR for better caching, memoization, and scoped error handling.
- Eliminate full `loadData()` reloads after specific RPCs to prevent race conditions.

## Next Steps
- Provision Edge Functions structure in the repository (`supabase/functions/`).
- Audit and adjust all `CREATE POLICY` statements in `supabase/migrations/`.
