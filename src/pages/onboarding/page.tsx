import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { track, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/hooks/useAuth';
import { useMatchPreview } from '@/hooks/useMatchPreview';
import { notifyEmail } from '@/lib/notifications';
import { useSeo } from '@/hooks/useSeo';
import Spinner from '@/components/base/Spinner';
import BrandLogo from '@/components/feature/BrandLogo';
import LanguageSwitcher from '@/components/feature/LanguageSwitcher';
import StepAbout from '@/pages/onboarding/components/StepAbout';
import StepStudy from '@/pages/onboarding/components/StepStudy';
import OnboardingPreview from '@/pages/onboarding/components/OnboardingPreview';
import type { OnboardingData, OnboardingUpdate } from '@/pages/onboarding/types';
import type { VerificationStatus } from '@/types/db';

const TOTAL_STEPS = 2;

const DETECTED_TIMEZONE = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
})();

export default function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, user, refreshProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<OnboardingData>({
    fullName: profile?.full_name || '',
    country: profile?.country || '',
    institutionId: profile?.institution_id || null,
    institutionText: profile?.institution_text || '',
    fieldOfStudy: profile?.field_of_study || '',
    educationLevel: profile?.education_level || '',
    language: profile?.languages?.[0] || 'English',
    timezone: profile?.timezone || DETECTED_TIMEZONE,
    interests: (profile?.interests || []).join(', '),
    goals: profile?.goals || '',
  });

  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verification, setVerification] = useState<VerificationStatus>(
    profile?.verification || 'unverified',
  );

  const preview = useMatchPreview({
    field: data.fieldOfStudy,
    level: data.educationLevel,
    institutionId: data.institutionId,
    interests: data.interests,
  });

  useEffect(() => {
    track(EVENTS.onboardingStarted);
  }, []);

  useSeo({
    title: t('seo.pages.onboarding.title'),
    description: t('seo.pages.onboarding.description'),
    robots: 'noindex,nofollow',
  });

  const update: OnboardingUpdate = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    track(EVENTS.onboardingStepCompleted, { step });
    setStep((value) => Math.min(TOTAL_STEPS, value + 1));
  };

  const handleVerify = async () => {
    if (!data.institutionId) return;
    setVerifying(true);
    setVerifyError(null);
    try {
      const { data: result, error: rpcError } = await supabase.rpc('submit_verification', {
        p_institution_id: data.institutionId,
        p_email: verifyEmail,
      });
      if (rpcError) throw rpcError;
      setVerification((result as VerificationStatus) || 'pending');
    } catch (err) {
      console.error(err);
      setVerifyError(t('common.error'));
    } finally {
      setVerifying(false);
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const interests = data.interests
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName.trim(),
          country: data.country.trim() || null,
          institution_id: data.institutionId,
          institution_text: data.institutionText.trim() || null,
          field_of_study: data.fieldOfStudy.trim() || null,
          education_level: data.educationLevel || null,
          languages: data.language ? [data.language] : [],
          timezone: data.timezone || null,
          interests,
          goals: data.goals.trim() || null,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      track(EVENTS.onboardingCompleted);
      notifyEmail('welcome');
      navigate('/app', { replace: true });
    } catch (err) {
      console.error(err);
      setError(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const canContinue = step === 1 ? data.fullName.trim().length > 1 : true;

  return (
    <div className="min-h-screen bg-background-100">
      <header className="border-b border-background-200 bg-background-50">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 md:px-8">
          <BrandLogo />
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="order-2 lg:order-1">
            <div className="mb-8">
              <p className="text-xs font-medium text-primary-600">
                {t('onboarding.step', { current: step, total: TOTAL_STEPS })}
              </p>
              <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground-950">
                {t('onboarding.title')}
              </h1>
              <p className="mt-1.5 text-sm text-foreground-600">{t('onboarding.subtitle')}</p>

              <div className="mt-5 flex items-center gap-2">
                {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${
                      index < step ? 'bg-primary-500' : 'bg-background-200'
                    }`}
                  ></span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-7">
              {step === 1 && <StepAbout data={data} update={update} />}
              {step === 2 && (
                <StepStudy
                  data={data}
                  update={update}
                  hasInstitution={Boolean(data.institutionId)}
                  verifyEmail={verifyEmail}
                  onVerifyEmailChange={setVerifyEmail}
                  onVerify={handleVerify}
                  verifying={verifying}
                  verifyError={verifyError}
                  verification={verification}
                />
              )}

              {error && (
                <p className="mt-5 rounded-md border border-accent-200 bg-accent-50 px-3 py-2 text-xs text-accent-800">
                  {error}
                </p>
              )}

              <div className="mt-7 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep((value) => Math.max(1, value - 1))}
                  disabled={step === 1}
                  className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-medium text-foreground-700 hover:bg-background-100 disabled:opacity-40"
                >
                  <i className="ri-arrow-left-line"></i>
                  {t('onboarding.back')}
                </button>

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={goNext}
                    className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600 disabled:opacity-50"
                  >
                    {t('onboarding.next')}
                    <i className="ri-arrow-right-line"></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleFinish}
                    className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600 disabled:opacity-60"
                  >
                    {saving ? <Spinner /> : <i className="ri-sparkling-line"></i>}
                    {saving ? t('onboarding.saving') : t('onboarding.finish')}
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside className="order-1 lg:order-2 lg:sticky lg:top-8">
            <OnboardingPreview
              count={preview.count}
              names={preview.names}
              loading={preview.loading}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}