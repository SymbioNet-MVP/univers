import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/base/Avatar';
import Spinner from '@/components/base/Spinner';
import MatchReasons from '@/components/feature/MatchReasons';
import { useAuth } from '@/hooks/useAuth';
import { useIcebreakers } from '@/hooks/useIcebreakers';
import { supabase } from '@/lib/supabase';
import { track, trackOnce, EVENTS } from '@/lib/analytics';
import { notifyEmail } from '@/lib/notifications';
import type { MatchSuggestion } from '@/types/db';

interface LearnerCardProps {
  suggestion: MatchSuggestion;
  compact?: boolean;
}

export default function LearnerCard({ suggestion, compact = false }: LearnerCardProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sharedInterests = suggestion.shared_interests ?? [];
  const icebreakers = useIcebreakers({
    sharedInterests,
    field: suggestion.field_of_study,
  });

  const district = [suggestion.institution_name, suggestion.country].filter(Boolean).join(' · ');
  const isVerified = suggestion.verification === 'verified';

  const applyIcebreaker = (text: string) => {
    setMessage(text);
    track(EVENTS.icebreakerUsed, { surface: 'match_request' });
  };

  const sendRequest = async () => {
    if (!user) return;
    setSending(true);
    setError(null);
    try {
      const { data: inserted, error: insertError } = await supabase
        .from('match_requests')
        .insert({
          sender_id: user.id,
          receiver_id: suggestion.user_id,
          message: message.trim() || null,
        })
        .select('id')
        .single();
      if (insertError) throw insertError;
      if (inserted?.id) notifyEmail('match_request', inserted.id);
      track(EVENTS.matchRequestSent);
      trackOnce(EVENTS.firstMatchRequest);
      setSent(true);
      setOpen(false);
      setMessage('');
    } catch (err) {
      console.error(err);
      setError(t('common.error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <article className="flex flex-col rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <Avatar name={suggestion.full_name} url={suggestion.avatar_url} size={48} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-heading text-sm font-semibold text-foreground-950 md:text-base">
                {suggestion.full_name || t('common.none')}
              </h3>
              {isVerified && (
                <span className="inline-flex shrink-0 items-center gap-0.5 text-primary-600">
                  <i className="ri-verified-badge-fill text-sm"></i>
                  <span className="text-[11px] font-medium">{t('match.verified')}</span>
                </span>
              )}
              <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-semibold text-accent-900">
                {suggestion.score}%
              </span>
            </div>
            {district && <p className="mt-0.5 truncate text-xs text-foreground-500">{district}</p>}
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground-600">
              {suggestion.field_of_study && (
                <span className="inline-flex items-center gap-1">
                  <i className="ri-book-2-line"></i>
                  {suggestion.field_of_study}
                </span>
              )}
              {suggestion.education_level && (
                <span className="inline-flex items-center gap-1">
                  <i className="ri-stairs-line"></i>
                  {suggestion.education_level}
                </span>
              )}
            </div>
          </div>
        </div>

        {sharedInterests.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-foreground-500">
              {t('match.sharedInterests')}:
            </span>
            {sharedInterests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-secondary-100 px-2 py-0.5 text-[11px] font-medium text-secondary-900"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex-1">
          <MatchReasons matching={suggestion.matching} compact={compact} />
          {suggestion.goals && (
            <p className="mt-3 line-clamp-2 text-xs italic text-foreground-600">“{suggestion.goals}”</p>
          )}
        </div>

        <button
          type="button"
          disabled={sent}
          onClick={() => setOpen(true)}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
            sent
              ? 'cursor-default bg-primary-100 text-primary-700'
              : 'cursor-pointer bg-primary-500 text-background-50 hover:bg-primary-600'
          }`}
        >
          <i className={sent ? 'ri-check-line' : 'ri-user-add-line'}></i>
          {sent ? t('match.requested') : t('match.request')}
        </button>

        {sent && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-primary-700">
            <i className="ri-check-double-line"></i>
            {t('match.requestSent')}
          </p>
        )}
      </article>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg border border-background-200 bg-background-50 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-semibold text-foreground-950">
                {t('match.request')}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100"
                aria-label={t('match.cancel')}
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Avatar name={suggestion.full_name} url={suggestion.avatar_url} size={40} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground-950">{suggestion.full_name}</p>
                <p className="truncate text-xs text-foreground-500">{district}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="flex items-center gap-1.5 text-xs font-medium text-foreground-700">
                <i className="ri-magic-line text-accent-600"></i>
                {t('conversation.icebreakersTitle')}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {icebreakers.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => applyIcebreaker(text)}
                    className="cursor-pointer rounded-full border border-background-300 px-3 py-1.5 text-left text-[11px] font-medium text-foreground-700 transition-colors hover:border-primary-300 hover:bg-primary-50"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-4 block text-xs font-medium text-foreground-700">
              {t('match.writeMessage')}
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={500}
              rows={4}
              placeholder={t('match.messagePlaceholder')}
              className="mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />

            {error && <p className="mt-2 text-xs text-accent-700">{error}</p>}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer whitespace-nowrap rounded-md border border-background-300 px-4 py-2 text-sm font-medium text-foreground-700 hover:bg-background-100"
              >
                {t('match.cancel')}
              </button>
              <button
                type="button"
                disabled={sending}
                onClick={sendRequest}
                className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-background-50 hover:bg-primary-600 disabled:opacity-60"
              >
                {sending && <Spinner />}
                {t('match.send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}