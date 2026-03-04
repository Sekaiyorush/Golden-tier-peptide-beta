---
name: db-migration
description: Create and apply Supabase database migrations for Golden Tier Peptide. Use when adding tables, columns, indexes, RLS policies, triggers, or RPCs. Generates properly formatted SQL migration files with the correct timestamp naming.
disable-model-invocation: true
argument-hint: "[description of the migration]"
allowed-tools: Bash, Read, Write
---

# Database Migration — Golden Tier Peptide

Create and apply a Supabase migration for: **$ARGUMENTS**

## Supabase Project
- Project ID: `lgyavqiqbblozvlwzqsj`
- Migrations folder: `supabase/migrations/`

## Step 1 — Generate timestamp and filename
```bash
# Get current timestamp in migration format
date +"%Y%m%d%H%M%S"
```
Use the output as the prefix: `YYYYMMDDHHMMSS_descriptive_name.sql`

## Step 2 — Check existing schema for context
Read relevant existing migrations to understand current schema:
```bash
ls supabase/migrations/ | tail -10
```
Read the most recent migrations to understand current state.

## Step 3 — Write the migration file

Create `supabase/migrations/TIMESTAMP_description.sql` following these rules:

### Required structure:
```sql
-- Migration: descriptive_name
-- Description: What this migration does and why

-- ============================================================
-- CHANGES
-- ============================================================

-- 1. [Description of change 1]
[SQL HERE]

-- 2. [Description of change 2]
[SQL HERE]

-- ============================================================
-- RLS POLICIES (if new table)
-- ============================================================

ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "admins_all" ON new_table
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- INDEXES (if needed)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_new_table_user_id ON new_table(user_id);
```

### Safety rules for the SQL:
- Use `IF NOT EXISTS` on CREATE TABLE, CREATE INDEX
- Use `IF NOT EXISTS` on ADD COLUMN: `ALTER TABLE t ADD COLUMN IF NOT EXISTS col type`
- Use `CREATE OR REPLACE` for functions/triggers
- Wrap destructive operations (DROP, DELETE) in explicit transactions
- Never DROP columns in production — use deprecation comments instead
- Monetary fields: always `numeric(10,2) NOT NULL DEFAULT 0`
- Timestamps: always `TIMESTAMPTZ DEFAULT now()` (not TIMESTAMP)
- UUIDs: `UUID DEFAULT gen_random_uuid()` for new PKs

## Step 4 — Apply to Supabase
Use the Supabase MCP tool to apply the migration:
- Tool: `apply_migration`
- project_id: `lgyavqiqbblozvlwzqsj`
- name: the descriptive snake_case name (without timestamp)
- query: the full SQL content

## Step 5 — Verify with SQL
After applying, run a verification query to confirm the change:
```sql
-- For new tables:
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'new_table_name' ORDER BY ordinal_position;

-- For new policies:
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'table_name';

-- For new indexes:
SELECT indexname FROM pg_indexes WHERE tablename = 'table_name';
```

## Common Migration Templates

### Add a new column:
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS new_field TEXT;
```

### Add a new RLS policy:
```sql
CREATE POLICY "policy_name" ON table_name
  FOR SELECT USING (user_id = auth.uid());
```

### Add a trigger:
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON table_name;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON table_name
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Add a new table (full template):
```sql
CREATE TABLE IF NOT EXISTS new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_all" ON new_table FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "users_own" ON new_table FOR SELECT
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_new_table_user_id ON new_table(user_id);
CREATE INDEX IF NOT EXISTS idx_new_table_status ON new_table(status);
```
