import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SetupNotice } from '@/components/layout/SetupNotice';
import { isSupabaseConfigured } from '@/lib/supabase';

const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const InventoryPage = lazy(() =>
  import('@/pages/InventoryPage').then((module) => ({ default: module.InventoryPage })),
);
const StockInPage = lazy(() =>
  import('@/pages/StockInPage').then((module) => ({ default: module.StockInPage })),
);
const DailyUsagePage = lazy(() =>
  import('@/pages/DailyUsagePage').then((module) => ({ default: module.DailyUsagePage })),
);
const RecipesAuditPage = lazy(() =>
  import('@/pages/RecipesAuditPage').then((module) => ({ default: module.RecipesAuditPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);

export default function App() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="stock-in" element={<StockInPage />} />
        <Route path="usage" element={<DailyUsagePage />} />
        <Route path="recipes" element={<RecipesAuditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
