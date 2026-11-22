import { useSearchParams } from 'react-router-dom';
import { CupSoda, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { CupsSoldForm } from '@/components/usage/CupsSoldForm';
import { SpoilageForm } from '@/components/usage/SpoilageForm';
import { RecentAdjustments } from '@/components/usage/RecentAdjustments';

type UsageMode = 'cups' | 'spoilage';

export function DailyUsagePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode: UsageMode = searchParams.get('mode') === 'spoilage' ? 'spoilage' : 'cups';

  const changeMode = (next: UsageMode) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'cups') params.delete('mode');
    else params.set('mode', 'spoilage');
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Daily usage & spoilage"
        description="Log cups sold to deduct recipe ingredients, or manually correct stock for spoilage and counts."
      />

      <SegmentedTabs
        value={mode}
        onChange={changeMode}
        options={[
          { value: 'cups', label: 'Cups sold today', icon: CupSoda },
          { value: 'spoilage', label: 'Spoilage / adjustment', icon: Trash2 },
        ]}
      />

      {mode === 'cups' ? (
        <CupsSoldForm />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <SpoilageForm />
          <RecentAdjustments />
        </div>
      )}
    </div>
  );
}
