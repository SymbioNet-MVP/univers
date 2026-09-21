import { supabase } from '@/lib/supabase';
import { getStoredLang } from '@/lib/lang';

export type TransactionalEmailType =
  | 'welcome'
  | 'match_request'
  | 'match_accepted'
  | 'new_message';

/**
 * Fire-and-forget transactional email. The edge function resolves the real
 * recipient from the database (never from the client) and deduplicates.
 * A failure here must never affect the product.
 */
export function notifyEmail(type: TransactionalEmailType, refId?: string): void {
  void (async () => {
    try {
      await supabase.functions.invoke('send-transactional-email', {
        body: { type, refId: refId ?? null, locale: getStoredLang() ?? 'en' },
      });
    } catch {
      /* notifications must never break the product */
    }
  })();
}