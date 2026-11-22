import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/components/layout/navigation';
import { cn } from '@/lib/cn';

export function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-espresso-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-semibold transition',
                  isActive ? 'text-caramel-700' : 'text-espresso-300 hover:text-espresso-700',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-8 w-10 items-center justify-center rounded-full transition',
                      isActive ? 'bg-caramel-100' : 'bg-transparent',
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {item.shortLabel}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
