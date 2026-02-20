-- Golden Tier Peptide: Initial Supabase Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (Extends default Supabase Auth User)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text check (role in ('admin', 'partner', 'customer')) default 'customer',
  phone_number text,
  company_name text,
  
  -- Partner-specific fields
  discount_rate integer default 0,
  total_purchases numeric default 0,
  total_resold numeric default 0,
  status text check (status in ('active', 'inactive', 'pending')) default 'pending',
  invited_by uuid references public.profiles(id),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;
create policy "Users can view their own profile." on public.profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles." on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 2. Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  sku text unique not null,
  name text not null,
  description text,
  full_description text,
  price numeric not null,
  category text not null,
  purity text,
  in_stock boolean default true,
  stock_quantity integer default 0,
  benefits text[],
  dosage text,
  image_url text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Products
alter table public.products enable row level security;
create policy "Products are viewable by everyone." on public.products for select using (true);
create policy "Admins can insert/update products." on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 3. Invitation Codes
create table public.invitation_codes (
  code text primary key,
  role text check (role in ('partner', 'customer')) not null,
  created_by uuid references public.profiles(id),
  max_uses integer default 1,
  current_uses integer default 0,
  expires_at timestamp with time zone,
  is_active boolean default true,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Invitation Codes
alter table public.invitation_codes enable row level security;
create policy "Admins can manage invitation codes." on public.invitation_codes for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Anyone can select active codes." on public.invitation_codes for select using (is_active = true);


-- 4. Orders
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  friendly_id text not null unique, -- e.g., 'ORD-2024-001'
  customer_id uuid references public.profiles(id) not null,
  total_amount numeric not null,
  status text check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) default 'pending',
  payment_status text check (payment_status in ('pending', 'paid', 'failed')) default 'pending',
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Orders
alter table public.orders enable row level security;
create policy "Users can view their own orders." on public.orders for select using (auth.uid() = customer_id);
create policy "Users can insert their own orders." on public.orders for insert with check (auth.uid() = customer_id);
create policy "Admins can view and update all orders." on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 5. Order Items
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null check (quantity > 0),
  price_at_purchase numeric not null, -- To freeze the price at the time of purchase
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Order Items
alter table public.order_items enable row level security;
create policy "Users can view their own order items." on public.order_items for select using (
  exists (select 1 from public.orders where id = order_items.order_id and customer_id = auth.uid())
);
create policy "Users can insert their own order items." on public.order_items for insert with check (
  exists (select 1 from public.orders where id = order_items.order_id and customer_id = auth.uid())
);
create policy "Admins can manage all order items." on public.order_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
