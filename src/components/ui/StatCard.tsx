import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

type StatTone = 'espresso' | 'caramel' | 'berry' | 'matcha' | 'honey';

const tones: Record<StatTone, string> = {
  espresso: 'bg-espresso-100 text-espresso-700',
  caramel: 'bg-caramel-100 text-caramel-700',
  berry: 'bg-berry-100 text-berry-700',
  matcha: 'bg-matcha-100 text-matcha-700',
  honey: 'bg-honey-100 text-honey-700',
};

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone?: StatTone;
}

export function StatCard({ label, value, hint, icon: Icon, tone = 'espresso' }: StatCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={cn('rounded-xl p-2.5', tones[tone])}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-espresso-300">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl leading-none text-espresso-900">{value}</p>
      <p className="mt-1.5 text-xs text-espresso-500">{hint}</p>
    </Card>
  );
}
