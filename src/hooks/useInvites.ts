import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { buildReferralLink } from '@/lib/invites';
import type { Invite } from '@/types/db';

export function useInvites() {
  const { profile } = useAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!profile?.id) {
      setInvites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('invites')
        .select('*')
        .eq('inviter_id', profile.id)
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setInvites((data as Invite[]) ?? []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const code = profile?.referral_code ?? '';
  const link = code ? buildReferralLink(code) : '';
  const invitedCount = invites.length;
  const joinedCount = invites.filter((invite) => invite.status === 'joined').length;

  const addEmailInvite = useCallback(
    async (email: string): Promise<boolean> => {
      if (!profile?.id || !code) return false;
      try {
        const { error: insertError } = await supabase.from('invites').insert({
          inviter_id: profile.id,
          code,
          invited_email: email,
          status: 'pending',
        });
        if (insertError) throw insertError;
        await load();
        return true;
      } catch {
        return false;
      }
    },
    [profile?.id, code, load],
  );

  return {
    invites,
    loading,
    error,
    reload: load,
    code,
    link,
    invitedCount,
    joinedCount,
    addEmailInvite,
  };
}