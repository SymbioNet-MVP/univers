import { useTranslation } from 'react-i18next';
import type { FunnelStage } from '@/hooks/useFounderInsights';

const ORDER = ['signup', 'profile', 'verification', 'first_match', 'first_conversation'] as const;

function formatPct(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

export default function FunnelView({ stages }: { stages: FunnelStage[] }) {
  const { t } = useTranslation();

  const counts = new Map(stages.map((stage) => [stage.key, stage.count]));
  const ordered = ORDER.map((key) => ({ key, count: counts.get(key) ?? 0 }));
  const base = ordered[0]?.count ?? 0;

  const drops = ordered.map((stage, index) => {
    if (index === 0) return 0;
    const prev = ordered[index - 1].count;
    if (prev <= 0) return 0;
    return ((prev - stage.count) / prev) * 100;
  });

  const worstIndex = drops.reduce((best, value, index) => (value > drops[best] ? index : best), 0);
  const hasWorst = worstIndex > 0 && drops[worstIndex] > 0;

  return (
    <div className="space-y-3">
      {ordered.map((stage, index) => {
        const width = base > 0 ? Math.max((stage.count / base) * 100, stage.count > 0 ? 4 : 0) : 0;
        const isWorst = hasWorst && index === worstIndex;
        const share = base > 0 ? (stage.count / base) * 100 : 0;
        return (
          <div key={stage.key}>
            <div className="flex items-end justify-between gap-3">
              <span className="text-sm font-medium text-foreground-800">
                {t(`insights.stages.${stage.key}`)}
              </span>
              <span className="shrink-0 text-sm text-foreground-600">
                <span className="font-heading font-semibold text-foreground-950">{stage.count}</span>
                <span className="ml-2 text-xs text-foreground-500">{formatPct(share)}</span>
              </span>
            </div>

            <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-background-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isWorst ? 'bg-accent-500' : 'bg-primary-500'
                }`}
                style={{ width: `${width}%` }}
              />
            </div>

            {index > 0 && (
              <p
                className={`mt-1 inline-flex items-center gap-1 text-[11px] ${
                  isWorst ? 'font-medium text-accent-700' : 'text-foreground-500'
                }`}
              >
                <i className={isWorst ? 'ri-error-warning-line' : 'ri-arrow-down-line'}></i>
                {t('insights.dropOff', { percent: formatPct(drops[index]) })}
              </p>
            )}
          </div>
        );
      })}

      {hasWorst && (
        <p className="mt-4 rounded-md border border-accent-200 bg-accent-50 px-3 py-2 text-xs text-accent-800">
          <i className="ri-focus-3-line mr-1.5"></i>
          {t('insights.guidance', { stage: t(`insights.stages.${ordered[worstIndex].key}`) })}
        </p>
      )}
    </div>
  );
}