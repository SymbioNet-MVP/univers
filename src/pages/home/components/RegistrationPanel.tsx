import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { track, EVENTS } from '@/lib/analytics';
import { notifyEmail } from '@/lib/notifications';
import Spinner from '@/components/base/Spinner';

const BASE_PREFIX = (__BASE_PATH__ || '/').replace(/\/+$/, '');
/** Post-auth destination: /app, which sends un-onboarded learners to /onboarding. */
const APP_REDIRECT = `${window.location.origin}${BASE_PREFIX}/app`;

interface PathOption {
  key: string;
  title: string;
}

interface RegistrationPanelProps {
  goal: string | null;
}

/**
 * The registration form, visible directly on the landing page — no extra step
 * between "I'm curious" and "I have an account".
 */
export default function RegistrationPanel({ goal }: RegistrationPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [resendOk, setResendOk] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const options = t('landing.paths.options', { returnObjects: true }) as unknown as PathOption[];
  const goalTitle = goal ? options.find((option) => option.key === goal)?.title : undefined;

  const handleStart = () => {
    if (started) return;
    setStarted(true);
    track(EVENTS.signupStarted, { source: 'landing' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, goal }, emailRedirectTo: APP_REDIRECT },
      });
      if (signUpError) throw signUpError;
      track(EVENTS.signupCompleted, { needsConfirmation: !data.session, source: 'landing' });
      notifyEmail('welcome');
      if (data.session) {
        navigate('/onboarding', { replace: true });
      } else {
        setResendOk(false);
        setResendError(null);
        setConfirmSent(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(
        message.toLowerCase().includes('invalid')
          ? t('landing.register.errorInvalid')
          : t('landing.register.errorGeneric'),
      );
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendBusy(true);
    setResendOk(false);
    setResendError(null);
    try {
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: APP_REDIRECT },
      });
      if (resendErr) throw resendErr;
      setResendOk(true);
    } catch {
      setResendError(t('landing.register.resendError'));
    } finally {
      setResendBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: APP_REDIRECT },
      });
      if (oauthError) throw oauthError;
    } catch {
      setError(t('landing.register.errorGeneric'));
    }
  };

  const inputClass =
    'mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100';

  return (
    <div id="register" className="w-full scroll-mt-24">
      <div className="rounded-lg border border-background-200 bg-background-50 p-6 md:p-7">
        {confirmSent ? (
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <i className="ri-mail-check-line text-xl"></i>
            </span>
            <h2 className="mt-4 font-heading text-xl font-semibold text-foreground-950">
              {t('landing.register.confirmTitle')}
            </h2>
            <p className="mt-1.5 text-sm text-foreground-600">{t('landing.register.confirmBody')}</p>

            <p className="mt-3 break-all rounded-md border border-background-200 bg-background-100 px-3 py-2.5 text-sm font-medium text-foreground-950">
              {email}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-foreground-600">
              {t('landing.register.confirmHint')}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-foreground-500">
              {t('landing.register.confirmSpam')}
            </p>

            {resendOk && (
              <p className="mt-3 rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-xs text-primary-700">
                {t('landing.register.resendSent')}
              </p>
            )}
            {resendError && (
              <p className="mt-3 rounded-md border border-accent-200 bg-accent-50 px-3 py-2 text-xs text-accent-800">
                {resendError}
              </p>
            )}

            <button
              type="button"
              onClick={handleResend}
              disabled={resendBusy}
              className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-3 text-sm font-medium text-foreground-800 hover:bg-background-100 disabled:opacity-60"
            >
              {resendBusy ? <Spinner /> : <i className="ri-mail-send-line"></i>}
              {resendBusy ? t('landing.register.resending') : t('landing.register.resend')}
            </button>

            <p className="mt-4 text-center text-sm text-foreground-600">
              <button
                type="button"
                onClick={() => {
                  setConfirmSent(false);
                  setResendOk(false);
                  setResendError(null);
                }}
                className="cursor-pointer font-medium text-primary-600 hover:text-primary-700"
              >
                {t('landing.register.useDifferentEmail')}
              </button>
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-heading text-xl font-semibold text-foreground-950">
              {t('landing.register.title')}
            </h2>
            <p className="mt-1.5 text-sm text-foreground-600">{t('landing.register.subtitle')}</p>

            {goalTitle && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800">
                <i className="ri-focus-2-line"></i>
                {t('landing.register.goalSelected')}: {goalTitle}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-medium text-foreground-700">
                  {t('landing.register.fullName')}
                </label>
                <input
                  id="reg-name"
                  name="fullName"
                  type="text"
                  required
                  onFocus={handleStart}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs font-medium text-foreground-700">
                  {t('landing.register.email')}
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onFocus={handleStart}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-xs font-medium text-foreground-700">
                  {t('landing.register.password')}
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  onFocus={handleStart}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClass}
                />
              </div>

              {error && (
                <p className="rounded-md border border-accent-200 bg-accent-50 px-3 py-2 text-xs text-accent-800">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-3 text-sm font-medium text-background-50 hover:bg-primary-600 disabled:opacity-60"
              >
                {busy && <Spinner />}
                {busy ? t('landing.register.working') : t('landing.register.submit')}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-background-200"></span>
              <span className="text-xs text-foreground-500">{t('landing.register.or')}</span>
              <span className="h-px flex-1 bg-background-200"></span>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-3 text-sm font-medium text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-google-fill text-lg text-accent-600"></i>
              {t('landing.register.google')}
            </button>

            <p className="mt-5 text-center text-sm text-foreground-600">
              {t('landing.register.haveAccount')}{' '}
              <Link to="/login" className="cursor-pointer font-medium text-primary-600 hover:text-primary-700">
                {t('landing.register.signIn')}
              </Link>
            </p>
          </>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-foreground-500">{t('landing.register.note')}</p>
    </div>
  );
}