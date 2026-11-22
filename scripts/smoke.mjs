import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const BASE = 'http://localhost:4173';
const SHOTS = path.join(os.tmpdir(), 'brewstock-shots');
fs.mkdirSync(SHOTS, { recursive: true });

const now = new Date().toISOString();
const ingredient = (id, name, category, unit, stock, reorder, cost, supplier) => ({
  id, name, category, unit, current_stock: stock, reorder_level: reorder,
  cost_per_unit: cost, supplier, is_active: true, created_at: now, updated_at: now,
});

const ingredients = [
  ingredient('i1', 'Espresso Beans', 'Coffee', 'g', 2500, 500, 0.045, 'Highland Roasters'),
  ingredient('i2', 'Fresh Milk', 'Dairy', 'ml', 1500, 2000, 0.012, 'Valley Dairy'),
  ingredient('i3', 'Tapioca Pearls', 'Toppings', 'g', 800, 1000, 0.006, 'Boba Supply'),
  ingredient('i4', 'Matcha Powder', 'Tea', 'g', 180, 250, 0.12, 'Kyoto Greens'),
  ingredient('i5', 'Whipped Cream', 'Toppings', 'g', 0, 300, 0.015, 'Valley Dairy'),
  ingredient('i6', 'Paper Cups 16oz', 'Packaging', 'pcs', 450, 500, 0.08, 'EcoPack'),
  ingredient('i7', 'Jasmine Green Tea', 'Tea', 'g', 1200, 300, 0.035, 'Tea Leaf Co.'),
  ingredient('i8', 'Oat Milk', 'Dairy', 'ml', 1500, 1000, 0.025, 'Valley Dairy'),
];

const byId = Object.fromEntries(ingredients.map((item) => [item.id, item]));
const recipeIngredient = (id) => {
  const item = byId[id];
  return {
    id: item.id, name: item.name, unit: item.unit, current_stock: item.current_stock,
    reorder_level: item.reorder_level, cost_per_unit: item.cost_per_unit,
  };
};
const recipe = (id, ingredientId, quantity) => ({
  id, drink_id: 'd', ingredient_id: ingredientId, quantity, ingredient: recipeIngredient(ingredientId),
});

const drinks = [
  { id: 'd1', name: 'Americano', category: 'Coffee', price: 3.5, is_active: true, created_at: now,
    recipe_items: [recipe('r1', 'i1', 18)] },
  { id: 'd2', name: 'Iced Latte', category: 'Coffee', price: 4.5, is_active: true, created_at: now,
    recipe_items: [recipe('r2', 'i1', 18), recipe('r3', 'i2', 150)] },
  { id: 'd3', name: 'Classic Milk Tea', category: 'Milk Tea', price: 4, is_active: true, created_at: now,
    recipe_items: [recipe('r4', 'i7', 8), recipe('r5', 'i2', 80), recipe('r6', 'i3', 50)] },
  { id: 'd4', name: 'Matcha Latte', category: 'Milk Tea', price: 5.2, is_active: true, created_at: now,
    recipe_items: [recipe('r7', 'i4', 6), recipe('r8', 'i2', 180)] },
  { id: 'd5', name: 'Oat Latte', category: 'Coffee', price: 5, is_active: true, created_at: now,
    recipe_items: [recipe('r9', 'i1', 18), recipe('r10', 'i8', 160)] },
  { id: 'd6', name: 'Seasonal Special', category: 'Other', price: 6, is_active: true, created_at: now,
    recipe_items: [] },
];
for (const drink of drinks) {
  for (const item of drink.recipe_items) item.drink_id = drink.id;
}

const log = (id, ingredientId, change, type, note, supplier, previous, next, minutes, drinkId = null, cups = null) => ({
  id, ingredient_id: ingredientId, drink_id: drinkId, change_amount: change, type, note, supplier,
  previous_stock: previous, new_stock: next, cups_sold: cups,
  created_at: new Date(Date.now() - minutes * 60000).toISOString(),
  ingredient: { id: ingredientId, name: byId[ingredientId].name, unit: byId[ingredientId].unit },
  drink: drinkId ? { id: drinkId, name: drinks.find((d) => d.id === drinkId)?.name } : null,
});

const stockLogs = [
  log('l1', 'i1', -36, 'usage', '2 cups of Americano', null, 2536, 2500, 20, 'd1', 2),
  log('l2', 'i2', 1000, 'stock_in', 'Invoice #1042, delivered chilled', 'Valley Dairy', 500, 1500, 60),
  log('l3', 'i3', -50, 'spoilage', 'Pearls left out overnight', null, 850, 800, 120),
  log('l4', 'i4', -12, 'usage', '2 cups of Matcha Latte', null, 192, 180, 180, 'd4', 2),
  log('l5', 'i5', -300, 'spoilage', 'Whipped cream expired', null, 300, 0, 240),
  log('l6', 'i6', -50, 'usage', 'Packaging count correction', null, 500, 450, 300),
  log('l7', 'i2', -160, 'usage', '2 cups of Iced Latte', null, 1660, 1500, 360, 'd2', 2),
  log('l8', 'i7', 500, 'stock_in', 'Weekly tea delivery', 'Tea Leaf Co.', 700, 1200, 420),
  log('l9', 'i8', -40, 'adjustment', 'Count found 40 ml less', null, 1540, 1500, 480),
  log('l10', 'i1', 500, 'stock_in', 'Invoice #1038', 'Highland Roasters', 2000, 2500, 540),
];

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'access-control-allow-headers': '*',
  'access-control-expose-headers': 'content-range',
  'content-type': 'application/json',
};

const json = (route, body, headers = {}) =>
  route.fulfill({ status: 200, headers: { ...cors, ...headers }, body: JSON.stringify(body) });

async function installMock(page) {
  await page.route('**/rest/v1/**', async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: cors });
    }

    const url = new URL(request.url());
    const endpoint = url.pathname.replace('/rest/v1/', '');
    const method = request.method();
    const accept = request.headers()['accept'] ?? '';
    const wantsObject = accept.includes('vnd.pgrst.object');

    if (endpoint.startsWith('rpc/')) {
      const fn = endpoint.slice(4);
      const payload = request.postDataJSON() ?? {};

      if (fn === 'stock_in_ingredient') {
        const item = byId[payload.p_ingredient_id];
        const previous = item.current_stock;
        item.current_stock += Number(payload.p_quantity);
        if (payload.p_supplier) item.supplier = payload.p_supplier;
        const result = log('l-new', item.id, Number(payload.p_quantity), 'stock_in',
          payload.p_note || null, payload.p_supplier || null, previous, item.current_stock, 0);
        stockLogs.unshift(result);
        return json(route, result);
      }

      if (fn === 'adjust_ingredient_stock') {
        const item = byId[payload.p_ingredient_id];
        const previous = item.current_stock;
        item.current_stock += Number(payload.p_change);
        const result = log('l-adj', item.id, Number(payload.p_change), payload.p_type,
          payload.p_note || null, null, previous, item.current_stock, 0);
        stockLogs.unshift(result);
        return json(route, result);
      }

      if (fn === 'log_daily_drink_usage') {
        const items = payload.p_items ?? [];
        let drinksLogged = 0;
        let ingredientsDeducted = 0;
        for (const item of items) {
          const drink = drinks.find((entry) => entry.id === item.drink_id);
          if (drink && item.cups_sold > 0) {
            drinksLogged += 1;
            ingredientsDeducted += drink.recipe_items.length;
          }
        }
        return json(route, {
          drinks_logged: drinksLogged,
          ingredients_deducted: ingredientsDeducted,
        });
      }
      return route.fulfill({ status: 404, headers: cors, body: JSON.stringify({ message: `Unknown RPC ${fn}` }) });
    }

    if (endpoint === 'ingredients') {
      if (method === 'GET') return json(route, ingredients);
      if (method === 'POST') {
        const payload = request.postDataJSON();
        const created = {
          ...ingredient(`i-${Date.now()}`, payload.name, payload.category, payload.unit,
            payload.current_stock, payload.reorder_level, payload.cost_per_unit, payload.supplier),
          is_active: true,
        };
        ingredients.push(created);
        byId[created.id] = created;
        return json(route, wantsObject ? created : [created]);
      }
      if (method === 'PATCH') {
        const id = url.searchParams.get('id')?.replace('eq.', '');
        const payload = request.postDataJSON();
        const item = byId[id];
        Object.assign(item, payload);
        return json(route, wantsObject ? item : [item]);
      }
    }

    if (endpoint === 'stock_logs') {
      if (method === 'GET') {
        const type = url.searchParams.get('type');
        let rows = stockLogs;
        if (type) rows = rows.filter((row) => row.type === type.replace('eq.', ''));
        const limit = Number(url.searchParams.get('limit') ?? 1000);
        const offset = Number((url.searchParams.get('offset') ?? '0').replace('eq.', ''));
        const paged = rows.slice(offset, offset + limit);
        return json(route, paged, { 'content-range': `0-${Math.max(paged.length - 1, 0)}/${rows.length}` });
      }
    }

    if (endpoint === 'drinks' && method === 'GET') {
      return json(route, drinks);
    }

    return route.fulfill({
      status: 404,
      headers: cors,
      body: JSON.stringify({ message: `Mock route missing: ${method} ${endpoint}` }),
    });
  });
}

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  else if (
    msg.text().includes('CupsSoldForm') ||
    msg.text().includes('cups change') ||
    msg.text().includes('items effect') ||
    msg.text().includes('submit values')
  ) {
    console.log('BROWSER:', msg.text());
  }
});
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
await installMock(page);

const shot = async (name) => {
  await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: true });
};

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'Good day, shop team' }).waitFor();
if (!(await page.getByRole('heading', { name: 'Low-stock alerts' }).isVisible())) {
  throw new Error('Low stock section missing');
}
await shot('01-dashboard-desktop');

await page.locator('aside nav a[href="/inventory"]').click();
await page.getByRole('heading', { name: 'Inventory', exact: true }).waitFor();
await page.getByPlaceholder('Search ingredients…').fill('milk');
await page.waitForTimeout(250);
if (!(await page.getByText('Fresh Milk').first().isVisible())) {
  throw new Error('Search did not find Fresh Milk');
}
await page.getByRole('button', { name: 'Clear search' }).click();
await page.getByRole('button', { name: 'Dairy', exact: true }).click();
await page.waitForTimeout(250);
await shot('02-inventory-desktop');

await page.getByRole('button', { name: 'Add ingredient' }).click();
await page.getByRole('dialog').waitFor();
await page.locator('#name').fill('Vanilla Syrup');
await page.locator('#category').selectOption('Syrup');
await page.locator('#unit').selectOption('ml');
await page.locator('#current_stock').fill('900');
await page.locator('#reorder_level').fill('300');
await page.locator('#cost_per_unit').fill('0.012');
await page.locator('#supplier').fill('Sweet Valley');
await page.getByRole('dialog').getByRole('button', { name: 'Add ingredient' }).click();
await page.getByText('Vanilla Syrup added to inventory').waitFor();
await shot('03-inventory-modal-success');

await page.locator('aside nav a[href="/stock-in"]').click();
await page.getByRole('heading', { name: 'Stock in', exact: true }).waitFor();
await page.getByLabel('Ingredient').selectOption('i1');
await page.getByLabel('Quantity received').fill('500');
await page.getByLabel('Supplier note').fill('Invoice #1042, delivered chilled');
await page.getByRole('button', { name: 'Record stock in' }).click();
await page.getByText('Restocked Espresso Beans').waitFor();
await shot('04-stock-in-desktop');

await page.locator('aside nav a[href="/usage"]').click();
await page.getByRole('heading', { name: 'Cups sold today', exact: true }).waitFor();
const americano = page
  .getByText('Americano', { exact: true })
  .locator('xpath=ancestor::div[contains(@class,"rounded-2xl")][1]');
await page.waitForTimeout(600);
const cupsInput = americano.locator('input[type="number"]');
await cupsInput.fill('2');
await cupsInput.blur();
await page.waitForTimeout(250);
if (!(await page.getByText('Espresso Beans').first().isVisible())) throw new Error('Deduction preview missing');
await page.getByRole('button', { name: 'Log daily usage' }).click();
await page.getByText('Logged 1 drink sold').waitFor({ timeout: 8000 });
await shot('05-usage-desktop');

await page.getByRole('tab', { name: 'Spoilage / adjustment' }).click();
await page.getByRole('heading', { name: 'Spoilage or adjustment' }).waitFor();
await page.getByLabel('Ingredient').selectOption('i2');
await page.getByLabel('Quantity spoiled').fill('100');
await page.getByLabel('Reason').fill('Milk expired during closing shift');
await page.getByRole('button', { name: 'Record spoilage' }).click();
await page.getByText('Spoilage recorded').waitFor();
await shot('06-spoilage-desktop');

await page.locator('aside nav a[href="/recipes"]').click();
await page.getByRole('heading', { name: 'Recipes & audit logs' }).waitFor();
await page.getByText('Classic Milk Tea').waitFor();
await shot('07-recipes-desktop');
await page.getByRole('tab', { name: 'Audit logs' }).click();
await page.getByRole('heading', { name: 'Stock audit log' }).waitFor();
await shot('08-audit-desktop');

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'Good day, shop team' }).waitFor();
await shot('09-dashboard-mobile');
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
if (overflow > 1) throw new Error(`Mobile horizontal overflow: ${overflow}px`);

await page.locator('nav[aria-label="Mobile navigation"] a[href="/inventory"]').click();
await page.getByRole('heading', { name: 'Inventory', exact: true }).waitFor();
await shot('10-inventory-mobile');

await page.getByRole('button', { name: 'Add ingredient' }).click();
await page.getByRole('dialog').waitFor();
await shot('11-modal-mobile');
await page.getByRole('button', { name: 'Cancel' }).click();

await page.locator('nav[aria-label="Mobile navigation"] a[href="/usage"]').click();
await page.getByRole('heading', { name: 'Cups sold today', exact: true }).waitFor();
await shot('12-usage-mobile');

const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
if (mobileOverflow > 1) throw new Error(`Mobile usage horizontal overflow: ${mobileOverflow}px`);

console.log(JSON.stringify({ shots: SHOTS, errors }, null, 2));
await browser.close();
