---
name: supabase-best-practices
description: Supabase + Postgres best practices for Golden Tier Peptide. Auto-activates when writing SQL migrations, RLS policies, RPCs, database queries, or any Supabase-related code. Covers schema design, RLS, triggers, RPCs, and connection patterns.
user-invocable: false
---

# Supabase Best Practices — Golden Tier Peptide

## Project Context
- Supabase project ID: `lgyavqiqbblozvlwzqsj`
- All tables use RLS (Row Level Security) — never disable it
- Monetary fields use `numeric(10,2)` — never `float` or `decimal`
- Auth extends `auth.users` via `profiles` table
- `handle_new_user()` trigger auto-creates profile on signup

## Schema Conventions
- Always add `created_at TIMESTAMPTZ DEFAULT now()` and `updated_at TIMESTAMPTZ DEFAULT now()` to new tables
- Primary keys: use `UUID DEFAULT gen_random_uuid()` for new tables
- Foreign keys: always add explicit `ON DELETE` behavior (CASCADE or RESTRICT)
- Monetary fields: always `numeric(10,2)` — example: `price numeric(10,2) NOT NULL DEFAULT 0`
- Enum-like fields: use `TEXT` with a CHECK constraint, not Postgres ENUM types (they're hard to migrate)
- JSONB fields: add a GIN index for frequent queries — `CREATE INDEX ON table USING GIN(field)`

## RLS Policies

### Always enable RLS on new tables:
```sql
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
```

### Standard policy patterns for this project:
```sql
-- Admins can do everything
CREATE POLICY "admins_all" ON table_name
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can read their own rows
CREATE POLICY "users_own_read" ON table_name
  FOR SELECT USING (user_id = auth.uid());

-- Partners can read active products
CREATE POLICY "partners_read_products" ON products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('partner', 'admin'))
  );
```

### RLS Performance — critical rules:
- Use `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = ...)` not `(SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'`
- The `EXISTS` form short-circuits and is faster
- Never use functions with SECURITY DEFINER in RLS policies unless absolutely required
- Avoid calling `auth.uid()` multiple times in a single policy — it's a function call each time

## RPCs (Database Functions)

### Use `SECURITY DEFINER` carefully:
```sql
-- Safe pattern: validate inputs, use SECURITY DEFINER only when needed
CREATE OR REPLACE FUNCTION create_secure_order(...)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public  -- always set search_path with SECURITY DEFINER
AS $$
BEGIN
  -- Always validate the caller identity inside the function
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  -- ... rest of logic
END;
$$;
```

### Prefer RPCs for:
- Multi-table writes that must be atomic (orders + order_items + stock deduction)
- Operations that bypass RLS for legitimate admin reasons
- Complex queries that would require multiple round-trips from the client

## Indexes

Always add indexes for:
```sql
-- Foreign keys (Postgres doesn't auto-index FKs)
CREATE INDEX ON order_items(order_id);
CREATE INDEX ON order_items(product_id);

-- Frequently filtered columns
CREATE INDEX ON orders(user_id);
CREATE INDEX ON orders(status);
CREATE INDEX ON products(sku);  -- already unique but explicit is good
CREATE INDEX ON profiles(role); -- for RLS policy lookups
```

## Migrations

### File naming: always timestamped
```
supabase/migrations/YYYYMMDDHHMMSS_descriptive_name.sql
```

### Migration safety rules:
- Never DROP COLUMN in production without a deprecation period
- Always use `IF NOT EXISTS` for CREATE TABLE/INDEX
- Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for additive migrations
- Test migrations on a branch before applying to production
- Wrap destructive operations in a transaction

### Audit trail — use `logAudit()` in DatabaseContext for admin actions

## Connection & Client

### Always use the Supabase client from context — never create a new one:
```typescript
// ✅ Correct — use from context
import { useDatabase } from '@/context/DatabaseContext';
const { supabase } = useDatabase();

// ❌ Wrong — never instantiate directly in components
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(...);
```

### Error handling pattern:
```typescript
const { data, error } = await supabase.from('products').select('*');
if (error) {
  console.error('Supabase error:', error.message);
  throw error; // or handle gracefully
}
```

## Query Performance

- Always `SELECT` only needed columns — avoid `SELECT *` in production queries
- Use `.single()` when expecting exactly one row (throws on 0 or 2+ rows)
- Use `.maybeSingle()` when the row may not exist (returns null instead of throwing)
- For paginated queries use `.range(from, to)` not `.limit()` alone
- Filter on indexed columns whenever possible

## Trigger Pattern (existing in this project)
```sql
-- The handle_new_user trigger pattern already used:
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, email, role, status)
  VALUES (NEW.id, NEW.email, 'customer', 'active');
  RETURN NEW;
END;
$$;
```
When adding new tables that need auto-population on user creation, follow this same trigger pattern.
