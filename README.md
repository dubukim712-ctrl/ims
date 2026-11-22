# BrewStock — Coffee & Milk Tea Inventory

A focused internal inventory manager for a coffee and milk tea shop. Built with React, TypeScript, Tailwind CSS, TanStack Query, React Hook Form + Yup, and Supabase.

There is **no customer POS** here. The app is for the shop team: stock health, deliveries, daily recipe deductions, spoilage, and audit history.

## Pages

| Page | What it does |
| --- | --- |
| **Dashboard** | Inventory stats, low-stock alert cards (`current_stock <= reorder_level`), category coverage, recent movements. |
| **Inventory** | Search, category/status filters, stock in `g` / `ml` / `pcs`, add/edit ingredient modal. |
| **Stock In** | Record a delivery with supplier, note, and a live current → incoming → new-stock preview. |
| **Daily Usage & Spoilage** | Bulk **Cups Sold Today** form calls `log_daily_drink_usage` to deduct recipe ingredients. A second mode records spoilage or signed adjustments. |
| **Recipes & Audit Logs** | Inspect drink recipes, cost per cup and margin, plus a paginated, filterable `stock_logs` audit trail. |

## Quick start

```bash
npm install
npm run dev
```

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then open your Supabase project → **SQL Editor** and run these files in order:

1. `supabase/01_tables.sql`
2. `supabase/02_functions.sql`
3. `supabase/03_policies_seed.sql`
4. `supabase/06_realtime.sql`

The seed file adds 15 demo ingredients, 8 drinks, and their recipes. Remove that section if you already have data.

> **Current project state:** the Supabase URL and anon key in `.env.local` are valid, but the BrewStock tables do not exist yet. The app shows a readable "Could not find the table" error until you run the SQL files above.

## Database contract

Tables used by the app:

- `branches` — `name`, `location`, `is_active`
- `branch_inventory` — `branch_id`, `ingredient_id`, `current_stock`, `reorder_level`
- `ingredients` — `name`, `category`, `unit` (`g`, `kg`, `ml`, or `pcs`), `cost_per_unit`, `supplier`, `is_active`
- `drinks` — `name`, `category`, `price`, `is_active`
- `recipe_items` — `drink_id`, `ingredient_id`, `quantity` (amount per cup)
- `stock_logs` — `branch_id`, `ingredient_id`, `drink_id`, `change_amount`, `type`, `note`, `supplier`, `previous_stock`, `new_stock`, `cups_sold`

RPCs (all transactional, defined in `02_functions.sql`):

- `stock_in_ingredient(p_branch_id, p_ingredient_id, p_quantity, p_supplier, p_note)`
- `adjust_ingredient_stock(p_branch_id, p_ingredient_id, p_change, p_type, p_note)`
- `log_daily_drink_usage(p_branch_id, p_items jsonb)` — `p_items` is `[{ "drink_id": "...", "cups_sold": 12 }]`
- `transfer_stock(p_from_branch_id, p_to_branch_id, p_ingredient_id, p_quantity, p_note)`
- `upsert_recipe(p_drink_id, p_name, p_category, p_price, p_items)` — creates or replaces a drink and its recipe atomically
- `upsert_drink(p_drink_id, p_name, p_category, p_price)` — creates or edits a drink independently of its recipe

`log_daily_drink_usage` validates stock, rejects drinks without recipes, deducts every recipe ingredient, writes one `usage` stock log per ingredient, and rolls back the whole batch if anything is short.

## Verification

`npm run build` type-checks and bundles the app. A mocked browser smoke test covers the main desktop and mobile flows without needing a live database:

```bash
npm run build
npm run preview -- --port 4173   # in one terminal
npm run smoke                    # in another
```

The smoke test drives system Chrome through Playwright, mocks Supabase REST/RPC responses, and writes screenshots to your OS temp folder (`brewstock-shots`). It checks the dashboard, inventory add flow, stock-in, daily usage, spoilage, recipes/audit, mobile layout, and horizontal overflow.

## Project structure

```
src/
  components/
    dashboard/      low-stock cards, stats, category breakdown, activity
    inventory/      filters, table, mobile cards, add/edit modal
    layout/         sidebar, mobile top bar + bottom nav, app shell
    recipes/        recipe cards, audit table/cards, audit panel
    stock/          stock-in form, recent restocks, stock log row
    ui/             button, card, badge, fields, modal, tabs, states…
    usage/          cups-sold form, drink row, deduction preview, spoilage
  hooks/            TanStack Query wrappers + mutations
  lib/              Supabase client, query client/keys, formatters, stats
  pages/            the five routed pages + 404
  services/         Supabase reads/writes and RPC calls
  types/            shared domain types
  validation/       Yup schemas for every form
supabase/           schema, RPCs, policies, seed
```

**Rules of thumb**

- Components never call Supabase directly; they use hooks, which call services.
- Every write invalidates `ingredients` and all `stock-logs` queries through one helper.
- Query cache keeps data warm for 30 seconds and avoids refetch-on-focus noise.
- Every file stays under 300 lines, and each page is composed from small focused components.

## Notes

- **Mobile-first:** bottom navigation under `lg`, slide-up modal on phones, single-column forms that expand to grids on larger screens.
- **Caching:** TanStack Query with 30s `staleTime`, 5min `gcTime`, and `keepPreviousData` for audit pagination.
- **Validation:** shared Yup schemas in `src/validation`, wired through `yupResolver`.
- **Security:** `03_policies_seed.sql` grants the anon key full table access so this private tool works without login. Add Supabase Auth and user-scoped RLS policies before exposing it publicly.
- Drink names, categories, prices and recipe ingredient quantities can be added or edited from **Recipes & audit logs**.
