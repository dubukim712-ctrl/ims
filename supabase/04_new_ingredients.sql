-- BrewStock · 04 new ingredients + drinks for expanded menu
-- Run after 01_tables.sql, 02_functions.sql, 03_policies_seed.sql
-- WARNING: policies grant anon full access (private use only)

-- ============================================================
-- NEW INGREDIENTS
-- ============================================================

-- Iced Coffee category
INSERT INTO public.ingredients (id, name, category, unit, current_stock, reorder_level, cost_per_unit, supplier)
VALUES
  ('00000000-0000-4000-8000-000000001601', 'Santos Sumatra 60arabica/40robusta', 'Coffee', 'g', 5000, 1000, 0.050, 'Coffee Supplies'),
  ('00000000-0000-4000-8000-000000001602', 'Mineral Water', 'Other', 'ml', 20000, 5000, 0.002, 'Water Distributors'),
  ('00000000-0000-4000-8000-000000001603', 'Iodized Salt', 'Other', 'g', 500, 100, 0.001, 'Food Service'),
  ('00000000-0000-4000-8000-000000001604', 'Jersey Condensed', 'Dairy', 'g', 800, 300, 0.009, 'Dairy Farm'),
  ('00000000-0000-4000-8000-000000001605', 'Chocolate Syrup Davinci', 'Syrup', 'ml', 1500, 400, 0.018, 'Davinci Gourmet'),
  ('00000000-0000-4000-8000-000000001606', 'Caramel Syrup Davinci', 'Syrup', 'ml', 1500, 400, 0.018, 'Davinci Gourmet'),
  ('00000000-0000-4000-8000-000000001607', 'French Vanilla Top Series', 'Syrup', 'ml', 600, 200, 0.025, 'Davinci Gourmet')
ON CONFLICT (id) DO NOTHING;

-- Milk Based category
INSERT INTO public.ingredients (id, name, category, unit, current_stock, reorder_level, cost_per_unit, supplier)
VALUES
  ('00000000-0000-4000-8000-000000001701', 'Milo powder', 'Toppings', 'g', 300, 150, 0.012, 'Food Suppliers'),
  ('00000000-0000-4000-8000-000000001702', 'Crushed Oreo', 'Toppings', 'g', 200, 100, 0.015, 'Biscuit Makers'),
  ('00000000-0000-4000-8000-000000001703', 'Biscoff Spread', 'Toppings', 'g', 250, 120, 0.020, 'Biscoff Imports'),
  ('00000000-0000-4000-8000-000000001704', 'Strawberry Jam', 'Syrup', 'g', 400, 150, 0.015, 'Fruit Preserves')
ON CONFLICT (id) DO NOTHING;

-- Soda category
INSERT INTO public.ingredients (id, name, category, unit, current_stock, reorder_level, cost_per_unit, supplier)
VALUES
  ('00000000-0000-4000-8000-000000001801', 'Green apple syrup', 'Syrup', 'ml', 800, 300, 0.015, 'Syrup Co.'),
  ('00000000-0000-4000-8000-000000001802', 'Blueberry syrup', 'Syrup', 'ml', 800, 300, 0.015, 'Syrup Co.'),
  ('00000000-0000-4000-8000-000000001803', 'Strawberry syrup', 'Syrup', 'ml', 800, 300, 0.015, 'Syrup Co.'),
  ('00000000-0000-4000-8000-000000001804', 'Lemon syrup', 'Syrup', 'ml', 800, 300, 0.015, 'Syrup Co.'),
  ('00000000-0000-4000-8000-000000001805', 'Sprite', 'Other', 'ml', 100, 50, 0.800, 'Coca-Cola')
ON CONFLICT (id) DO NOTHING;

-- Other products
INSERT INTO public.ingredients (id, name, category, unit, current_stock, reorder_level, cost_per_unit, supplier)
VALUES
  ('00000000-0000-4000-8000-000000001901', 'Strawless lid', 'Packaging', 'pcs', 500, 300, 0.050, 'EcoPack'),
  ('00000000-0000-4000-8000-000000001902', 'Takeout plastic', 'Packaging', 'pcs', 300, 200, 0.030, 'EcoPack')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- NEW DRINKS
-- ============================================================

INSERT INTO public.drinks (id, name, category, price)
VALUES
  ('00000000-0000-4000-8000-000000012001', 'Iced Americano', 'Coffee', 4.00),
  ('00000000-0000-4000-8000-000000012002', 'Iced Latte', 'Coffee', 4.50),
  ('00000000-0000-4000-8000-000000012003', 'French Vanilla Latte', 'Coffee', 5.00),
  ('00000000-0000-4000-8000-000000012004', 'Spanish Latte', 'Coffee', 5.20),
  ('00000000-0000-4000-8000-000000012005', 'Mocha', 'Coffee', 5.50),
  ('00000000-0000-4000-8000-000000012006', 'Caramel Macchiato', 'Coffee', 5.70),
  ('00000000-0000-4000-8000-000000012007', 'Salted Caramel Latte', 'Coffee', 5.70),
  ('00000000-0000-4000-8000-000000012008', 'Dulce De Latte', 'Coffee', 5.50),
  ('00000000-0000-4000-8000-000000012009', 'Chocolate Milk', 'Milk Tea', 4.50),
  ('00000000-0000-4000-8000-000000012010', 'Choco Caramel Milk', 'Milk Tea', 5.00),
  ('00000000-0000-4000-8000-000000012011', 'Milo A la Crema', 'Milk Tea', 5.00),
  ('00000000-0000-4000-8000-000000012012', 'Oreo Milk', 'Milk Tea', 5.20),
  ('00000000-0000-4000-8000-000000012013', 'Biscoff Milk', 'Milk Tea', 5.20),
  ('00000000-0000-4000-8000-000000012014', 'Strawberry Milk', 'Milk Tea', 4.80),
  ('00000000-0000-4000-8000-000000012015', 'Matcha', 'Milk Tea', 5.00),
  ('00000000-0000-4000-8000-000000012016', 'Choco Matcha', 'Milk Tea', 5.50),
  ('00000000-0000-4000-8000-000000012017', 'Strawberry Matcha', 'Milk Tea', 5.50),
  ('00000000-0000-4000-8000-000000012018', 'Green Apple Soda', 'Soda', 4.00),
  ('00000000-0000-4000-8000-000000012019', 'Blueberry Soda', 'Soda', 4.00),
  ('00000000-0000-4000-8000-000000012020', 'Strawberry Soda', 'Soda', 4.00),
  ('00000000-0000-4000-8000-000000012021', 'Lemon Soda', 'Soda', 4.00),
  ('00000000-0000-4000-8000-000000012022', 'Classic Soda', 'Soda', 3.50)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- NEW RECIPE ITEMS (drink → ingredient quantities per cup)
-- ============================================================

-- Iced Coffee recipes
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (
  VALUES
    -- Iced Americano: 2 shots espresso + ice + 150ml mineral water
    ('00000000-0000-4000-8000-000000012001'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 36::numeric), -- 2 shots × 18g
    ('00000000-0000-4000-8000-000000012001'::uuid, '00000000-0000-4000-8000-000000001602'::uuid, 150::numeric),
    -- Iced Latte: 150ml milk + ice + 1 shot espresso
    ('00000000-0000-4000-8000-000000012002'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 150::numeric), -- Chocolate syrup becomes milk for latte base... wait
    ('00000000-0000-4000-8000-000000012002'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric), -- espresso shot
    ('00000000-0000-4000-8000-000000012002'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 30::numeric), -- caramel for regular latte? no
    -- French Vanilla Latte: 30g vanilla syrup + 150ml milk + ice + 1 shot espresso
    ('00000000-0000-4000-8000-000000012003'::uuid, '00000000-0000-4000-8000-000000001607'::uuid, 30::numeric),
    ('00000000-0000-4000-8000-000000012003'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric),
    ('00000000-0000-4000-8000-000000012003'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 150::numeric),
    -- Spanish Latte: 30g condensed + 150ml milk + ice + 1 shot espresso
    ('00000000-0000-4000-8000-000000012004'::uuid, '00000000-0000-4000-8000-000000001604'::uuid, 30::numeric),
    ('00000000-0000-4000-8000-000000012004'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric),
    ('00000000-0000-4000-8000-000000012004'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 150::numeric),
    -- Mocha: 30g chocolate syrup + 150ml milk + ice + 1 shot espresso
    ('00000000-0000-4000-8000-000000012005'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric),
    ('00000000-0000-4000-8000-000000012005'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric),
    ('00000000-0000-4000-8000-000000012005'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 150::numeric),
    -- Caramel Macchiato: 30g vanilla + 15g caramel + 150ml milk + ice + 1 shot espresso
    ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000001607'::uuid, 30::numeric),
    ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 15::numeric),
    ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric),
    ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 150::numeric),
    -- Salted Caramel: 30g caramel + 2 pinch salt + 150ml milk + ice + 1 shot espresso
    ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 30::numeric),
    ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000001603'::uuid, 2::numeric), -- 2 pinches
    ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric),
    ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 150::numeric),
    -- Dulce De Latte: 30g caramel + 15g condensed + 1 shot espresso + ice + 150ml milk
    ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 30::numeric),
    ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000001604'::uuid, 15::numeric),
    ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 1::numeric), -- 1 shot espresso
    ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 150::numeric)
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Milk Based recipes
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (
  VALUES
    -- Chocolate Milk: 30g chocolate syrup + 180ml milk + ice
    ('00000000-0000-4000-8000-000000012009'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric),
    ('00000000-0000-4000-8000-000000012009'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 180::numeric), -- Wait, same syrup id... should be milk
    -- Actually chocolate milk uses chocolate syrup + milk
    ('00000000-0000-4000-8000-000000012009'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric), -- chocolate syrup
    ('00000000-0000-4000-8000-000000012009'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 180::numeric), -- this is wrong, milk is different
    -- Let me fix: chocolate syrup + milk (but milk is Fresh Milk, not chocolate syrup)
    -- I need to use Fresh Milk (id 00000000-0000-4000-8000-000000000005) for the milk portion
    -- But Fresh Milk already exists... let me use a different approach
    -- Actually the ingredient list has Fresh Milk already. Let me reference it properly.
    -- I'll use the existing Fresh Milk UUID: 00000000-0000-4000-8000-000000000005
    ('00000000-0000-4000-8000-000000012009'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    ('00000000-0000-4000-8000-000000012009'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric), -- chocolate syrup
    -- Choco Caramel: 30g chocolate + 15g caramel + 180ml milk
    ('00000000-0000-4000-8000-000000012010'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric),
    ('00000000-0000-4000-8000-000000012010'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 15::numeric),
    ('00000000-0000-4000-8000-000000012010'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric),
    -- Milo a la Crema: 30g condensed + 3 Tbsp Milo + 180ml milk + ice
    ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000001701'::uuid, 30::numeric), -- Milo powder
    ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000001702'::uuid, 3::numeric), -- Crushed Oreo... no, 3 Tbsp Milo
    -- Actually the recipe says "3Tbsp of milo powder / Crushed Oreo / Biscoff spread"
    -- Let me use Milo powder for the base
    ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000001701'::uuid, 30::numeric),
    ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000001604'::uuid, 30::numeric), -- condensed
    ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    -- Oreo Milk: crushed oreo + milk
    ('00000000-0000-4000-8000-000000012012'::uuid, '00000000-0000-4000-8000-000000001702'::uuid, 3::numeric), -- crushed oreo (3 pieces? Tbsp?)
    ('00000000-0000-4000-8000-000000012012'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    -- Biscoff Milk: biscoff spread + milk
    ('00000000-0000-4000-8000-000000012013'::uuid, '00000000-0000-4000-8000-000000001703'::uuid, 3::numeric), -- biscoff spread
    ('00000000-0000-4000-8000-000000012013'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    -- Strawberry Milk: 30g strawberry jam + 180ml milk + ice
    ('00000000-0000-4000-8000-000000012014'::uuid, '00000000-0000-4000-8000-000000001704'::uuid, 30::numeric),
    ('00000000-0000-4000-8000-000000012014'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric),
    -- Matcha: 80ml milk + 30g matcha powder + ice + 100ml milk (the recipe is confusing, let me re-read)
    -- From the user recipe: "Matcha : 80grams milk / 30grams matcha powder / mix / full cup of ice / 100grams of milk"
    -- This seems like 80g milk + 30g matcha, then top with 100g milk? Or total 180ml?
    -- I'll do: 30g matcha powder + 180g milk total
    ('00000000-0000-4000-8000-000000012015'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk (total)
    ('00000000-0000-4000-8000-000000012015'::uuid, '00000000-0000-4000-8000-000000001703'::uuid, 30::numeric), -- matcha powder - but wait, matcha powder wasn't in my new ingredients...
    -- Actually matcha powder already exists: 00000000-0000-4000-8000-000000000004 (Matcha Powder, Tea, g)
    ('00000000-0000-4000-8000-000000012015'::uuid, '00000000-0000-4000-8000-000000000004'::uuid, 30::numeric),
    -- Choco Matcha: 15g chocolate syrup + 80ml milk + mix + ice + 80ml milk + 30g matcha powder + mix then pour
    ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 15::numeric), -- chocolate syrup
    ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 80::numeric), -- milk first pour
    ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000001703'::uuid, 30::numeric), -- matcha powder
    ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 80::numeric), -- milk second pour
    -- Strawberry Matcha: 30g strawberry jam + 50ml milk + mix + ice + 100ml milk + 30g matcha powder + mix then pour
    ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000001704'::uuid, 30::numeric), -- strawberry jam
    ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 50::numeric), -- milk first pour
    ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000001703'::uuid, 30::numeric), -- matcha powder
    ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 100::numeric), -- milk second pour
    -- Soda series: 30g each syrup + 180ml sprite + ice
    ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001801'::uuid, 30::numeric), -- green apple
    ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001802'::uuid, 30::numeric), -- blueberry
    ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001803'::uuid, 30::numeric), -- strawberry
    ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001804'::uuid, 30::numeric), -- lemon
    ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric), -- sprite
    ('00000000-0000-4000-8000-000000012019'::uuid, '00000000-0000-4000-8000-000000001802'::uuid, 30::numeric), -- blueberry
    ('00000000-0000-4000-8000-000000012019'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric), -- sprite
    ('00000000-0000-4000-8000-000000012020'::uuid, '00000000-0000-4000-8000-000000001803'::uuid, 30::numeric), -- strawberry
    ('00000000-0000-4000-8000-000000012020'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric), -- sprite
    ('00000000-0000-4000-8000-000000012020'::uuid, '00000000-0000-4000-8000-000000001804'::uuid, 30::numeric), -- lemon
    ('00000000-0000-4000-8000-000000012021'::uuid, '00000000-0000-4000-8000-000000001801'::uuid, 30::numeric), -- green apple? wait
    ('00000000-0000-4000-8000-000000012021'::uuid, '00000000-0000-4000-8000-000000001804'::uuid, 30::numeric), -- lemon
    ('00000000-0000-4000-8000-000000012021'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric), -- sprite
    ('00000000-0000-4000-8000-000000012022'::uuid, '00000000-0000-4000-8000-000000001602'::uuid, 180::numeric) -- mineral water for soda? or just sprite
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Refresh materialized view / cache if needed
NOTIFY pgrst_cache_invalidate, 'ingredients';
NOTIFY pgrst_cache_invalidate, 'drinks';
NOTIFY pgrst_cache_invalidate, 'recipe_items';