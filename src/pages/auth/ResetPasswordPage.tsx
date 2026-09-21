import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useSeo } from '@/hooks/useSeo';
import Spinner from '@/components/base/Spinner';
import BrandLogo from '@/components/feature/BrandLogo';
import LanguageSwitcher from '@/components/feature/LanguageSwitcher';

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useSeo({
    title: t('seo.pages.reset.title'),
    description: t('seo.pages.reset.description'),
    robots: 'noindex,nofollow',
  });

  useEffect(() => {
    let active = true;

    // The recovery link establishes a session and fires PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
        setChecking(false);
      }
    });

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        if (data.session) setReady(true);
        setChecking(false);
      })
      .catch(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setDone(true);
      window.setTimeout(() => navigate('/app', { replace: true }), 1200);
    } catch {
      setError(t('auth.errorGeneric'));
    } finally {
      setBusy(false);
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

            <div className="mt-8 lg:mt-0">
              <h1 className="font-heading text-2xl font-semibold text-foreground-950">
                {t('auth.resetTitle')}
              </h1>
              <p className="mt-1.5 text-sm text-foreground-600">{t('auth.resetSubtitle')}</p>
            </div>

            {checking ? (
              <p className="mt-7 flex items-center gap-2 text-sm text-foreground-600">
                <Spinner /> {t('auth.resetChecking')}
              </p>
            ) : !ready ? (
              <div className="mt-7 rounded-md border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-800">
                {t('auth.resetInvalid')}
              </div>
            ) : done ? (
              <p className="mt-7 rounded-md border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-700">
                {t('auth.resetSuccess')}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-xs font-medium text-foreground-700">
                    {t('auth.newPassword')}
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
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
                  {busy ? t('auth.working') : t('auth.resetButton')}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-foreground-600">
              <Link
                to="/login"
                className="cursor-pointer font-medium text-primary-600 hover:text-primary-700"
              >
                {t('auth.backToLogin')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}