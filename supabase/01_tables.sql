-- BrewStock · 01 tables
-- Run this first in the Supabase SQL editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Other',
  unit text not null default 'g' check (unit in ('g', 'ml', 'pcs')),
  current_stock numeric(12, 2) not null default 0 check (current_stock >= 0),
  reorder_level numeric(12, 2) not null default 0 check (reorder_level >= 0),
  cost_per_unit numeric(12, 4) not null default 0 check (cost_per_unit >= 0),
  supplier text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.drinks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Other',
  price numeric(10, 2) not null default 0 check (price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipe_items (
  id uuid primary key default gen_random_uuid(),
  drink_id uuid not null references public.drinks(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  quantity numeric(12, 2) not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (drink_id, ingredient_id)
);

create table if not exists public.stock_logs (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  drink_id uuid references public.drinks(id) on delete set null,
  change_amount numeric(12, 2) not null check (change_amount <> 0),
  type text not null check (type in ('stock_in', 'usage', 'spoilage', 'adjustment')),
  note text,
  supplier text,
  previous_stock numeric(12, 2) not null check (previous_stock >= 0),
  new_stock numeric(12, 2) not null check (new_stock >= 0),
  cups_sold integer check (cups_sold is null or cups_sold >= 0),
  created_at timestamptz not null default now()
);

create index if not exists ingredients_category_idx on public.ingredients (category);
create index if not exists ingredients_name_idx on public.ingredients (name);
create index if not exists recipe_items_drink_idx on public.recipe_items (drink_id);
create index if not exists recipe_items_ingredient_idx on public.recipe_items (ingredient_id);
create index if not exists stock_logs_created_idx on public.stock_logs (created_at desc);
create index if not exists stock_logs_type_idx on public.stock_logs (type);
create index if not exists stock_logs_ingredient_idx on public.stock_logs (ingredient_id);

drop trigger if exists ingredients_set_updated_at on public.ingredients;
create trigger ingredients_set_updated_at
before update on public.ingredients
for each row execute function public.set_updated_at();

drop trigger if exists drinks_set_updated_at on public.drinks;
create trigger drinks_set_updated_at
before update on public.drinks
for each row execute function public.set_updated_at();
