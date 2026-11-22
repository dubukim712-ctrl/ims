import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant = 'neutral' | 'caramel' | 'matcha' | 'berry' | 'honey' | 'espresso';

const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-cream-100 text-espresso-700 ring-espresso-100',
  caramel: 'bg-caramel-100 text-caramel-700 ring-caramel-200',
  matcha: 'bg-matcha-100 text-matcha-700 ring-matcha-300',
  berry: 'bg-berry-100 text-berry-700 ring-berry-300',
  honey: 'bg-honey-100 text-honey-700 ring-honey-300',
  espresso: 'bg-espresso-900 text-cream-50 ring-espresso-800',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
