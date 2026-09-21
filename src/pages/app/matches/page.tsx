import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/base/Avatar';
import Spinner from '@/components/base/Spinner';
import EmptyState from '@/components/base/EmptyState';
import { useMatchRequests, type RequestWithProfile } from '@/hooks/useMatchRequests';

type Tab = 'incoming' | 'active' | 'sent';

function MetaLine({ counterpart }: { counterpart: RequestWithProfile['counterpart'] }) {
  const parts = [counterpart?.institution_text, counterpart?.field_of_study, counterpart?.country].filter(
    Boolean,
  );
  if (parts.length === 0) return null;
  return <p className="mt-0.5 truncate text-xs text-foreground-500">{parts.join(' · ')}</p>;
}

export default function MatchesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { incoming, outgoing, active, loading, error, reload, respond } = useMatchRequests();
  const [tab, setTab] = useState<Tab>('incoming');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [justMatched, setJustMatched] = useState<RequestWithProfile | null>(null);

  const handleRespond = async (id: string, accept: boolean) => {
    setBusyId(id);
    const request = incoming.find((item) => item.id === id) ?? null;
    try {
      await respond(id, accept);
      if (accept && request) {
        setJustMatched(request);
        setTab('active');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'incoming', label: t('matches.incoming'), count: incoming.length },
    { key: 'active', label: t('matches.active'), count: active.length },
    { key: 'sent', label: t('matches.outgoing'), count: outgoing.length },
  ];

  const renderIncoming = () =>
    incoming.map((request) => (
      <div
        key={request.id}
        className="flex flex-col gap-3 rounded-lg border border-background-200 bg-background-50 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={request.counterpart?.full_name} url={request.counterpart?.avatar_url} size={44} />
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold text-foreground-950">
              {request.counterpart?.full_name || t('common.none')}
            </p>
            <MetaLine counterpart={request.counterpart} />
            {request.message && (
              <p className="mt-1 line-clamp-1 text-xs italic text-foreground-600">“{request.message}”</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled={busyId === request.id}
            onClick={() => handleRespond(request.id, false)}
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-3 py-2 text-sm font-medium text-foreground-700 hover:bg-background-100 disabled:opacity-60"
          >
            {t('matches.decline')}
          </button>
          <button
            type="button"
            disabled={busyId === request.id}
            onClick={() => handleRespond(request.id, true)}
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-background-50 hover:bg-primary-600 disabled:opacity-60"
          >
            {busyId === request.id ? <Spinner /> : <i className="ri-check-line"></i>}
            {t('matches.accept')}
          </button>
        </div>
      </div>
    ));

  const renderActive = () =>
    active.map((request) => (
      <div
        key={request.id}
        className="flex flex-col gap-3 rounded-lg border border-background-200 bg-background-50 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={request.counterpart?.full_name} url={request.counterpart?.avatar_url} size={44} />
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold text-foreground-950">
              {request.counterpart?.full_name || t('common.none')}
            </p>
            <MetaLine counterpart={request.counterpart} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/app/chat')}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-background-50 hover:bg-primary-600"
        >
          <i className="ri-chat-3-line"></i>
          {t('matches.openChat')}
        </button>
      </div>
    ));

  const renderSent = () =>
    outgoing.map((request) => (
      <div
        key={request.id}
        className="flex items-center justify-between gap-3 rounded-lg border border-background-200 bg-background-50 p-4"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={request.counterpart?.full_name} url={request.counterpart?.avatar_url} size={44} />
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold text-foreground-950">
              {request.counterpart?.full_name || t('common.none')}
            </p>
            <MetaLine counterpart={request.counterpart} />
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            request.status === 'accepted'
              ? 'bg-primary-100 text-primary-700'
              : request.status === 'declined'
                ? 'bg-background-200 text-foreground-600'
                : 'bg-accent-100 text-accent-900'
          }`}
        >
          {request.status === 'accepted'
            ? t('match.accepted')
            : request.status === 'declined'
              ? t('matches.decline')
              : t('match.requested')}
        </span>
      </div>
    ));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-foreground-950">{t('matches.title')}</h1>
      </header>

      {justMatched && (
        <div className="flex flex-col gap-3 rounded-lg border border-primary-200 bg-primary-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              name={justMatched.counterpart?.full_name}
              url={justMatched.counterpart?.avatar_url}
              size={40}
            />
            <div className="min-w-0">
              <p className="truncate font-heading text-sm font-semibold text-foreground-950">
                {t('matches.matchedTitle')}
              </p>
              <p className="truncate text-xs text-foreground-600">
                {t('matches.matchedBody', { name: justMatched.counterpart?.full_name || t('common.none') })}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/app/chat')}
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-background-50 hover:bg-primary-600"
            >
              <i className="ri-chat-3-line"></i>
              {t('matches.openChat')}
            </button>
            <button
              type="button"
              onClick={() => setJustMatched(null)}
              aria-label={t('matches.dismiss')}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        </div>
      )}

      <div className="inline-flex items-center rounded-full border border-background-200 bg-background-100 px-1 py-1">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === item.key
                ? 'bg-background-50 text-foreground-950'
                : 'text-foreground-500 hover:text-foreground-800'
            }`}
          >
            {item.label}
            <span
              className={`rounded-full px-1.5 text-[11px] ${
                tab === item.key ? 'bg-primary-100 text-primary-700' : 'bg-background-200 text-foreground-600'
              }`}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-foreground-500">
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

      {!loading && !error && (
        <div className="space-y-3">
          {tab === 'incoming' && (incoming.length ? renderIncoming() : <EmptyState icon="ri-inbox-line" title={t('matches.empty')} />)}
          {tab === 'active' && (active.length ? renderActive() : <EmptyState icon="ri-user-heart-line" title={t('matches.empty')} />)}
          {tab === 'sent' && (outgoing.length ? renderSent() : <EmptyState icon="ri-send-plane-line" title={t('matches.empty')} />)}
        </div>
      )}
    </div>
  );
}