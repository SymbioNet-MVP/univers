import { useTranslation } from 'react-i18next';
import type { CampusStat } from '@/hooks/useFounderInsights';

interface CampusDensityProps {
  campus: CampusStat[];
}

function formatPct(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

export default function CampusDensity({ campus }: CampusDensityProps) {
  const { t } = useTranslation();

  if (campus.length === 0) {
    return <p className="text-sm text-foreground-500">{t('insights.campus.none')}</p>;
  }

  const totalLearners = campus.reduce((sum, item) => sum + item.learners, 0);

  return (
    <div className="space-y-4">
      <p className="text-[11px] text-foreground-500">
        {t('insights.campus.summary', { campuses: campus.length, learners: totalLearners })}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-background-200 text-left text-xs text-foreground-500">
              <th className="py-2 pr-3 font-medium">{t('insights.campus.institution')}</th>
              <th className="py-2 px-3 text-right font-medium">{t('insights.campus.learners')}</th>
              <th className="py-2 px-3 text-right font-medium">{t('insights.campus.matches')}</th>
              <th className="py-2 px-3 text-right font-medium">{t('insights.campus.conversations')}</th>
              <th className="py-2 pl-3 font-medium">{t('insights.campus.density')}</th>
            </tr>
          </thead>
          <tbody>
            {campus.map((item) => {
              const density = item.learners > 0 ? (item.active_learners / item.learners) * 100 : 0;
              const healthy = density >= 40;
              return (
                <tr key={item.name} className="border-b border-background-100 last:border-0">
                  <td className="py-2.5 pr-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center rounded bg-background-100 text-foreground-600">
                        <i className="ri-building-2-line text-xs"></i>
                      </span>
                      <span className="max-w-[220px] truncate font-medium text-foreground-800">
                        {item.name}
                      </span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-foreground-950">
                    {item.learners}
                  </td>
                  <td className="py-2.5 px-3 text-right text-foreground-700">{item.matches}</td>
                  <td className="py-2.5 px-3 text-right text-foreground-700">
                    {item.conversations}
                  </td>
                  <td className="py-2.5 pl-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-background-200">
                        <div
                          className={`h-full rounded-full ${healthy ? 'bg-primary-500' : 'bg-accent-500'}`}
                          style={{ width: `${Math.min(density, 100)}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-[11px] font-medium ${
                          healthy ? 'text-primary-700' : 'text-accent-700'
                        }`}
                      >
                        {formatPct(density)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] leading-relaxed text-foreground-500">
        {t('insights.campus.densityHint')}
      </p>
    </div>
  );
}