import { useTranslation } from 'react-i18next';
import EmptyState from '@/components/base/EmptyState';
import Spinner from '@/components/base/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useFounderInsights } from '@/hooks/useFounderInsights';
import KpiGrid from '@/pages/app/insights/components/KpiGrid';
import FunnelView from '@/pages/app/insights/components/FunnelView';
import ReferralInsights from '@/pages/app/insights/components/ReferralInsights';
import CampusDensity from '@/pages/app/insights/components/CampusDensity';
import EventTable from '@/pages/app/insights/components/EventTable';

const ENGAGEMENT_ROWS = [
  { key: 'match_requests', label: 'engagement.matchRequests' },
  { key: 'match_accepts', label: 'engagement.matchAccepts' },
  { key: 'matches', label: 'engagement.matches' },
  { key: 'conversations', label: 'engagement.conversations' },
  { key: 'conversations_with_message', label: 'engagement.conversationsWithMessage' },
  { key: 'messages', label: 'engagement.messages' },
] as const;

export default function FounderInsightsPage() {
  const { t } = useTranslation();
  const { profile, profileLoading } = useAuth();
  const isFounder = Boolean(profile?.is_founder);
  const { data, loading, error, reload } = useFounderInsights(isFounder);

  const authorized = Boolean(data?.authorized);
  const funnel = data?.funnel ?? [];
  const engagement = data?.engagement;
  const referrals = data?.referrals;
  const campus = data?.campus ?? [];
  const events = data?.events ?? [];
  const signups = engagement?.signups ?? 0;
  const activationRate =
    signups > 0 ? Math.round(((engagement?.first_conversation ?? 0) / signups) * 1000) / 10 : 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-medium text-secondary-900">
            <i className="ri-lock-2-line"></i>
            {t('insights.internal')}
          </span>
          <h1 className="mt-3 font-heading text-2xl font-semibold text-foreground-950">
            {t('insights.title')}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-foreground-600">{t('insights.subtitle')}</p>
        </div>
        {authorized && (
          <button
            type="button"
            onClick={() => void reload()}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-4 py-2 text-sm font-medium text-foreground-800 hover:bg-background-100"
          >
            <i className="ri-refresh-line"></i>
            {t('insights.refresh')}
          </button>
        )}
      </header>

      {profileLoading && (
        <div className="flex items-center justify-center py-20 text-foreground-500">
          <span className="w-8 h-8 flex items-center justify-center">
            <Spinner className="text-2xl" />
          </span>
        </div>
      )}

      {!profileLoading && !isFounder && (
        <EmptyState
          icon="ri-lock-2-line"
          title={t('insights.restrictedTitle')}
          body={t('insights.restrictedBody')}
        />
      )}

      {!profileLoading && isFounder && loading && (
        <div className="flex items-center justify-center py-20 text-foreground-500">
          <span className="w-8 h-8 flex items-center justify-center">
            <Spinner className="text-2xl" />
          </span>
        </div>
      )}

      {!profileLoading && isFounder && !loading && error && (
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

      {!profileLoading && isFounder && !loading && !error && !authorized && (
        <EmptyState
          icon="ri-shield-keyhole-line"
          title={t('insights.restrictedTitle')}
          body={t('insights.restrictedBody')}
        />
      )}

      {!profileLoading && isFounder && !loading && !error && authorized && (
        <>
          {/* Activation highlight */}
          <section className="rounded-lg border border-primary-200 bg-primary-50/70 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-sm font-semibold text-foreground-950">
                  {t('insights.activationTitle')}
                </h2>
                <p className="mt-1 text-xs text-foreground-600">{t('insights.activationHint')}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-3xl font-semibold text-primary-700">
                  {activationRate}
                </span>
                <span className="text-sm text-primary-700">%</span>
              </div>
            </div>
          </section>

          {signups === 0 ? (
            <EmptyState icon="ri-bar-chart-line" title={t('insights.emptyTitle')} body={t('insights.emptyBody')} />
          ) : (
            <>
              <section>
                <h2 className="mb-3 font-heading text-lg font-semibold text-foreground-950">
                  {t('insights.kpisTitle')}
                </h2>
                <KpiGrid stages={funnel} />
              </section>

              <section className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-6">
                <h2 className="font-heading text-lg font-semibold text-foreground-950">
                  {t('insights.funnelTitle')}
                </h2>
                <p className="mt-1 mb-5 max-w-2xl text-sm text-foreground-600">
                  {t('insights.funnelHint')}
                </p>
                <FunnelView stages={funnel} />
              </section>
            </>
          )}

          {referrals && (
            <section className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-6">
              <h2 className="font-heading text-lg font-semibold text-foreground-950">
                {t('insights.referralsTitle')}
              </h2>
              <p className="mt-1 mb-5 text-sm text-foreground-600">{t('insights.referralsHint')}</p>
              <ReferralInsights referrals={referrals} />
            </section>
          )}

          {campus.length > 0 && (
            <section className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-6">
              <h2 className="font-heading text-lg font-semibold text-foreground-950">
                {t('insights.campusTitle')}
              </h2>
              <p className="mt-1 mb-5 max-w-2xl text-sm text-foreground-600">
                {t('insights.campusHint')}
              </p>
              <CampusDensity campus={campus} />
            </section>
          )}

          {engagement && (
            <section className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-6">
              <h2 className="mb-4 font-heading text-lg font-semibold text-foreground-950">
                {t('insights.engagementTitle')}
              </h2>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ENGAGEMENT_ROWS.map((row) => (
                  <div
                    key={row.key}
                    className="flex items-center justify-between rounded-md border border-background-200 bg-background-100/60 px-3.5 py-3"
                  >
                    <dt className="text-xs text-foreground-600">{t(`insights.${row.label}`)}</dt>
                    <dd className="font-heading text-base font-semibold text-foreground-950">
                      {engagement[row.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground-950">
              {t('insights.eventsTitle')}
            </h2>
            <p className="mt-1 mb-4 text-sm text-foreground-600">{t('insights.eventsHint')}</p>
            <EventTable events={events} />
          </section>
        </>
      )}
    </div>
  );
}