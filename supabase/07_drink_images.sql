-- BrewStock · Drink images
-- Run once on projects that have already applied the earlier SQL files.

begin;

alter table public.drinks
  add column if not exists image_url text;

drop function if exists public.upsert_recipe(uuid, text, text, numeric, jsonb);

create or replace function public.upsert_recipe(
  p_drink_id uuid default null,
  p_name text default null,
  p_category text default 'Other',
  p_price numeric default 0,
  p_items jsonb default '[]'::jsonb,
  p_image_url text default null
)
returns public.drinks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_drink public.drinks%rowtype;
  v_item jsonb;
  v_ingredient_id uuid;
  v_quantity numeric;
begin
  if p_name is null or btrim(p_name) = '' then
    raise exception 'Drink name is required';
  end if;

  if p_category is null or btrim(p_category) = '' then
    raise exception 'Drink category is required';
  end if;

  if p_price is null or p_price < 0 then
    raise exception 'Price cannot be negative';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Add at least one recipe ingredient';
  end if;

  if p_drink_id is null then
    insert into public.drinks (name, category, price, image_url, is_active)
    values (btrim(p_name), btrim(p_category), p_price, p_image_url, true)
    returning * into v_drink;
  else
    select * into v_drink
      from public.drinks
     where id = p_drink_id
     for update;

    if not found then
      raise exception 'Drink not found';
    end if;

    update public.drinks
       set name = btrim(p_name),
           category = btrim(p_category),
           price = p_price,
           image_url = p_image_url,
           updated_at = now()
     where id = p_drink_id
    returning * into v_drink;

    delete from public.recipe_items where drink_id = p_drink_id;
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_ingredient_id := nullif(v_item ->> 'ingredient_id', '')::uuid;
    v_quantity := nullif(v_item ->> 'quantity', '')::numeric;

    if v_ingredient_id is null then
      raise exception 'Choose a valid ingredient';
    end if;

    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Ingredient quantity must be greater than zero';
    end if;

    if not exists (
      select 1
      from public.ingredients
      where id = v_ingredient_id
        and is_active = true
    ) then
      raise exception 'Ingredient not found or inactive';
    end if;

    insert into public.recipe_items (drink_id, ingredient_id, quantity)
    values (v_drink.id, v_ingredient_id, v_quantity)
    on conflict (drink_id, ingredient_id) do update
      set quantity = excluded.quantity;
  end loop;

  return v_drink;
end;
$$;

grant execute on function public.upsert_recipe(uuid, text, text, numeric, jsonb, text)
  to anon, authenticated;

drop function if exists public.upsert_drink(uuid, text, text, numeric);

create or replace function public.upsert_drink(
  p_drink_id uuid default null,
  p_name text default null,
  p_category text default 'Other',
  p_price numeric default 0,
  p_image_url text default null
)
returns public.drinks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_drink public.drinks%rowtype;
begin
  if p_name is null or btrim(p_name) = '' then
    raise exception 'Drink name is required';
  end if;

  if p_category is null or btrim(p_category) = '' then
    raise exception 'Drink category is required';
  end if;

  if p_price is null or p_price < 0 then
    raise exception 'Price cannot be negative';
  end if;

  if p_drink_id is null then
    insert into public.drinks (name, category, price, image_url, is_active)
    values (btrim(p_name), btrim(p_category), p_price, p_image_url, true)
    returning * into v_drink;
  else
    update public.drinks
       set name = btrim(p_name),
           category = btrim(p_category),
           price = p_price,
           image_url = p_image_url,
           updated_at = now()
     where id = p_drink_id
    returning * into v_drink;

    if not found then
      raise exception 'Drink not found';
    end if;
  end if;

  return v_drink;
end;
$$;

grant execute on function public.upsert_drink(uuid, text, text, numeric, text)
  to anon, authenticated;

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'drink-images',
  'drink-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read drink images" on storage.objects;
create policy "Public can read drink images" on storage.objects
  for select to public using (bucket_id = 'drink-images');

drop policy if exists "BrewStock can upload drink images" on storage.objects;
create policy "BrewStock can upload drink images" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'drink-images');

notify pgrst, 'reload schema';

commit;
