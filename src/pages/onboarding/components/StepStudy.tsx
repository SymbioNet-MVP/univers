import { useTranslation } from 'react-i18next';
import Spinner from '@/components/base/Spinner';
import InstitutionSearch from '@/pages/onboarding/components/InstitutionSearch';
import {
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  type OnboardingData,
  type OnboardingUpdate,
} from '@/pages/onboarding/types';
import type { VerificationStatus } from '@/types/db';

interface StepStudyProps {
  data: OnboardingData;
  update: OnboardingUpdate;
  hasInstitution: boolean;
  verifyEmail: string;
  onVerifyEmailChange: (value: string) => void;
  onVerify: () => void;
  verifying: boolean;
  verifyError: string | null;
  verification: VerificationStatus;
}

const fieldClass =
  'mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100';

export default function StepStudy({
  data,
  update,
  hasInstitution,
  verifyEmail,
  onVerifyEmailChange,
  onVerify,
  verifying,
  verifyError,
  verification,
}: StepStudyProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="ob-institution" className="block text-xs font-medium text-foreground-700">
          {t('onboarding.institution')}{' '}
          <span className="text-foreground-400">({t('common.optional')})</span>
        </label>
        <div className="mt-1.5">
          <InstitutionSearch
            selectedId={data.institutionId}
            text={data.institutionText}
            onChangeText={(text) => update('institutionText', text)}
            onSelect={(institution) =>
              update('institutionId', institution ? institution.id : null)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ob-language" className="block text-xs font-medium text-foreground-700">
            {t('onboarding.language')}
          </label>
          <select
            id="ob-language"
            value={data.language}
            onChange={(event) => update('language', event.target.value)}
            className={fieldClass}
          >
            <option value="">—</option>
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ob-timezone" className="block text-xs font-medium text-foreground-700">
            {t('onboarding.timezone')}
          </label>
          <select
            id="ob-timezone"
            value={data.timezone}
            onChange={(event) => update('timezone', event.target.value)}
            className={fieldClass}
          >
            <option value="">—</option>
            {TIMEZONE_OPTIONS.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ob-interests" className="block text-xs font-medium text-foreground-700">
          {t('onboarding.interests')}{' '}
          <span className="text-foreground-400">({t('common.optional')})</span>
        </label>
        <input
          id="ob-interests"
          type="text"
          value={data.interests}
          placeholder={t('onboarding.interestsHint')}
          onChange={(event) => update('interests', event.target.value)}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="ob-goals" className="block text-xs font-medium text-foreground-700">
          {t('onboarding.goals')}{' '}
          <span className="text-foreground-400">({t('common.optional')})</span>
        </label>
        <textarea
          id="ob-goals"
          rows={3}
          maxLength={500}
          value={data.goals}
          placeholder={t('onboarding.goalsPlaceholder')}
          onChange={(event) => update('goals', event.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="rounded-lg border border-background-200 bg-background-100 p-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 flex items-center justify-center rounded-md bg-primary-100 text-primary-600">
            <i className="ri-shield-check-line"></i>
          </span>
          <h3 className="font-heading text-sm font-semibold text-foreground-950">
            {t('onboarding.verifyTitle')}
          </h3>
        </div>
        <p className="mt-2 text-xs text-foreground-600">{t('onboarding.verifyHint')}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary-700">
          <i className="ri-arrow-up-circle-line"></i>
          {t('onboarding.verifyBoost')}
        </p>
        <p className="mt-1 text-xs text-foreground-500">{t('onboarding.verifyOptional')}</p>

        {verification === 'verified' ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700">
            <i className="ri-verified-badge-fill"></i>
            {t('onboarding.verifyVerified')}
          </div>
        ) : (
          <>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={verifyEmail}
                disabled={!hasInstitution}
                onChange={(event) => onVerifyEmailChange(event.target.value)}
                placeholder={t('onboarding.verifyEmail')}
                className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 disabled:opacity-60"
              />
              <button
                type="button"
                disabled={!hasInstitution || verifying || !verifyEmail}
                onClick={onVerify}
                className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-secondary-500 px-4 py-2.5 text-sm font-medium text-background-50 hover:bg-secondary-600 disabled:opacity-60"
              >
                {verifying && <Spinner />}
                {t('onboarding.verifyButton')}
              </button>
            </div>
            {!hasInstitution && (
              <p className="mt-2 text-xs text-foreground-500">{t('onboarding.verifyNeedsInstitution')}</p>
            )}
            {verification === 'pending' && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent-700">
                <i className="ri-time-line"></i>
                {t('onboarding.verifyPending')}
              </p>
            )}
            {verifyError && <p className="mt-2 text-xs text-accent-700">{verifyError}</p>}
          </>
        )}
      </div>
    </div>
  );
}