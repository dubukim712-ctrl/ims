import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  ariaLabel?: string;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 500,
  ariaLabel = 'Cups sold',
  disabled = false,
}: QuantityStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-espresso-200 bg-white shadow-sm',
        disabled && 'opacity-50',
      )}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease cups"
        className="flex h-10 w-10 items-center justify-center rounded-l-xl text-espresso-500 transition hover:bg-cream-100 disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(Number.isFinite(next) ? clamp(next) : min);
        }}
        className={cn(
          'h-10 w-14 border-x border-espresso-100 bg-transparent text-center text-sm font-semibold text-espresso-900',
          'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-caramel-500/30',
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        )}
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase cups"
        className="flex h-10 w-10 items-center justify-center rounded-r-xl text-espresso-500 transition hover:bg-cream-100 disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
