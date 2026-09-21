import { useTranslation } from 'react-i18next';
import { LEVEL_OPTIONS, type OnboardingData, type OnboardingUpdate } from '@/pages/onboarding/types';

interface StepProps {
  data: OnboardingData;
  update: OnboardingUpdate;
}

const inputClass =
  'mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100';

const selectClass =
  'mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100';

export default function StepAbout({ data, update }: StepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="ob-name" className="block text-xs font-medium text-foreground-700">
          {t('onboarding.name')}
        </label>
        <input
          id="ob-name"
          type="text"
          value={data.fullName}
          placeholder={t('onboarding.namePlaceholder')}
          onChange={(event) => update('fullName', event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ob-field" className="block text-xs font-medium text-foreground-700">
            {t('onboarding.field')}
          </label>
          <input
            id="ob-field"
            type="text"
            value={data.fieldOfStudy}
            placeholder={t('onboarding.fieldPlaceholder')}
            onChange={(event) => update('fieldOfStudy', event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="ob-level" className="block text-xs font-medium text-foreground-700">
            {t('onboarding.level')}
          </label>
          <select
            id="ob-level"
            value={data.educationLevel}
            onChange={(event) =>
              update('educationLevel', event.target.value as OnboardingData['educationLevel'])
            }
            className={selectClass}
          >
            <option value="">—</option>
            {LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`onboarding.levels.${option.key}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ob-country" className="block text-xs font-medium text-foreground-700">
          {t('onboarding.country')}{' '}
          <span className="text-foreground-400">({t('common.optional')})</span>
        </label>
        <input
          id="ob-country"
          type="text"
          value={data.country}
          placeholder={t('onboarding.countryPlaceholder')}
          onChange={(event) => update('country', event.target.value)}
          className={inputClass}
        />
      </div>
    </div>
  );
}