-- BrewStock · 05 new recipe_items for expanded menu
-- Run after 04_new_ingredients_and_recipes.sql

-- ============================================================
-- ICED COFFEE RECIPES
-- ============================================================

-- Iced Americano: 2 shots espresso (36g coffee) + 150ml mineral water + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012001'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 36::numeric), -- Coffee beans
  ('00000000-0000-4000-8000-000000012001'::uuid, '00000000-0000-4000-8000-000000001602'::uuid, 150::numeric) -- Mineral water
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Iced Latte: 150ml milk + 1 shot espresso (18g) + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012002'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- Fresh Milk
  ('00000000-0000-4000-8000-000000012002'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric) -- Espresso beans
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- French Vanilla Latte: 30g vanilla syrup + 150ml milk + 1 shot espresso + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012003'::uuid, '00000000-0000-4000-8000-000000001607'::uuid, 30::numeric), -- French Vanilla syrup
  ('00000000-0000-4000-8000-000000012003'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- Fresh Milk
  ('00000000-0000-4000-8000-000000012003'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric) -- Espresso beans
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Spanish Latte: 30g condensed milk + 150ml milk + 1 shot espresso + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012004'::uuid, '00000000-0000-4000-8000-000000001604'::uuid, 30::numeric), -- Jersey Condensed
  ('00000000-0000-4000-8000-000000012004'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- Fresh Milk
  ('00000000-0000-4000-8000-000000012004'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric) -- Espresso beans
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Mocha: 30g chocolate syrup + 150ml milk + 1 shot espresso + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012005'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric), -- Chocolate Syrup Davinci
  ('00000000-0000-4000-8000-000000012005'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- Fresh Milk
  ('00000000-0000-4000-8000-000000012005'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric) -- Espresso beans
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Caramel Macchiato: 30g vanilla syrup + 15g caramel syrup + 150ml milk + 1 shot espresso + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000001607'::uuid, 30::numeric), -- French Vanilla syrup (used as base)
  ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 15::numeric), -- Caramel Syrup Davinci
  ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- Fresh Milk
  ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric) -- Espresso beans
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Salted Caramel: 30g caramel syrup + 2 pinch salt + 150ml milk + 1 shot espresso + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 30::numeric), -- Caramel Syrup Davinci
  ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000001603'::uuid, 2::numeric), -- Iodized Salt (2 pinches)
  ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- Fresh Milk
  ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric) -- Espresso beans
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Dulce De Latte: 30g caramel syrup + 15g condensed + 1 shot espresso + ice + 150ml milk
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 30::numeric), -- Caramel Syrup Davinci
  ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000001604'::uuid, 15::numeric), -- Jersey Condensed
  ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric), -- Espresso beans (1 shot)
  ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric) -- Fresh Milk
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- ============================================================
-- MILK BASED RECIPES
-- ============================================================

-- Chocolate Milk: 30g chocolate syrup + 180ml milk + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012009'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric), -- Chocolate Syrup Davinci
  ('00000000-0000-4000-8000-000000012009'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric) -- Fresh Milk
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Choco Caramel: 30g chocolate syrup + 15g caramel syrup + 180ml milk + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012010'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric), -- Chocolate Syrup Davinci
  ('00000000-0000-4000-8000-000000012010'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 15::numeric), -- Caramel Syrup Davinci
  ('00000000-0000-4000-8000-000000012010'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric) -- Fresh Milk
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Milo A la Crema: 30g Milo powder + 3 Tbsp (but we'll use the powder quantity) + 30g condensed + 180ml milk + ice
-- The recipe says: "30grams of condense / 3Tbsp of milo powder / Crushed Oreo / Biscoff spread / 180grams of milk / full cup of ice"
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000001701'::uuid, 30::numeric), -- Milo powder
  ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000001702'::uuid, 3::numeric), -- Crushed Oreo (3 pieces/Tbsp)
  ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000001703'::uuid, 30::numeric), -- Biscoff Spread
  ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric) -- Fresh Milk
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Oreo Milk: crushed oreo + milk
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012012'::uuid, '00000000-0000-4000-8000-000000001702'::uuid, 3::numeric), -- Crushed Oreo
  ('00000000-0000-4000-8000-000000012012'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric) -- Fresh Milk
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Biscoff Milk: biscoff spread + milk
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012013'::uuid, '00000000-0000-4000-8000-000000001703'::uuid, 3::numeric), -- Biscoff Spread
  ('00000000-0000-4000-8000-000000012013'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric) -- Fresh Milk
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Strawberry Milk: 30g strawberry jam + 180ml milk + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012014'::uuid, '00000000-0000-4000-8000-000000001704'::uuid, 30::numeric), -- Strawberry Jam
  ('00000000-0000-4000-8000-000000012014'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric) -- Fresh Milk
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Matcha: 30g matcha powder + 180ml milk + ice
-- User recipe: "80grams milk / 30grams matcha powder / mix / full cup of ice / 100grams of milk"
-- This seems like total 180ml milk (80+100) + 30g matcha
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012015'::uuid, '00000000-0000-4000-8000-000000000004'::uuid, 30::numeric), -- Matcha Powder (existing)
  ('00000000-0000-4000-8000-000000012015'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric) -- Fresh Milk
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Choco Matcha: 15g chocolate syrup + 80ml milk + mix + ice + 80ml milk + 30g matcha powder + mix then pour
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 15::numeric), -- Chocolate Syrup Davinci
  ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 80::numeric), -- Milk first pour
  ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000000004'::uuid, 30::numeric), -- Matcha Powder
  ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 80::numeric) -- Milk second pour
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Strawberry Matcha: 30g strawberry jam + 50ml milk + mix + ice + 100ml milk + 30g matcha powder + mix then pour
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000001704'::uuid, 30::numeric), -- Strawberry Jam
  ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 50::numeric), -- Milk first pour
  ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000000004'::uuid, 30::numeric), -- Matcha Powder
  ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 100::numeric) -- Milk second pour
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- ============================================================
-- SODA SERIES RECIPES
-- ============================================================

-- All soda: 30g of each syrup + 180ml sprite + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001801'::uuid, 30::numeric), -- Green apple syrup
  ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001802'::uuid, 30::numeric), -- Blueberry syrup
  ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001803'::uuid, 30::numeric), -- Strawberry syrup
  ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001804'::uuid, 30::numeric), -- Lemon syrup
  ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric) -- Sprite
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Blueberry Soda: 30g blueberry syrup + 180ml sprite + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012019'::uuid, '00000000-0000-4000-8000-000000001802'::uuid, 30::numeric), -- Blueberry syrup
  ('00000000-0000-4000-8000-000000012019'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric) -- Sprite
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Strawberry Soda: 30g strawberry syrup + 180ml sprite + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012020'::uuid, '00000000-0000-4000-8000-000000001803'::uuid, 30::numeric), -- Strawberry syrup
  ('00000000-0000-4000-8000-000000012020'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric) -- Sprite
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Lemon Soda: 30g lemon syrup + 180ml sprite + ice
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012021'::uuid, '00000000-0000-4000-8000-000000001804'::uuid, 30::numeric), -- Lemon syrup
  ('00000000-0000-4000-8000-000000012021'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric) -- Sprite
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;

-- Classic Soda: mineral water + ice (180ml)
INSERT INTO public.recipe_items (drink_id, ingredient_id, quantity)
SELECT v.drink_id, v.ingredient_id, v.quantity
FROM (VALUES
  ('00000000-0000-4000-8000-000000012022'::uuid, '00000000-0000-4000-8000-000000001602'::uuid, 180::numeric) -- Mineral Water
) AS v(drink_id, ingredient_id, quantity)
ON CONFLICT (drink_id, ingredient_id) DO NOTHING;