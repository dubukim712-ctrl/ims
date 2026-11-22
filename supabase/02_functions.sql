-- BrewStock · 02 database functions (RPCs)
-- Run after 01_tables.sql.

-- Atomically add a delivery to stock and write an audit log.
create or replace function public.stock_in_ingredient(
  p_branch_id uuid,
  p_ingredient_id uuid,
  p_quantity numeric,
  p_supplier text default null,
  p_note text default null
)
returns public.stock_logs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ingredient public.ingredients%rowtype;
  v_inventory public.branch_inventory%rowtype;
  v_log public.stock_logs%rowtype;
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero';
  end if;

  select * into v_ingredient
    from public.ingredients
   where id = p_ingredient_id
   for update;

  if not found then
    raise exception 'Ingredient not found';
  end if;

  select * into v_inventory
    from public.branch_inventory
   where branch_id = p_branch_id
     and ingredient_id = p_ingredient_id
   for update;

  if not found then
    raise exception 'Ingredient is not available in this branch';
  end if;

  update public.branch_inventory
     set current_stock = current_stock + p_quantity,
         updated_at = now()
   where branch_id = p_branch_id
     and ingredient_id = p_ingredient_id;

  update public.ingredients
     set supplier = coalesce(nullif(trim(p_supplier), ''), supplier),
         updated_at = now()
   where id = p_ingredient_id;

  insert into public.stock_logs (
    branch_id, ingredient_id, change_amount, type, note, supplier, previous_stock, new_stock
  ) values (
    p_branch_id,
    p_ingredient_id,
    p_quantity,
    'stock_in',
    nullif(trim(p_note), ''),
    nullif(trim(p_supplier), ''),
    v_inventory.current_stock,
    v_inventory.current_stock + p_quantity
  )
  returning * into v_log;

  return v_log;
end;
$$;

-- Atomically apply a spoilage write-off or a signed stock adjustment.
create or replace function public.adjust_ingredient_stock(
  p_branch_id uuid,
  p_ingredient_id uuid,
  p_change numeric,
  p_type text,
  p_note text default null
)
returns public.stock_logs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ingredient public.ingredients%rowtype;
  v_inventory public.branch_inventory%rowtype;
  v_log public.stock_logs%rowtype;
  v_message text;
begin
  if p_change is null or p_change = 0 then
    raise exception 'Adjustment amount cannot be zero';
  end if;

  if p_type not in ('spoilage', 'adjustment') then
    raise exception 'Type must be spoilage or adjustment';
  end if;

  select * into v_ingredient
    from public.ingredients
   where id = p_ingredient_id
   for update;

  if not found then
    raise exception 'Ingredient not found';
  end if;

  select * into v_inventory
    from public.branch_inventory
   where branch_id = p_branch_id
     and ingredient_id = p_ingredient_id
   for update;

  if not found then
    raise exception 'Ingredient is not available in this branch';
  end if;

  if v_inventory.current_stock + p_change < 0 then
    v_message := format(
      'Not enough stock: %s has %s %s, cannot apply %s',
      v_ingredient.name,
      v_inventory.current_stock,
      v_ingredient.unit,
      p_change
    );
    raise exception '%', v_message;
  end if;

  update public.branch_inventory
     set current_stock = current_stock + p_change,
         updated_at = now()
   where branch_id = p_branch_id
     and ingredient_id = p_ingredient_id;

  insert into public.stock_logs (
    branch_id, ingredient_id, change_amount, type, note, previous_stock, new_stock
  ) values (
    p_branch_id,
    p_ingredient_id,
    p_change,
    p_type,
    nullif(trim(p_note), ''),
    v_inventory.current_stock,
    v_inventory.current_stock + p_change
  )
  returning * into v_log;

  return v_log;
end;
$$;

-- Bulk "Cups sold today": deducts every recipe ingredient in one transaction.
create or replace function public.log_daily_drink_usage(p_branch_id uuid, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_drink public.drinks%rowtype;
  v_recipe record;
  v_ingredient public.ingredients%rowtype;
  v_inventory public.branch_inventory%rowtype;
  v_cups integer;
  v_required numeric(12, 2);
  v_drinks_logged integer := 0;
  v_ingredients_deducted integer := 0;
  v_message text;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'No drinks were submitted';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_cups := coalesce((v_item ->> 'cups_sold')::integer, 0);
    continue when v_cups <= 0;

    if v_cups > 500 then
      raise exception 'Cups sold looks too high (maximum 500 per drink)';
    end if;

    select * into v_drink
      from public.drinks
     where id = (v_item ->> 'drink_id')::uuid
       and is_active = true;

    if not found then
      raise exception 'Drink not found or inactive: %', v_item ->> 'drink_id';
    end if;

    if not exists (select 1 from public.recipe_items where drink_id = v_drink.id) then
      v_message := format(
        'No recipe configured for %s. Add recipe items before logging cups.',
        v_drink.name
      );
      raise exception '%', v_message;
    end if;

    for v_recipe in
      select ingredient_id, quantity
        from public.recipe_items
       where drink_id = v_drink.id
    loop
      v_required := round(v_recipe.quantity * v_cups, 2);

      select * into v_ingredient
        from public.ingredients
       where id = v_recipe.ingredient_id
       for update;

      if not found then
        v_message := format('Ingredient missing for %s', v_drink.name);
        raise exception '%', v_message;
      end if;

      select * into v_inventory
        from public.branch_inventory
       where branch_id = p_branch_id
         and ingredient_id = v_recipe.ingredient_id
       for update;

      if not found then
        raise exception 'Ingredient is not available in this branch';
      end if;

      if v_inventory.current_stock < v_required then
        v_message := format(
          'Not enough %s for %s cups of %s: need %s %s, have %s %s',
          v_ingredient.name, v_cups, v_drink.name,
          v_required, v_ingredient.unit,
          v_inventory.current_stock, v_ingredient.unit
        );
        raise exception '%', v_message;
      end if;

      update public.branch_inventory
         set current_stock = current_stock - v_required,
             updated_at = now()
       where branch_id = p_branch_id
         and ingredient_id = v_ingredient.id;

      insert into public.stock_logs (
        branch_id, ingredient_id, drink_id, change_amount, type, note,
        previous_stock, new_stock, cups_sold
      ) values (
        p_branch_id, v_ingredient.id, v_drink.id, -v_required, 'usage',
        format('%s cups of %s', v_cups, v_drink.name),
        v_inventory.current_stock, v_inventory.current_stock - v_required, v_cups
      );

      v_ingredients_deducted := v_ingredients_deducted + 1;
    end loop;

    v_drinks_logged := v_drinks_logged + 1;
  end loop;

  if v_drinks_logged = 0 then
    raise exception 'Enter at least one cup sold';
  end if;

  return jsonb_build_object(
    'drinks_logged', v_drinks_logged,
    'ingredients_deducted', v_ingredients_deducted
  );
end;
$$;

grant execute on function public.stock_in_ingredient(uuid, uuid, numeric, text, text) to anon, authenticated;
grant execute on function public.adjust_ingredient_stock(uuid, uuid, numeric, text, text) to anon, authenticated;
grant execute on function public.log_daily_drink_usage(uuid, jsonb) to anon, authenticated;

create or replace function public.transfer_stock(
  p_from_branch_id uuid,
  p_to_branch_id uuid,
  p_ingredient_id uuid,
  p_quantity numeric,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_from public.branch_inventory%rowtype;
  v_to public.branch_inventory%rowtype;
  v_from_name text;
  v_to_name text;
  v_out_note text;
  v_in_note text;
begin
  if p_from_branch_id is null or p_to_branch_id is null then
    raise exception 'Choose both a source and destination branch';
  end if;

  if p_from_branch_id = p_to_branch_id then
    raise exception 'Source and destination branches must be different';
  end if;

  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Transfer quantity must be greater than zero';
  end if;

  select name into v_from_name from public.branches where id = p_from_branch_id;
  select name into v_to_name from public.branches where id = p_to_branch_id;
  if v_from_name is null or v_to_name is null then
    raise exception 'One or both branches were not found';
  end if;

  v_out_note := case
    when btrim(coalesce(p_note, '')) = '' then 'Transferred to ' || v_to_name
    else btrim(p_note) || ' — Transferred to ' || v_to_name
  end;
  v_in_note := case
    when btrim(coalesce(p_note, '')) = '' then 'Transferred from ' || v_from_name
    else btrim(p_note) || ' — Transferred from ' || v_from_name
  end;

  select * into v_from
    from public.branch_inventory
   where branch_id = p_from_branch_id
     and ingredient_id = p_ingredient_id
   for update;
  if not found then
    raise exception 'Ingredient is not available in the source branch';
  end if;

  if v_from.current_stock < p_quantity then
    raise exception 'Not enough stock in %: need %, have %',
      v_from_name, p_quantity, v_from.current_stock;
  end if;

  select * into v_to
    from public.branch_inventory
   where branch_id = p_to_branch_id
     and ingredient_id = p_ingredient_id
   for update;
  if not found then
    raise exception 'Ingredient is not available in the destination branch';
  end if;

  update public.branch_inventory
     set current_stock = current_stock - p_quantity,
         updated_at = now()
   where branch_id = p_from_branch_id
     and ingredient_id = p_ingredient_id;

  update public.branch_inventory
     set current_stock = current_stock + p_quantity,
         updated_at = now()
   where branch_id = p_to_branch_id
     and ingredient_id = p_ingredient_id;

  insert into public.stock_logs (
    branch_id, ingredient_id, change_amount, type, note, previous_stock, new_stock
  ) values (
    p_from_branch_id, p_ingredient_id, -p_quantity, 'transfer_out',
    v_out_note,
    v_from.current_stock, v_from.current_stock - p_quantity
  );

  insert into public.stock_logs (
    branch_id, ingredient_id, change_amount, type, note, previous_stock, new_stock
  ) values (
    p_to_branch_id, p_ingredient_id, p_quantity, 'transfer_in',
    v_in_note,
    v_to.current_stock, v_to.current_stock + p_quantity
  );

  return jsonb_build_object(
    'quantity', p_quantity,
    'from_branch', v_from_name,
    'to_branch', v_to_name
  );
end;
$$;

grant execute on function public.transfer_stock(uuid, uuid, uuid, numeric, text) to anon, authenticated;

-- Create or replace a drink and its complete recipe atomically.
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

grant execute on function public.upsert_recipe(uuid, text, text, numeric, jsonb, text) to anon, authenticated;

-- Create or update a drink independently of its recipe.
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

grant execute on function public.upsert_drink(uuid, text, text, numeric, text) to anon, authenticated;

notify pgrst, 'reload schema';
