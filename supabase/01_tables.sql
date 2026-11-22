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
  unit text not null default 'g',
  cost_per_unit numeric(12, 4) not null default 0 check (cost_per_unit >= 0),
  supplier text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.branches (name, location, is_active)
values ('Main Branch', null, true)
on conflict do nothing;

create table if not exists public.branch_inventory (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  current_stock numeric(12, 2) not null default 0 check (current_stock >= 0),
  reorder_level numeric(12, 2) not null default 0 check (reorder_level >= 0),
  updated_at timestamptz not null default now(),
  unique (branch_id, ingredient_id)
);

do $$
declare
  v_main_id uuid;
begin
  select id into v_main_id
  from public.branches
  where name = 'Main Branch'
  order by created_at
  limit 1;

  if v_main_id is null then
    insert into public.branches (name, location, is_active)
    values ('Main Branch', null, true)
    returning id into v_main_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'ingredients'
      and column_name = 'current_stock'
  ) then
    execute '
      insert into public.branch_inventory (branch_id, ingredient_id, current_stock, reorder_level)
      select $1, id, coalesce(current_stock, 0), coalesce(reorder_level, 0)
      from public.ingredients
      on conflict (branch_id, ingredient_id) do update
      set current_stock = excluded.current_stock,
          reorder_level = excluded.reorder_level,
          updated_at = now()
    ' using v_main_id;
  end if;

  insert into public.branch_inventory (branch_id, ingredient_id)
  select b.id, i.id
  from public.branches b
  cross join public.ingredients i
  on conflict (branch_id, ingredient_id) do nothing;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'ingredients'
      and column_name = 'current_stock'
  ) then
    alter table public.ingredients drop column current_stock;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'ingredients'
      and column_name = 'reorder_level'
  ) then
    alter table public.ingredients drop column reorder_level;
  end if;
end;
$$;

alter table public.ingredients
  drop constraint if exists ingredients_unit_check;
alter table public.ingredients
  add constraint ingredients_unit_check
  check (unit in ('g', 'kg', 'ml', 'pcs'));

-- Normalize legacy Sprite pricing when it was entered as a per-kilogram value
-- while the ingredient remained stored in grams.
update public.ingredients
   set cost_per_unit = 0.09,
       updated_at = now()
 where lower(trim(name)) = 'sprite'
   and unit = 'g'
   and cost_per_unit = 90;

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
  branch_id uuid references public.branches(id) on delete set null,
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

alter table public.stock_logs
  add column if not exists branch_id uuid references public.branches(id) on delete set null;

do $$
declare
  v_main_id uuid;
begin
  select id into v_main_id
  from public.branches
  where name = 'Main Branch'
  order by created_at
  limit 1;

  update public.stock_logs
  set branch_id = v_main_id
  where branch_id is null;

  if v_main_id is not null then
    alter table public.stock_logs alter column branch_id set not null;
  end if;
end;
$$;

alter table public.stock_logs
  drop constraint if exists stock_logs_type_check;
alter table public.stock_logs
  add constraint stock_logs_type_check
  check (type in ('stock_in', 'usage', 'spoilage', 'adjustment', 'transfer_out', 'transfer_in'));

create index if not exists ingredients_category_idx on public.ingredients (category);
create index if not exists ingredients_name_idx on public.ingredients (name);
create index if not exists recipe_items_drink_idx on public.recipe_items (drink_id);
create index if not exists recipe_items_ingredient_idx on public.recipe_items (ingredient_id);
create index if not exists stock_logs_created_idx on public.stock_logs (created_at desc);
create index if not exists stock_logs_type_idx on public.stock_logs (type);
create index if not exists stock_logs_ingredient_idx on public.stock_logs (ingredient_id);
create index if not exists branch_inventory_branch_idx on public.branch_inventory (branch_id);
create index if not exists branch_inventory_ingredient_idx on public.branch_inventory (ingredient_id);
create index if not exists stock_logs_branch_idx on public.stock_logs (branch_id);

create or replace function public.create_branch_inventory()
returns trigger
language plpgsql
as $$
begin
  insert into public.branch_inventory (branch_id, ingredient_id)
  select new.id, i.id
  from public.ingredients i
  on conflict (branch_id, ingredient_id) do nothing;
  return new;
end;
$$;

drop trigger if exists branches_create_inventory on public.branches;
create trigger branches_create_inventory
after insert on public.branches
for each row execute function public.create_branch_inventory();

create or replace function public.create_ingredient_inventory()
returns trigger
language plpgsql
as $$
begin
  insert into public.branch_inventory (branch_id, ingredient_id)
  select b.id, new.id
  from public.branches b
  on conflict (branch_id, ingredient_id) do nothing;
  return new;
end;
$$;

drop trigger if exists ingredients_create_inventory on public.ingredients;
create trigger ingredients_create_inventory
after insert on public.ingredients
for each row execute function public.create_ingredient_inventory();

drop trigger if exists ingredients_set_updated_at on public.ingredients;
create trigger ingredients_set_updated_at
before update on public.ingredients
for each row execute function public.set_updated_at();

drop trigger if exists drinks_set_updated_at on public.drinks;
create trigger drinks_set_updated_at
before update on public.drinks
for each row execute function public.set_updated_at();
