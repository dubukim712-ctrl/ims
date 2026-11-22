import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-11 w-full rounded-xl border border-espresso-200 bg-white px-3.5 text-base text-espresso-900 sm:text-sm',
        'placeholder:text-espresso-300 shadow-sm transition',
        'focus:border-caramel-500 focus:outline-none focus:ring-2 focus:ring-caramel-500/20',
        'disabled:cursor-not-allowed disabled:bg-cream-50 disabled:text-espresso-300',
        invalid && 'border-berry-500 focus:border-berry-500 focus:ring-berry-500/20',
        className,
      )}
      {...props}
    />
  );
});
