import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-11 w-full rounded-xl border border-espresso-200 bg-white px-3.5 text-base text-espresso-900 sm:text-sm',
        'shadow-sm transition focus:border-caramel-500 focus:outline-none focus:ring-2 focus:ring-caramel-500/20',
        'disabled:cursor-not-allowed disabled:bg-cream-50 disabled:text-espresso-300',
        invalid && 'border-berry-500 focus:border-berry-500 focus:ring-berry-500/20',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
