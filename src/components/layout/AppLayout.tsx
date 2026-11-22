import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileTopbar } from '@/components/layout/MobileTopbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { LoadingState } from '@/components/ui/States';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-cream-50">
      <ScrollToTop />
      <Sidebar />

      <div className="lg:pl-64">
        <MobileTopbar />
        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
          <Suspense fallback={<LoadingState label="Loading page…" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
