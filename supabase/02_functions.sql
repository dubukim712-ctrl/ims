-- BrewStock · 02 database functions (RPCs)
-- Run after 01_tables.sql.

-- Atomically add a delivery to stock and write an audit log.
create or replace function public.stock_in_ingredient(
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

  update public.ingredients
     set current_stock = current_stock + p_quantity,
         supplier = coalesce(nullif(trim(p_supplier), ''), supplier),
         updated_at = now()
   where id = p_ingredient_id;

  insert into public.stock_logs (
    ingredient_id, change_amount, type, note, supplier, previous_stock, new_stock
  ) values (
    p_ingredient_id,
    p_quantity,
    'stock_in',
    nullif(trim(p_note), ''),
    nullif(trim(p_supplier), ''),
    v_ingredient.current_stock,
    v_ingredient.current_stock + p_quantity
  )
  returning * into v_log;

  return v_log;
end;
$$;

-- Atomically apply a spoilage write-off or a signed stock adjustment.
create or replace function public.adjust_ingredient_stock(
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

  if v_ingredient.current_stock + p_change < 0 then
    v_message := format(
      'Not enough stock: %s has %s %s, cannot apply %s',
      v_ingredient.name,
      v_ingredient.current_stock,
      v_ingredient.unit,
      p_change
    );
    raise exception '%', v_message;
  end if;

  update public.ingredients
     set current_stock = current_stock + p_change,
         updated_at = now()
   where id = p_ingredient_id;

  insert into public.stock_logs (
    ingredient_id, change_amount, type, note, previous_stock, new_stock
  ) values (
    p_ingredient_id,
    p_change,
    p_type,
    nullif(trim(p_note), ''),
    v_ingredient.current_stock,
    v_ingredient.current_stock + p_change
  )
  returning * into v_log;

  return v_log;
end;
$$;

-- Bulk "Cups sold today": deducts every recipe ingredient in one transaction.
create or replace function public.log_daily_drink_usage(p_items jsonb)
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

      if v_ingredient.current_stock < v_required then
        v_message := format(
          'Not enough %s for %s cups of %s: need %s %s, have %s %s',
          v_ingredient.name, v_cups, v_drink.name,
          v_required, v_ingredient.unit,
          v_ingredient.current_stock, v_ingredient.unit
        );
        raise exception '%', v_message;
      end if;

      update public.ingredients
         set current_stock = current_stock - v_required,
             updated_at = now()
       where id = v_ingredient.id;

      insert into public.stock_logs (
        ingredient_id, drink_id, change_amount, type, note,
        previous_stock, new_stock, cups_sold
      ) values (
        v_ingredient.id, v_drink.id, -v_required, 'usage',
        format('%s cups of %s', v_cups, v_drink.name),
        v_ingredient.current_stock, v_ingredient.current_stock - v_required, v_cups
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

grant execute on function public.stock_in_ingredient(uuid, numeric, text, text) to anon, authenticated;
grant execute on function public.adjust_ingredient_stock(uuid, numeric, text, text) to anon, authenticated;
grant execute on function public.log_daily_drink_usage(jsonb) to anon, authenticated;
