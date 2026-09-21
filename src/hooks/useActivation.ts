import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export interface ActivationState {
  profileComplete: boolean;
  requested: boolean;
  conversation: boolean;
  verified: boolean;
}

const INITIAL: ActivationState = {
  profileComplete: false,
  requested: false,
  conversation: false,
  verified: false,
};

/**
 * Derives the real activation progress of the current learner so we can guide
 * them to their first conversation without inventing extra work.
 */
export function useActivation() {
  const { user, profile } = useAuth();
  const [state, setState] = useState<ActivationState>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const profileComplete = Boolean(
        profile?.full_name &&
          profile?.country &&
          (profile?.institution_id || profile?.institution_text) &&
          profile?.field_of_study &&
          profile?.education_level &&
          (profile?.languages?.length ?? 0) > 0 &&
          profile?.goals,
      );

      const [requestRes, conversationRes] = await Promise.all([
        supabase
          .from('match_requests')
          .select('id', { count: 'exact', head: true })
          .eq('sender_id', user.id),
        supabase
          .from('conversations')
          .select('id', { count: 'exact', head: true })
          .or(`user_a.eq.${user.id},user_b.eq.${user.id}`),
      ]);

      setState({
        profileComplete,
        requested: (requestRes.count ?? 0) > 0,
        conversation: (conversationRes.count ?? 0) > 0,
        verified: profile?.verification === 'verified',
      });
    } catch (err) {
      console.error('Failed to load activation state', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    void load();
  }, [load]);

  return { state, loading, error, reload: load };
}