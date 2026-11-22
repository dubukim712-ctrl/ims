import { Coffee } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-espresso-900 text-caramel-300">
        <Coffee className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-caramel-600">
        404 · Page not found
      </p>
      <h1 className="mt-2 font-display text-3xl text-espresso-900">This page is off the menu</h1>
      <p className="mt-2 max-w-sm text-sm text-espresso-500">
        The page you are looking for does not exist. Head back to the dashboard to keep stock in order.
      </p>
      <ButtonLink to="/" className="mt-6">
        Back to dashboard
      </ButtonLink>
    </div>
  );
}
