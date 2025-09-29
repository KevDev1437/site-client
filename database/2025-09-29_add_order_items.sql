-- Migration: add order_items table + supporting indexes and RLS policies (if desired)
-- NOTE: Adjust schema if you already manage migrations elsewhere.

begin;

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  unit_amount integer not null check (unit_amount >= 0), -- amount in cents
  currency text not null default 'eur',
  created_at timestamptz default now()
);

-- Helpful index for joins
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- Ensure we can’t duplicate same product twice for same order without intent
create unique index if not exists uniq_order_items_order_product on public.order_items(order_id, product_id);

-- Optional RLS (uncomment if RLS enabled globally)
-- alter table public.order_items enable row level security;
-- create policy "Order items belong to user" on public.order_items
--   for select using ( exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()) );

commit;
