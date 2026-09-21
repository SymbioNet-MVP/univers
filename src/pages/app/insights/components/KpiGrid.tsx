import { useTranslation } from 'react-i18next';
import type { FunnelStage } from '@/hooks/useFounderInsights';

interface KpiGridProps {
  stages: FunnelStage[];
}

const ICONS: Record<string, string> = {
  signup: 'ri-user-add-line',
  profile: 'ri-user-line',
  verification: 'ri-shield-check-line',
  first_match: 'ri-user-heart-line',
  first_conversation: 'ri-chat-3-line',
};

const ORDER = ['signup', 'profile', 'verification', 'first_match', 'first_conversation'] as const;

function formatPct(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

export default function KpiGrid({ stages }: KpiGridProps) {
  const { t } = useTranslation();
  const counts = new Map(stages.map((stage) => [stage.key, stage.count]));
  const base = counts.get('signup') ?? 0;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ORDER.map((key) => {
        const count = counts.get(key) ?? 0;
        const share = base > 0 ? (count / base) * 100 : 0;
        return (
          <div key={key} className="rounded-lg border border-background-200 bg-background-50 p-4">
            <div className="flex items-center gap-2 text-foreground-600">
              <span className="w-7 h-7 flex items-center justify-center rounded-md bg-background-100 text-foreground-700">
                <i className={ICONS[key]}></i>
              </span>
              <span className="text-xs font-medium">{t(`insights.stages.${key}`)}</span>
            </div>
            <p className="mt-3 font-heading text-2xl font-semibold text-foreground-950">{count}</p>
            <p className="mt-1 text-[11px] text-foreground-500">
              {key === 'signup' ? t('insights.kpis.totalBase') : `${formatPct(share)} ${t('insights.kpis.ofSignups')}`}
            </p>
          </div>
        );
      })}
    </div>
  );
}