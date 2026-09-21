import { useTranslation } from 'react-i18next';
import type { EventStat } from '@/hooks/useFounderInsights';

const LABELS: Record<string, string> = {
  signup_started: 'insights.events.signup_started',
  signup_completed: 'insights.events.signup_completed',
  signup_confirmation_pending: 'insights.events.signup_confirmation_pending',
  login_completed: 'insights.events.login_completed',
  onboarding_started: 'insights.events.onboarding_started',
  onboarding_step_completed: 'insights.events.onboarding_step_completed',
  onboarding_completed: 'insights.events.onboarding_completed',
  verification_submitted: 'insights.events.verification_submitted',
  profile_updated: 'insights.events.profile_updated',
  match_request_sent: 'insights.events.match_request_sent',
  first_match_request: 'insights.events.first_match_request',
  match_accepted: 'insights.events.match_accepted',
  conversation_opened: 'insights.events.conversation_opened',
  first_message_sent: 'insights.events.first_message_sent',
  invite_share: 'insights.events.invite_share',
  invite_copied: 'insights.events.invite_copied',
};

export default function EventTable({ events }: { events: EventStat[] }) {
  const { t } = useTranslation();

  if (events.length === 0) {
    return <p className="text-sm text-foreground-500">{t('insights.events.none')}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-background-200 text-left text-xs text-foreground-500">
            <th className="py-2 pr-3 font-medium">{t('insights.events.name')}</th>
            <th className="py-2 px-3 text-right font-medium">{t('insights.events.total')}</th>
            <th className="py-2 px-3 text-right font-medium">{t('insights.events.actors')}</th>
            <th className="py-2 pl-3 text-right font-medium">{t('insights.events.last30')}</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.event_name} className="border-b border-background-100 last:border-0">
              <td className="py-2.5 pr-3 text-foreground-800">
                <span className="inline-flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded bg-background-100 text-foreground-600">
                    <i className="ri-pulse-line text-xs"></i>
                  </span>
                  {LABELS[event.event_name]
                    ? t(LABELS[event.event_name])
                    : event.event_name}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right font-medium text-foreground-950">{event.total}</td>
              <td className="py-2.5 px-3 text-right text-foreground-700">{event.unique_actors}</td>
              <td className="py-2.5 pl-3 text-right text-foreground-700">{event.total_30d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}