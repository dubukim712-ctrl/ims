-- BrewStock · 04 new ingredients + drinks for expanded menu
-- Run after 01_tables.sql, 02_functions.sql, 03_policies_seed.sql

-- ============================================================
-- NEW INGREDIENTS (IDs start after existing 00000000-0000-4000-8000-0000000015XX)
-- ============================================================

-- Iced Coffee category new ingredients
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

-- Milk Based category new ingredients
INSERT INTO public.ingredients (id, name, category, unit, current_stock, reorder_level, cost_per_unit, supplier)
VALUES
  ('00000000-0000-4000-8000-000000001701', 'Milo powder', 'Toppings', 'g', 300, 150, 0.012, 'Food Suppliers'),
  ('00000000-0000-4000-8000-000000001702', 'Crushed Oreo', 'Toppings', 'g', 200, 100, 0.015, 'Biscuit Makers'),
  ('00000000-0000-4000-8000-000000001703', 'Biscoff Spread', 'Toppings', 'g', 250, 120, 0.020, 'Biscoff Imports'),
  ('00000000-0000-4000-8000-000000001704', 'Strawberry Jam', 'Syrup', 'g', 400, 150, 0.015, 'Fruit Preserves')
ON CONFLICT (id) DO NOTHING;

-- Soda category new ingredients
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
  ('00000000-0000-4000-8000-000000001902', 'Takeout plastic', 'Packaging', 'pcs', 300, 200, 0.030, 'EcoPack'),
  ('00000000-0000-4000-8000-000000001903', 'Regular Cups 16oz', 'Packaging', 'pcs', 600, 500, 0.080, 'EcoPack'),
  ('00000000-0000-4000-8000-000000001904', 'Straw', 'Packaging', 'pcs', 1000, 800, 0.005, 'EcoPack'),
  ('00000000-0000-4000-8000-000000001905', 'Ice (half sack)', 'Other', 'g', 50000, 10000, 0.0001, 'Ice Supplier')
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