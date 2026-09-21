import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { track, EVENTS } from '@/lib/analytics';
import { notifyEmail } from '@/lib/notifications';
import { useSeo } from '@/hooks/useSeo';
import { siteBase } from '@/lib/seo';
import { webPageSchema } from '@/lib/schema';
import Spinner from '@/components/base/Spinner';
import BrandLogo from '@/components/feature/BrandLogo';
import LanguageSwitcher from '@/components/feature/LanguageSwitcher';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

const BASE_PREFIX = (__BASE_PATH__ || '/').replace(/\/+$/, '');
/** Post-auth destination: /app, which redirects un-onboarded users to /onboarding. */
const APP_REDIRECT = `${window.location.origin}${BASE_PREFIX}/app`;
/** Password-recovery destination — where the user sets a new password. */
const RESET_REDIRECT = `${window.location.origin}${BASE_PREFIX}/reset-password`;

export default function AuthPage({ mode }: AuthPageProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);

  // Email-confirmation state (shown after signup when the session is not active yet).
  const [confirmSent, setConfirmSent] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [resendOk, setResendOk] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignup) track(EVENTS.signupStarted);
  }, [isSignup]);

  useSeo({
    title: t(`seo.pages.${isSignup ? 'signup' : 'login'}.title`),
    description: t(`seo.pages.${isSignup ? 'signup' : 'login'}.description`),
    path: isSignup ? '/signup' : '/login',
    robots: 'index,follow',
    jsonLd: [
      webPageSchema(siteBase(), {
        name: t(`seo.pages.${isSignup ? 'signup' : 'login'}.title`),
        description: t(`seo.pages.${isSignup ? 'signup' : 'login'}.description`),
        path: isSignup ? '/signup' : '/login',
        lang: i18n.language?.startsWith('de') ? 'de' : 'en',
      }),
    ],
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (resetMode) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: RESET_REDIRECT,
        });
        if (resetError) throw resetError;
        setNotice(t('auth.resetSent'));
        return;
      }
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName }, emailRedirectTo: APP_REDIRECT },
        });
        if (signUpError) throw signUpError;
        track(EVENTS.signupCompleted, { needsConfirmation: !data.session });
        notifyEmail('welcome');
        if (data.session) {
          navigate('/onboarding', { replace: true });
        } else {
          setResendOk(false);
          setResendError(null);
          setConfirmSent(true);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        track(EVENTS.loginCompleted);
        navigate('/app', { replace: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(message.toLowerCase().includes('invalid') ? t('auth.errorInvalid') : t('auth.errorGeneric'));
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
    } catch (err) {
      console.error(err);
      setResendError(t('auth.resendError'));
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
    } catch (err) {
      console.error(err);
      setError(t('auth.errorGeneric'));
    }
  };

  return (
    <div className="min-h-screen bg-background-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary-950 p-12">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'url(https://readdy.ai/api/search-image?query=abstract%20academic%20network%20visualization%20with%20soft%20green%20nodes%20connected%20by%20thin%20lines%20on%20a%20deep%20forest%20green%20background%2C%20minimal%20editorial%20style%2C%20calm%20and%20premium&width=1200&height=1600&seq=univers-auth-panel-02&orientation=portrait)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <BrandLogo to="/" tone="dark" className="relative" />

          <div className="relative">
            <h2 className="font-heading text-3xl font-semibold leading-tight text-background-50">
              {t('app.tagline')}
            </h2>
            <ul className="mt-6 space-y-3 text-sm text-background-200">
              {[t('match.sameField'), t('match.sameLanguage'), t('match.sameLevel')].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <i className="ri-check-line text-accent-300"></i>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-xs text-background-200/70">
            © {new Date().getFullYear()} {t('app.name')}
          </p>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center px-4 py-10 md:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex items-center justify-between lg:hidden">
              <BrandLogo size="sm" />
              <LanguageSwitcher />
            </div>

            {confirmSent ? (
              <div className="mt-8 lg:mt-0">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <i className="ri-mail-check-line text-2xl"></i>
                </span>
                <h1 className="mt-5 font-heading text-2xl font-semibold text-foreground-950">
                  {t('auth.confirmTitle')}
                </h1>
                <p className="mt-1.5 text-sm text-foreground-600">{t('auth.confirmBody')}</p>

                <p className="mt-4 break-all rounded-md border border-background-200 bg-background-100 px-3 py-2.5 text-sm font-medium text-foreground-950">
                  {email}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-foreground-600">
                  {t('auth.confirmHint')}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-foreground-500">
                  {t('auth.confirmSpam')}
                </p>

                {resendOk && (
                  <p className="mt-4 rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-xs text-primary-700">
                    {t('auth.resendSent')}
                  </p>
                )}
                {resendError && (
                  <p className="mt-4 rounded-md border border-accent-200 bg-accent-50 px-3 py-2 text-xs text-accent-800">
                    {resendError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendBusy}
                  className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-3 text-sm font-medium text-foreground-800 hover:bg-background-100 disabled:opacity-60"
                >
                  {resendBusy ? <Spinner /> : <i className="ri-mail-send-line"></i>}
                  {resendBusy ? t('auth.resending') : t('auth.resend')}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-3 text-sm font-medium text-background-50 hover:bg-primary-600"
                >
                  <i className="ri-login-circle-line"></i>
                  {t('auth.backToLogin')}
                </button>

                <p className="mt-6 text-center text-sm text-foreground-600">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmSent(false);
                      setResendOk(false);
                      setResendError(null);
                    }}
                    className="cursor-pointer font-medium text-primary-600 hover:text-primary-700"
                  >
                    {t('auth.useDifferentEmail')}
                  </button>
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8 lg:mt-0">
                  <h1 className="font-heading text-2xl font-semibold text-foreground-950">
                    {resetMode ? t('auth.resetTitle') : isSignup ? t('auth.signupTitle') : t('auth.loginTitle')}
                  </h1>
                  <p className="mt-1.5 text-sm text-foreground-600">
                    {resetMode
                      ? t('auth.resetEmailHint')
                      : isSignup
                        ? t('auth.signupSubtitle')
                        : t('auth.loginSubtitle')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  {isSignup && (
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-medium text-foreground-700">
                        {t('auth.fullName')}
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-foreground-700">
                      {t('auth.email')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  {!resetMode && (
                    <div>
                      <label htmlFor="password" className="block text-xs font-medium text-foreground-700">
                        {t('auth.password')}
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        autoComplete={isSignup ? 'new-password' : 'current-password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                      />
                      {!isSignup && (
                        <div className="mt-2 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setResetMode(true);
                              setError(null);
                              setNotice(null);
                            }}
                            className="cursor-pointer text-xs font-medium text-primary-600 hover:text-primary-700"
                          >
                            {t('auth.forgotPassword')}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <p className="rounded-md border border-accent-200 bg-accent-50 px-3 py-2 text-xs text-accent-800">
                      {error}
                    </p>
                  )}

                  {notice && (
                    <p className="rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-xs text-primary-700">
                      {notice}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-3 text-sm font-medium text-background-50 hover:bg-primary-600 disabled:opacity-60"
                  >
                    {busy && <Spinner />}
                    {busy
                      ? t('auth.working')
                      : resetMode
                        ? t('auth.sendResetLink')
                        : isSignup
                          ? t('auth.signup')
                          : t('auth.login')}
                  </button>
                </form>

                {resetMode ? (
                  <p className="mt-6 text-center text-sm text-foreground-600">
                    <button
                      type="button"
                      onClick={() => {
                        setResetMode(false);
                        setError(null);
                        setNotice(null);
                      }}
                      className="cursor-pointer font-medium text-primary-600 hover:text-primary-700"
                    >
                      {t('auth.backToLogin')}
                    </button>
                  </p>
                ) : (
                  <>
                    <div className="my-6 flex items-center gap-3">
                      <span className="h-px flex-1 bg-background-200"></span>
                      <span className="text-xs text-foreground-500">{t('auth.or')}</span>
                      <span className="h-px flex-1 bg-background-200"></span>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogle}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-3 text-sm font-medium text-foreground-800 hover:bg-background-100"
                    >
                      <i className="ri-google-fill text-lg text-accent-600"></i>
                      {t('auth.continueGoogle')}
                    </button>

                    <p className="mt-7 text-center text-sm text-foreground-600">
                      {isSignup ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
                      <Link
                        to={isSignup ? '/login' : '/signup'}
                        className="cursor-pointer font-medium text-primary-600 hover:text-primary-700"
                      >
                        {isSignup ? t('auth.switchToLogin') : t('auth.switchToSignup')}
                      </Link>
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}