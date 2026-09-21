import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { track, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/base/Avatar';
import Spinner from '@/components/base/Spinner';
import VerificationBadge from '@/components/feature/VerificationBadge';
import InstitutionSearch from '@/pages/onboarding/components/InstitutionSearch';
import {
  LANGUAGE_OPTIONS,
  LEVEL_OPTIONS,
  TIMEZONE_OPTIONS,
} from '@/pages/onboarding/types';
import type { EducationLevel, VerificationStatus } from '@/types/db';

const inputClass =
  'mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { profile, user, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [institutionId, setInstitutionId] = useState<string | null>(profile?.institution_id || null);
  const [institutionText, setInstitutionText] = useState(profile?.institution_text || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(profile?.field_of_study || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>(
    profile?.education_level || '',
  );
  const [language, setLanguage] = useState(profile?.languages?.[0] || '');
  const [timezone, setTimezone] = useState(profile?.timezone || '');
  const [interests, setInterests] = useState((profile?.interests || []).join(', '));
  const [goals, setGoals] = useState(profile?.goals || '');
  const [bio, setBio] = useState(profile?.bio || '');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState<VerificationStatus>(
    profile?.verification || 'unverified',
  );

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          country: country.trim() || null,
          institution_id: institutionId,
          institution_text: institutionText.trim() || null,
          field_of_study: fieldOfStudy.trim() || null,
          education_level: educationLevel || null,
          languages: language ? [language] : [],
          timezone: timezone || null,
          interests: interests
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          goals: goals.trim() || null,
          bio: bio.trim() || null,
        })
        .eq('id', user.id);
      if (updateError) throw updateError;
      await refreshProfile();
      track(EVENTS.profileUpdated);
      setSaved(true);
    } catch (err) {
      console.error(err);
      setError(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async () => {
    if (!institutionId) return;
    setVerifying(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('submit_verification', {
        p_institution_id: institutionId,
        p_email: verifyEmail,
      });
      if (rpcError) throw rpcError;
      const result = (data as VerificationStatus) || 'pending';
      setVerification(result);
      track(EVENTS.verificationSubmitted, { status: result });
      await refreshProfile();
    } catch (err) {
      console.error(err);
      setError(t('common.error'));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-foreground-950">{t('profile.title')}</h1>
      </header>

      <div className="flex items-center gap-4 rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
        <Avatar name={fullName || profile?.full_name} url={profile?.avatar_url} size={64} />
        <div className="min-w-0">
          <p className="truncate font-heading text-lg font-semibold text-foreground-950">
            {fullName || user?.email}
          </p>
          <div className="mt-1">
            <VerificationBadge status={verification} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 rounded-lg border border-background-200 bg-background-50 p-4 md:p-6 lg:grid-cols-2">
        <div>
          <label htmlFor="pf-name" className="block text-xs font-medium text-foreground-700">
            {t('auth.fullName')}
          </label>
          <input id="pf-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="pf-country" className="block text-xs font-medium text-foreground-700">
            {t('onboarding.country')}
          </label>
          <input id="pf-country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="pf-institution" className="block text-xs font-medium text-foreground-700">
            {t('profile.institution')}
          </label>
          <div className="mt-1.5">
            <InstitutionSearch
              selectedId={institutionId}
              text={institutionText}
              onChangeText={setInstitutionText}
              onSelect={(institution) => setInstitutionId(institution ? institution.id : null)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="pf-field" className="block text-xs font-medium text-foreground-700">
            {t('profile.field')}
          </label>
          <input id="pf-field" type="text" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="pf-level" className="block text-xs font-medium text-foreground-700">
            {t('profile.level')}
          </label>
          <select
            id="pf-level"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value as EducationLevel | '')}
            className={inputClass}
          >
            <option value="">—</option>
            {LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`onboarding.levels.${option.key}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pf-language" className="block text-xs font-medium text-foreground-700">
            {t('profile.languages')}
          </label>
          <select id="pf-language" value={language} onChange={(e) => setLanguage(e.target.value)} className={inputClass}>
            <option value="">—</option>
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pf-timezone" className="block text-xs font-medium text-foreground-700">
            {t('profile.timezone')}
          </label>
          <select id="pf-timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputClass}>
            <option value="">—</option>
            {TIMEZONE_OPTIONS.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="pf-interests" className="block text-xs font-medium text-foreground-700">
            {t('profile.interests')}
          </label>
          <input id="pf-interests" type="text" value={interests} onChange={(e) => setInterests(e.target.value)} className={inputClass} />
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="pf-goals" className="block text-xs font-medium text-foreground-700">
            {t('profile.goals')}
          </label>
          <textarea id="pf-goals" rows={3} maxLength={500} value={goals} onChange={(e) => setGoals(e.target.value)} className={inputClass} />
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="pf-bio" className="block text-xs font-medium text-foreground-700">
            {t('profile.bio')}
          </label>
          <textarea
            id="pf-bio"
            rows={3}
            maxLength={500}
            value={bio}
            placeholder={t('profile.bioPlaceholder')}
            onChange={(e) => setBio(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-accent-200 bg-accent-50 px-3 py-2 text-xs text-accent-800">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600 disabled:opacity-60"
        >
          {saving ? <Spinner /> : <i className="ri-save-line"></i>}
          {saving ? t('onboarding.saving') : t('profile.save')}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-primary-600">
            <i className="ri-check-line"></i>
            {t('profile.saved')}
          </span>
        )}
      </div>

      <div className="rounded-lg border border-background-200 bg-background-100 p-4 md:p-5">
        <h3 className="font-heading text-sm font-semibold text-foreground-950">
          {t('onboarding.verifyTitle')}
        </h3>
        <p className="mt-1.5 text-xs text-foreground-600">{t('onboarding.verifyHint')}</p>

        {verification === 'verified' ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700">
            <i className="ri-verified-badge-fill"></i>
            {t('onboarding.verifyVerified')}
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={verifyEmail}
              onChange={(e) => setVerifyEmail(e.target.value)}
              placeholder={t('onboarding.verifyEmail')}
              className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
            <button
              type="button"
              disabled={verifying || !verifyEmail || !institutionId}
              onClick={handleVerify}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-secondary-500 px-4 py-2.5 text-sm font-medium text-background-50 hover:bg-secondary-600 disabled:opacity-60"
            >
              {verifying && <Spinner />}
              {t('onboarding.verifyButton')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}