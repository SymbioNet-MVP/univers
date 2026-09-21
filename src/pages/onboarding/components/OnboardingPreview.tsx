import { useTranslation } from 'react-i18next';
import Spinner from '@/components/base/Spinner';

interface OnboardingPreviewProps {
  count: number;
  names: string[];
  loading: boolean;
}

/**
 * Shows the learner that real people are already waiting — before they finish.
 * Value first, work second.
 */
export default function OnboardingPreview({ count, names, loading }: OnboardingPreviewProps) {
  const { t } = useTranslation();
  const hasMatches = count > 0;

  return (
    <div className="rounded-lg border border-primary-200 bg-primary-50/70 p-5">
      <div className="flex items-center gap-2 text-primary-700">
        <span className="w-8 h-8 flex items-center justify-center rounded-md bg-primary-100">
          <i className="ri-user-heart-line"></i>
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {t('onboarding.preview.title')}
        </span>
      </div>

      {loading ? (
        <div className="mt-4 flex h-16 items-center text-primary-700">
          <span className="w-6 h-6 flex items-center justify-center">
            <Spinner />
          </span>
        </div>
      ) : hasMatches ? (
        <>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading text-4xl font-semibold text-primary-700">{count}</span>
            <span className="text-sm leading-tight text-foreground-700">
              {t('onboarding.preview.learners')}
            </span>
          </div>

          {names.length > 0 && (
            <>
              <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-foreground-500">
                {t('onboarding.preview.samples')}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {names.map((name) => (
                  <span
                    key={name}
                    className="rounded-full bg-background-50 px-2.5 py-1 text-[11px] font-medium text-foreground-800"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </>
          )}

          <p className="mt-4 text-xs leading-relaxed text-foreground-600">
            {t('onboarding.preview.hint')}
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 font-heading text-base font-semibold text-foreground-950">
            {t('onboarding.preview.emptyTitle')}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground-600">
            {t('onboarding.preview.emptyBody')}
          </p>
          <p className="mt-3 text-xs text-foreground-500">{t('onboarding.preview.hintEmpty')}</p>
        </>
      )}
    </div>
  );
}