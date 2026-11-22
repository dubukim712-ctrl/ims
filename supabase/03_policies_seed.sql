-- BrewStock · 03 access policies + demo seed
-- Run last. WARNING: the policies below allow the anon key full access.
-- That is fine for a private single-shop tool, but add Supabase Auth and
-- user-scoped policies before exposing this project publicly.

alter table public.ingredients enable row level security;
alter table public.drinks enable row level security;
alter table public.recipe_items enable row level security;
alter table public.stock_logs enable row level security;
alter table public.branches enable row level security;
alter table public.branch_inventory enable row level security;

drop policy if exists "brewstock full access" on public.ingredients;
drop policy if exists "brewstock full access" on public.drinks;
drop policy if exists "brewstock full access" on public.recipe_items;
drop policy if exists "brewstock full access" on public.stock_logs;
drop policy if exists "brewstock full access" on public.branches;
drop policy if exists "brewstock full access" on public.branch_inventory;

create policy "brewstock full access" on public.ingredients
  for all to anon, authenticated using (true) with check (true);

create policy "brewstock full access" on public.drinks
  for all to anon, authenticated using (true) with check (true);

create policy "brewstock full access" on public.recipe_items
  for all to anon, authenticated using (true) with check (true);

create policy "brewstock full access" on public.stock_logs
  for all to anon, authenticated using (true) with check (true);

create policy "brewstock full access" on public.branches
  for all to anon, authenticated using (true) with check (true);

create policy "brewstock full access" on public.branch_inventory
  for all to anon, authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.ingredients to anon, authenticated;
grant select, insert, update, delete on public.drinks to anon, authenticated;
grant select, insert, update, delete on public.recipe_items to anon, authenticated;
grant select, insert, update, delete on public.stock_logs to anon, authenticated;
grant select, insert, update, delete on public.branches to anon, authenticated;
grant select, insert, update, delete on public.branch_inventory to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Demo data (safe to remove if you already have your own inventory)
-- ---------------------------------------------------------------------------

insert into public.ingredients
  (id, name, category, unit, current_stock, reorder_level, cost_per_unit, supplier)
values
  ('00000000-0000-4000-8000-000000000001', 'Espresso Beans', 'Coffee', 'g', 2500, 500, 0.045, 'Highland Roasters'),
  ('00000000-0000-4000-8000-000000000002', 'Assam Black Tea', 'Tea', 'g', 1800, 400, 0.030, 'Tea Leaf Co.'),
  ('00000000-0000-4000-8000-000000000003', 'Jasmine Green Tea', 'Tea', 'g', 1200, 300, 0.035, 'Tea Leaf Co.'),
  ('00000000-0000-4000-8000-000000000004', 'Matcha Powder', 'Tea', 'g', 180, 250, 0.120, 'Kyoto Greens'),
  ('00000000-0000-4000-8000-000000000005', 'Fresh Milk', 'Dairy', 'ml', 6000, 2000, 0.012, 'Valley Dairy'),
  ('00000000-0000-4000-8000-000000000006', 'Oat Milk', 'Dairy', 'ml', 1500, 1000, 0.025, 'Valley Dairy'),
  ('00000000-0000-4000-8000-000000000007', 'Condensed Milk', 'Dairy', 'g', 900, 500, 0.008, 'Sweet Valley'),
  ('00000000-0000-4000-8000-000000000008', 'Tapioca Pearls', 'Toppings', 'g', 800, 1000, 0.006, 'Boba Supply'),
  ('00000000-0000-4000-8000-000000000009', 'Brown Sugar Syrup', 'Syrup', 'ml', 1000, 400, 0.010, 'Sweet Valley'),
  ('00000000-0000-4000-8000-000000000010', 'Vanilla Syrup', 'Syrup', 'ml', 350, 400, 0.012, 'Sweet Valley'),
  ('00000000-0000-4000-8000-000000000011', 'Passion Fruit Puree', 'Syrup', 'g', 700, 300, 0.020, 'Fruit Lab'),
  ('00000000-0000-4000-8000-000000000012', 'Whipped Cream', 'Toppings', 'g', 0, 300, 0.015, 'Valley Dairy'),
  ('00000000-0000-4000-8000-000000000013', 'Paper Cups 16oz', 'Packaging', 'pcs', 450, 500, 0.080, 'EcoPack'),
  ('00000000-0000-4000-8000-000000000014', 'Plastic Lids', 'Packaging', 'pcs', 600, 500, 0.030, 'EcoPack'),
  ('00000000-0000-4000-8000-000000000015', 'Ice Cubes', 'Other', 'g', 8000, 2000, 0.0005, 'In-house'),
  -- New ingredients for expanded menu
  ('00000000-0000-4000-8000-000000001601', 'Santos Sumatra 60arabica/40robusta', 'Coffee', 'g', 5000, 1000, 0.050, 'Coffee Supplies'),
  ('00000000-0000-4000-8000-000000001602', 'Mineral Water', 'Other', 'ml', 20000, 5000, 0.002, 'Water Distributors'),
  ('00000000-0000-4000-8000-000000001603', 'Iodized Salt', 'Other', 'g', 500, 100, 0.001, 'Food Service'),
  ('00000000-0000-4000-8000-000000001604', 'Jersey Condensed', 'Dairy', 'g', 800, 300, 0.009, 'Dairy Farm'),
  ('00000000-0000-4000-8000-000000001605', 'Chocolate Syrup Davinci', 'Syrup', 'ml', 1500, 400, 0.018, 'Davinci Gourmet'),
  ('00000000-0000-4000-8000-000000001606', 'Caramel Syrup Davinci', 'Syrup', 'ml', 1500, 400, 0.018, 'Davinci Gourmet'),
  ('00000000-0000-4000-8000-000000001607', 'French Vanilla Top Series', 'Syrup', 'ml', 600, 200, 0.025, 'Davinci Gourmet'),
  ('00000000-0000-4000-8000-000000001701', 'Milo powder', 'Toppings', 'g', 300, 150, 0.012, 'Food Suppliers'),
  ('00000000-0000-4000-8000-000000001702', 'Crushed Oreo', 'Toppings', 'g', 200, 100, 0.015, 'Biscuit Makers'),
  ('00000000-0000-4000-8000-000000001703', 'Biscoff Spread', 'Toppings', 'g', 250, 120, 0.020, 'Biscoff Imports'),
  ('00000000-0000-4000-8000-000000001704', 'Strawberry Jam', 'Syrup', 'g', 400, 150, 0.015, 'Fruit Preserves'),
  ('00000000-0000-4000-8000-000000001801', 'Green apple syrup', 'Syrup', 'ml', 800, 300, 0.015, 'Syrup Co.'),
  ('00000000-0000-4000-8000-000000001802', 'Blueberry syrup', 'Syrup', 'ml', 800, 300, 0.015, 'Syrup Co.'),
  ('00000000-0000-4000-8000-000000001803', 'Strawberry syrup', 'Syrup', 'ml', 800, 300, 0.015, 'Syrup Co.'),
  ('00000000-0000-4000-8000-000000001804', 'Lemon syrup', 'Syrup', 'ml', 800, 300, 0.015, 'Syrup Co.'),
  ('00000000-0000-4000-8000-000000001805', 'Sprite', 'Other', 'ml', 100, 50, 0.800, 'Coca-Cola'),
  ('00000000-0000-4000-8000-000000001901', 'Strawless lid', 'Packaging', 'pcs', 500, 300, 0.050, 'EcoPack'),
  ('00000000-0000-4000-8000-000000001902', 'Takeout plastic', 'Packaging', 'pcs', 300, 200, 0.030, 'EcoPack'),
  ('00000000-0000-4000-8000-000000001903', 'Regular Cups 16oz', 'Packaging', 'pcs', 600, 500, 0.080, 'EcoPack'),
  ('00000000-0000-4000-8000-000000001904', 'Straw', 'Packaging', 'pcs', 1000, 800, 0.005, 'EcoPack'),
  ('00000000-0000-4000-8000-000000001905', 'Ice (half sack)', 'Other', 'g', 50000, 10000, 0.0001, 'Ice Supplier')
on conflict (id) do nothing;

insert into public.drinks (id, name, category, price)
values
  ('00000000-0000-4000-8000-000000000101', 'Americano', 'Coffee', 3.50),
  ('00000000-0000-4000-8000-000000000102', 'Iced Latte', 'Coffee', 4.50),
  ('00000000-0000-4000-8000-000000000103', 'Brown Sugar Latte', 'Coffee', 5.00),
  ('00000000-0000-4000-8000-000000000104', 'Classic Milk Tea', 'Milk Tea', 4.00),
  ('00000000-0000-4000-8000-000000000105', 'Jasmine Milk Tea', 'Milk Tea', 4.20),
  ('00000000-0000-4000-8000-000000000106', 'Matcha Latte', 'Milk Tea', 5.20),
  ('00000000-0000-4000-8000-000000000107', 'Passion Fruit Tea', 'Fruit Tea', 4.80),
  ('00000000-0000-4000-8000-000000000108', 'Oat Latte', 'Coffee', 5.00),
  -- New drinks for expanded menu
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
on conflict (id) do nothing;

insert into public.recipe_items (drink_id, ingredient_id, quantity)
select v.drink_id, v.ingredient_id, v.quantity
from (
  values
    -- Existing recipes (first 8 drinks from original seed)
    ('00000000-0000-4000-8000-000000000101'::uuid, '00000000-0000-4000-8000-000000000001'::uuid, 18::numeric),
    ('00000000-0000-4000-8000-000000000102'::uuid, '00000000-0000-4000-8000-000000000001'::uuid, 18::numeric),
    ('00000000-0000-4000-8000-000000000102'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric),
    ('00000000-0000-4000-8000-000000000103'::uuid, '00000000-0000-4000-8000-000000000001'::uuid, 18::numeric),
    ('00000000-0000-4000-8000-000000000103'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric),
    ('00000000-0000-4000-8000-000000000103'::uuid, '00000000-0000-4000-8000-000000000009'::uuid, 25::numeric),
    ('00000000-0000-4000-8000-000000000104'::uuid, '00000000-0000-4000-8000-000000000002'::uuid, 8::numeric),
    ('00000000-0000-4000-8000-000000000104'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 80::numeric),
    ('00000000-0000-4000-8000-000000000104'::uuid, '00000000-0000-4000-8000-000000000007'::uuid, 20::numeric),
    ('00000000-0000-4000-8000-000000000104'::uuid, '00000000-0000-4000-8000-000000000008'::uuid, 50::numeric),
    ('00000000-0000-4000-8000-000000000105'::uuid, '00000000-0000-4000-8000-000000000003'::uuid, 8::numeric),
    ('00000000-0000-4000-8000-000000000105'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 100::numeric),
    ('00000000-0000-4000-8000-000000000105'::uuid, '00000000-0000-4000-8000-000000000007'::uuid, 15::numeric),
    ('00000000-0000-4000-8000-000000000106'::uuid, '00000000-0000-4000-8000-000000000004'::uuid, 6::numeric),
    ('00000000-0000-4000-8000-000000000106'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric),
    ('00000000-0000-4000-8000-000000000107'::uuid, '00000000-0000-4000-8000-000000000003'::uuid, 6::numeric),
    ('00000000-0000-4000-8000-000000000107'::uuid, '00000000-0000-4000-8000-000000000011'::uuid, 40::numeric),
    ('00000000-0000-4000-8000-000000000108'::uuid, '00000000-0000-4000-8000-000000000001'::uuid, 18::numeric),
    ('00000000-0000-4000-8000-000000000108'::uuid, '00000000-0000-4000-8000-000000000006'::uuid, 160::numeric),
    -- New recipes for expanded menu drinks
    -- Iced Coffee recipes
    ('00000000-0000-4000-8000-000000012001'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 36::numeric), -- Iced Americano: 2 shots espresso
    ('00000000-0000-4000-8000-000000012001'::uuid, '00000000-0000-4000-8000-000000001602'::uuid, 150::numeric),
    ('00000000-0000-4000-8000-000000012002'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- Iced Latte: milk
    ('00000000-0000-4000-8000-000000012002'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric), -- espresso
    ('00000000-0000-4000-8000-000000012003'::uuid, '00000000-0000-4000-8000-000000001607'::uuid, 30::numeric), -- French Vanilla syrup
    ('00000000-0000-4000-8000-000000012003'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- milk
    ('00000000-0000-4000-8000-000000012003'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric), -- espresso
    ('00000000-0000-4000-8000-000000012004'::uuid, '00000000-0000-4000-8000-000000001604'::uuid, 30::numeric), -- Jersey Condensed
    ('00000000-0000-4000-8000-000000012004'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- milk
    ('00000000-0000-4000-8000-000000012004'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric), -- espresso
    ('00000000-0000-4000-8000-000000012005'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric), -- Chocolate syrup
    ('00000000-0000-4000-8000-000000012005'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- milk
    ('00000000-0000-4000-8000-000000012005'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric), -- espresso
    ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000001607'::uuid, 30::numeric), -- French vanilla
    ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 15::numeric), -- caramel syrup
    ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- milk
    ('00000000-0000-4000-8000-000000012006'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric), -- espresso
    ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 30::numeric), -- caramel syrup
    ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000001603'::uuid, 2::numeric), -- iodized salt (2 pinches)
    ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- milk
    ('00000000-0000-4000-8000-000000012007'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 18::numeric), -- espresso
    ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 30::numeric), -- caramel syrup
    ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000001604'::uuid, 15::numeric), -- condensed milk
    ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000001601'::uuid, 1::numeric), -- 1 shot espresso
    ('00000000-0000-4000-8000-000000012008'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 150::numeric), -- milk
    -- Milk Tea recipes
    ('00000000-0000-4000-8000-000000012009'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric), -- chocolate syrup
    ('00000000-0000-4000-8000-000000012009'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    ('00000000-0000-4000-8000-000000012010'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 30::numeric), -- chocolate syrup
    ('00000000-0000-4000-8000-000000012010'::uuid, '00000000-0000-4000-8000-000000001606'::uuid, 15::numeric), -- caramel syrup
    ('00000000-0000-4000-8000-000000012010'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000001701'::uuid, 30::numeric), -- Milo powder
    ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000001702'::uuid, 3::numeric), -- Crushed Oreo
    ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000001703'::uuid, 30::numeric), -- Biscoff Spread
    ('00000000-0000-4000-8000-000000012011'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    ('00000000-0000-4000-8000-000000012012'::uuid, '00000000-0000-4000-8000-000000001702'::uuid, 3::numeric), -- Crushed Oreo
    ('00000000-0000-4000-8000-000000012012'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    ('00000000-0000-4000-8000-000000012013'::uuid, '00000000-0000-4000-8000-000000001703'::uuid, 3::numeric), -- Biscoff Spread
    ('00000000-0000-4000-8000-000000012013'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    ('00000000-0000-4000-8000-000000012014'::uuid, '00000000-0000-4000-8000-000000001704'::uuid, 30::numeric), -- Strawberry Jam
    ('00000000-0000-4000-8000-000000012014'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    ('00000000-0000-4000-8000-000000012015'::uuid, '00000000-0000-4000-8000-000000000004'::uuid, 30::numeric), -- Matcha Powder
    ('00000000-0000-4000-8000-000000012015'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 180::numeric), -- milk
    ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000001605'::uuid, 15::numeric), -- chocolate syrup
    ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 80::numeric), -- milk first pour
    ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000000004'::uuid, 30::numeric), -- matcha powder
    ('00000000-0000-4000-8000-000000012016'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 80::numeric), -- milk second pour
    ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000001704'::uuid, 30::numeric), -- strawberry jam
    ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 50::numeric), -- milk first pour
    ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000000004'::uuid, 30::numeric), -- matcha powder
    ('00000000-0000-4000-8000-000000012017'::uuid, '00000000-0000-4000-8000-000000000005'::uuid, 100::numeric), -- milk second pour
    -- Soda recipes
    ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001801'::uuid, 30::numeric), -- green apple syrup
    ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001802'::uuid, 30::numeric), -- blueberry syrup
    ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001803'::uuid, 30::numeric), -- strawberry syrup
    ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001804'::uuid, 30::numeric), -- lemon syrup
    ('00000000-0000-4000-8000-000000012018'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric), -- sprite
    ('00000000-0000-4000-8000-000000012019'::uuid, '00000000-0000-4000-8000-000000001802'::uuid, 30::numeric), -- blueberry syrup
    ('00000000-0000-4000-8000-000000012019'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric), -- sprite
    ('00000000-0000-4000-8000-000000012020'::uuid, '00000000-0000-4000-8000-000000001803'::uuid, 30::numeric), -- strawberry syrup
    ('00000000-0000-4000-8000-000000012020'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric), -- sprite
    ('00000000-0000-4000-8000-000000012020'::uuid, '00000000-0000-4000-8000-000000001804'::uuid, 30::numeric), -- lemon syrup
    ('00000000-0000-4000-8000-000000012021'::uuid, '00000000-0000-4000-8000-000000001804'::uuid, 30::numeric), -- lemon syrup
    ('00000000-0000-4000-8000-000000012021'::uuid, '00000000-0000-4000-8000-000000001805'::uuid, 180::numeric), -- sprite
    ('00000000-0000-4000-8000-000000012022'::uuid, '00000000-0000-4000-8000-000000001602'::uuid, 180::numeric) -- mineral water
) AS v(drink_id, ingredient_id, quantity)
on conflict (drink_id, ingredient_id) do nothing;