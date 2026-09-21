import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Profile } from '@/types/db';

const GAP_ORDER = ['name', 'country', 'institution', 'field', 'level', 'languages', 'goals'] as const;

type GapKey = (typeof GAP_ORDER)[number];

const LABEL_KEYS: Record<GapKey, string> = {
  name: 'auth.fullName',
  country: 'onboarding.country',
  institution: 'onboarding.institution',
  field: 'onboarding.field',
  level: 'onboarding.level',
  languages: 'onboarding.language',
  goals: 'onboarding.goals',
};

export default function ProfileStrength({ profile }: { profile: Profile }) {
  const { t } = useTranslation();

  const checks: Record<GapKey, boolean> = {
    name: Boolean(profile.full_name),
    country: Boolean(profile.country),
    institution: Boolean(profile.institution_id || profile.institution_text),
    field: Boolean(profile.field_of_study),
    level: Boolean(profile.education_level),
    languages: (profile.languages?.length ?? 0) > 0,
    goals: Boolean(profile.goals),
  };

  const total = GAP_ORDER.length;
  const done = GAP_ORDER.filter((key) => checks[key]).length;
  const percent = Math.round((done / total) * 100);
  const missing = GAP_ORDER.filter((key) => !checks[key]);
  const shown = missing.slice(0, 3);
  const restCount = missing.length - shown.length;

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground-950">
          {t('dashboard.progressTitle')}
        </h3>
        <span className="text-sm font-semibold text-primary-600">{percent}%</span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background-200">
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {percent === 100 ? (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary-700">
          <i className="ri-check-double-line"></i>
          {t('dashboard.progressComplete')}
        </p>
      ) : (
        <>
          <p className="mt-3 text-xs text-foreground-600">{t('dashboard.progressMissing')}</p>

          <ul className="mt-3 space-y-2.5">
            {shown.map((key) => (
              <li key={key} className="flex items-start gap-2.5">
                <span className="mt-0.5 w-5 h-5 flex items-center justify-center rounded-full border border-background-300 text-foreground-500 shrink-0">
                  <i className="ri-add-line text-xs"></i>
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground-800">{t(LABEL_KEYS[key])}</p>
                  <p className="text-[11px] leading-snug text-foreground-500">
                    {t(`profile.gaps.${key}`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {restCount > 0 && (
            <p className="mt-2 text-[11px] text-foreground-500">
              {t('dashboard.moreGaps', { count: restCount })}
            </p>
          )}

          <Link
            to="/app/profile"
            className="mt-4 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-3 py-2 text-sm font-medium text-foreground-800 hover:bg-background-100"
          >
            <i className="ri-edit-line"></i>
            {t('dashboard.completeProfile')}
          </Link>
        </>
      )}
    </div>
  );
}