import { supabase } from '@/lib/supabase';
import { getVisitorId } from '@/lib/invites';
import { getStoredLang } from '@/lib/lang';

export type EventProps = Record<string, string | number | boolean | null | undefined>;

interface EventPayload {
  user_id: string | null;
  anonymous_id: string;
  event_name: string;
  props?: Record<string, string | number | boolean | null>;
  locale: string | null;
}

let currentUserId: string | null = null;

/**
 * Kept in sync by AuthProvider. Lets us attribute anonymous visitors to the
 * account they later create on the same device.
 */
export function setAnalyticsUser(userId: string | null): void {
  currentUserId = userId;
}

/** Canonical funnel event names — keep in sync with the founder insights view. */
export const EVENTS = {
  signupStarted: 'signup_started',
  signupCompleted: 'signup_completed',
  signupConfirmPending: 'signup_confirmation_pending',
  loginCompleted: 'login_completed',
  onboardingStarted: 'onboarding_started',
  onboardingStepCompleted: 'onboarding_step_completed',
  onboardingCompleted: 'onboarding_completed',
  verificationSubmitted: 'verification_submitted',
  profileUpdated: 'profile_updated',
  matchRequestSent: 'match_request_sent',
  firstMatchRequest: 'first_match_request',
  matchAccepted: 'match_accepted',
  conversationOpened: 'conversation_opened',
  firstMessageSent: 'first_message_sent',
  icebreakerUsed: 'icebreaker_used',
  inviteShare: 'invite_share',
  inviteCopied: 'invite_copied',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

function clean(props?: EventProps): Record<string, string | number | boolean | null> | undefined {
  if (!props) return undefined;
  const out: Record<string, string | number | boolean | null> = {};
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) out[key] = value;
  });
  return out;
}

async function persist(payload: EventPayload): Promise<void> {
  try {
    const { error } = await supabase.from('analytics_events').insert(payload);
    // A brand new session may not have its profile row yet — retry without it.
    if (error && payload.user_id) {
      await supabase.from('analytics_events').insert({ ...payload, user_id: null });
    }
  } catch {
    /* analytics must never break the product */
  }
}

/** Fire-and-forget funnel event. Never throws, never blocks the UI. */
export function track(event: EventName | string, props?: EventProps): void {
  void persist({
    user_id: currentUserId,
    anonymous_id: getVisitorId(),
    event_name: event,
    props: clean(props),
    locale: getStoredLang(),
  });
}

/** Fires at most once per learner (per browser) — for "first X" milestones. */
export function trackOnce(event: EventName | string, props?: EventProps): void {
  const scope = currentUserId ?? 'anon';
  const key = `univers.evt.${scope}.${event}`;
  try {
    if (window.localStorage.getItem(key)) return;
    window.localStorage.setItem(key, '1');
  } catch {
    /* storage unavailable — still fire so the event is not lost */
  }
  track(event, props);
}