import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface IcebreakerContext {
  sharedInterests?: string[] | null;
  field?: string | null;
}

/**
 * Builds ready-to-send openers from the overlap between two learners.
 * The more the platform knows, the more personal the first message feels —
 * which is exactly what lowers the barrier to the first conversation.
 */
export function useIcebreakers({ sharedInterests, field }: IcebreakerContext): string[] {
  const { t } = useTranslation();
  const interestsKey = (sharedInterests ?? []).join('|');

  return useMemo(() => {
    const first = (sharedInterests ?? [])[0];
    const list: string[] = [];
    if (first) list.push(t('conversation.icebreakers.interest', { interest: first }));
    if (field) list.push(t('conversation.icebreakers.field', { field }));
    list.push(t('conversation.icebreakers.week'));
    list.push(t('conversation.icebreakers.generic'));
    return Array.from(new Set(list)).slice(0, 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, interestsKey, field]);
}