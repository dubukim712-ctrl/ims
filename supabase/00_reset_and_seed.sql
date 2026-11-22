-- BrewStock · 00 Full Reset & Seed Script
-- Run this ONE script to completely reset and populate the database
-- Order matters: truncate → tables → functions → seed data

-- ============================================================
-- STEP 1: Clear ALL existing data
-- Order: recipe_items first (has FK to drinks + ingredients), 
-- then drinks, then ingredients
-- ============================================================

truncate public.recipe_items restart identity cascade;
truncate public.drinks restart identity cascade;
truncate public.ingredients restart identity cascade;

-- ============================================================
-- STEP 2: Create Database Tables
-- ============================================================

-- Run table schema
\i ./01_tables.sql

-- ============================================================
-- STEP 3: Create RPC Functions
-- ============================================================

-- Run function definitions
\i ./02_functions.sql

-- ============================================================
-- STEP 4: Seed Original Demo Data
-- 15 ingredients + 8 drinks + their recipes
-- ============================================================

-- Run policies + original seed data
\i ./03_policies_seed.sql

-- ============================================================
-- STEP 5: Add Expanded Menu Ingredients
-- 31 new ingredients for iced coffee, milk-based, soda
-- ============================================================

-- Run new ingredients file
\i ./04_new_ingredients_andrecipes.sql

-- ============================================================
-- STEP 6: Add Expanded Menu Recipes
-- 35 recipe items linking new drinks to new ingredients
-- ============================================================

-- Run new recipes file
\i ./05_new_recipes.sql

-- ============================================================
-- VERIFICATION (optional - uncomment to run)
-- ============================================================

-- select 'ingredients count: ' || count(*) as cnt from public.ingredients;
-- select 'drinks count: ' || count(*) as cnt from public.drinks;
-- select 'recipe_items count: ' || count(*) as cnt from public.recipe_items;

-- ============================================================
-- DONE
-- ============================================================

\echo '✅ BrewStock database fully reset and seeded!'
\echo '   - Original: 15 ingredients + 8 drinks + 23 recipe_items'
\echo '   - New: 31 ingredients + 22 drinks + 35 recipe_items'
\echo '   - Total: 46 ingredients + 30 drinks + 68 recipe_items'