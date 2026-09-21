import { useTranslation } from 'react-i18next';
import type { MatchFlags } from '@/types/db';

const ORDER: { key: keyof MatchFlags; labelKey: string; icon: string }[] = [
  { key: 'same_field', labelKey: 'match.sameField', icon: 'ri-book-2-line' },
  { key: 'same_language', labelKey: 'match.sameLanguage', icon: 'ri-translate-2' },
  { key: 'same_level', labelKey: 'match.sameLevel', icon: 'ri-stairs-line' },
  { key: 'same_institution', labelKey: 'match.sameInstitution', icon: 'ri-building-2-line' },
  { key: 'same_timezone', labelKey: 'match.sameTimezone', icon: 'ri-time-line' },
  { key: 'same_country', labelKey: 'match.sameCountry', icon: 'ri-map-pin-line' },
];

interface MatchReasonsProps {
  matching: MatchFlags;
  compact?: boolean;
}

export default function MatchReasons({ matching, compact = false }: MatchReasonsProps) {
  const { t } = useTranslation();
  const active = ORDER.filter((item) => matching?.[item.key]);

  if (active.length === 0) {
    return (
      <p className="text-xs text-foreground-500">
        <i className="ri-sparkling-line mr-1"></i>
        {t('dashboard.suggestedLearners')}
      </p>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {active.slice(0, 3).map((item) => (
          <span
            key={item.key}
            className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700"
          >
            <i className={`${item.icon} text-[12px]`}></i>
            {t(item.labelKey)}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-background-200 bg-background-50 p-3">
      <p className="text-xs font-medium text-foreground-600">{t('match.because')}</p>
      <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {active.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-xs text-foreground-800">
            <i className="ri-check-line text-primary-600"></i>
            {t(item.labelKey)}
          </li>
        ))}
      </ul>
    </div>
  );
}