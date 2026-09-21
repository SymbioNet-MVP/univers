import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useSuggestions } from '@/hooks/useSuggestions';
import LearnerCard from '@/components/feature/LearnerCard';
import ProfileStrength from '@/components/feature/ProfileStrength';
import VerificationBadge from '@/components/feature/VerificationBadge';
import EmptyState from '@/components/base/EmptyState';
import Spinner from '@/components/base/Spinner';
import InviteModule from './components/InviteModule';
import DashboardCommunity from './components/DashboardCommunity';
import FoundingFill from './components/FoundingFill';
import ActivationChecklist from '@/components/feature/ActivationChecklist';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { suggestions, loading, error, reload } = useSuggestions(8);

  const firstName = (profile?.full_name || '').split(' ')[0];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-foreground-950">
          {t('dashboard.greeting', { name: firstName || t('app.name') })}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-foreground-600">{t('dashboard.subtitle')}</p>
      </header>

      <ActivationChecklist />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground-950">
              {t('dashboard.topMatches')}
            </h2>
            <Link
              to="/app/matches"
              className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {t('dashboard.seeAll')}
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>

          {loading && (
            <div className="flex items-center justify-center rounded-lg border border-background-200 bg-background-50 py-16 text-foreground-500">
              <span className="w-8 h-8 flex items-center justify-center">
                <Spinner className="text-2xl" />
              </span>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-lg border border-background-200 bg-background-50 py-12 text-center">
              <p className="text-sm text-foreground-600">{t('common.error')}</p>
              <button
                type="button"
                onClick={() => void reload()}
                className="mt-3 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-background-50 hover:bg-primary-600"
              >
                <i className="ri-refresh-line"></i>
                {t('common.retry')}
              </button>
            </div>
          )}

          {!loading && !error && suggestions.length === 0 && (
            <EmptyState
              icon="ri-user-search-line"
              title={t('dashboard.noMatchesTitle')}
              body={t('dashboard.noMatchesBody')}
              action={
                <Link
                  to="/app/community"
                  className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
                >
                  <i className="ri-community-line"></i>
                  {t('dashboard.communityTitle')}
                </Link>
              }
            />
          )}

          {!loading && !error && suggestions.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {suggestions.map((suggestion) => (
                <LearnerCard key={suggestion.user_id} suggestion={suggestion} />
              ))}
              {suggestions.length < 3 && <FoundingFill />}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          {profile && <ProfileStrength profile={profile} />}

          <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
            <h3 className="font-heading text-sm font-semibold text-foreground-950">
              {t('profile.verification')}
            </h3>
            <p className="mt-1 truncate text-xs text-foreground-500">
              {profile?.institution_text || t('common.none')}
            </p>
            <div className="mt-3">
              <VerificationBadge status={profile?.verification || 'unverified'} />
            </div>
            <Link
              to="/app/profile"
              className="mt-4 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-3 py-2 text-sm font-medium text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-shield-check-line"></i>
              {t('onboarding.verifyButton')}
            </Link>
          </div>
        </aside>
      </div>
      <InviteModule />
      <DashboardCommunity />
    </div>
  );
}