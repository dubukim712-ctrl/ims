import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('min-w-0 rounded-2xl border border-espresso-100 bg-white shadow-card', className)}
      {...props}
    />
  );
}
