import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <p className=" text-[11px] font-bold uppercase tracking-[0.14em] text-espresso-300">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl leading-none text-espresso-900">
        {value}
      </p>
      <p className="mt-2 text-xs text-espresso-500">{hint}</p>
    </Card>
  );
}
