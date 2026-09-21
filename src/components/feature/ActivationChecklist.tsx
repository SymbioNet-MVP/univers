import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useActivation } from '@/hooks/useActivation';

const STORAGE_KEY = 'univers.activation.hidden';

interface StepDef {
  key: 'profile' | 'request' | 'conversation' | 'verify';
  icon: string;
  to: string;
  optional?: boolean;
}

const STEPS: StepDef[] = [
  { key: 'profile', icon: 'ri-user-line', to: '/app/profile' },
  { key: 'request', icon: 'ri-user-add-line', to: '/app' },
  { key: 'conversation', icon: 'ri-chat-3-line', to: '/app/chat' },
  { key: 'verify', icon: 'ri-shield-check-line', to: '/app/profile', optional: true },
];

export default function ActivationChecklist() {
  const { t } = useTranslation();
  const { state, loading } = useActivation();
  const [hidden, setHidden] = useState(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const doneMap: Record<StepDef['key'], boolean> = {
    profile: state.profileComplete,
    request: state.requested,
    conversation: state.conversation,
    verify: state.verified,
  };

  const doneCount = STEPS.filter((step) => doneMap[step.key]).length;
  const percent = Math.round((doneCount / STEPS.length) * 100);

  const dismiss = () => {
    setHidden(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* storage unavailable */
    }
  };

  if (hidden || loading || doneCount === STEPS.length) return null;

  return (
    <section className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 flex items-center justify-center rounded-md bg-accent-100 text-accent-800 shrink-0">
            <i className="ri-rocket-2-line text-lg"></i>
          </span>
          <div>
            <h2 className="font-heading text-base font-semibold text-foreground-950">
              {t('activation.title')}
            </h2>
            <p className="mt-0.5 text-sm text-foreground-600">{t('activation.subtitle')}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t('activation.dismiss')}
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 shrink-0"
        >
          <i className="ri-close-line text-lg"></i>
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-background-200">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <span className="shrink-0 text-xs font-semibold text-foreground-700">
          {t('activation.progress', { done: doneCount, total: STEPS.length })}
        </span>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {STEPS.map((step) => {
          const done = doneMap[step.key];
          return (
            <li
              key={step.key}
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                done
                  ? 'border-primary-200 bg-primary-50/60'
                  : 'border-background-200 bg-background-50'
              }`}
            >
              <span
                className={`mt-0.5 w-7 h-7 flex items-center justify-center rounded-full shrink-0 ${
                  done
                    ? 'bg-primary-500 text-background-50'
                    : 'border border-background-300 text-foreground-500'
                }`}
              >
                <i className={`${done ? 'ri-check-line' : step.icon} text-sm`}></i>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground-950">
                    {t(`activation.steps.${step.key}`)}
                  </p>
                  {step.optional && !done && (
                    <span className="rounded-full bg-secondary-100 px-2 py-0.5 text-[10px] font-medium text-secondary-900">
                      {t('common.optional')}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-foreground-600">
                  {t(`activation.steps.${step.key}Hint`)}
                </p>
                {!done && (
                  <Link
                    to={step.to}
                    className="mt-2 inline-flex cursor-pointer items-center gap-1 whitespace-nowrap text-xs font-semibold text-primary-600 hover:text-primary-700"
                  >
                    {t('activation.open')}
                    <i className="ri-arrow-right-line"></i>
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}