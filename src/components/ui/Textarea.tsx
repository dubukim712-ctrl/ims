import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'min-h-[92px] w-full rounded-xl border border-espresso-200 bg-white px-3.5 py-3 text-base text-espresso-900 sm:text-sm',
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
