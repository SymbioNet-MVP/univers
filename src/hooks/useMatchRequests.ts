import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { track, EVENTS } from '@/lib/analytics';
import { notifyEmail } from '@/lib/notifications';
import { useAuth } from '@/hooks/useAuth';
import type { MatchRequest, Profile } from '@/types/db';

export interface RequestWithProfile extends MatchRequest {
  counterpart: Profile | null;
}

async function fetchProfiles(ids: string[]): Promise<Map<string, Profile>> {
  const map = new Map<string, Profile>();
  if (ids.length === 0) return map;
  const { data } = await supabase.from('profiles').select('*').in('id', ids);
  (data as Profile[] | null)?.forEach((profile) => map.set(profile.id, profile));
  return map;
}

export function useMatchRequests() {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState<RequestWithProfile[]>([]);
  const [outgoing, setOutgoing] = useState<RequestWithProfile[]>([]);
  const [active, setActive] = useState<RequestWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [incomingRes, outgoingRes, acceptedRes] = await Promise.all([
        supabase
          .from('match_requests')
          .select('*')
          .eq('receiver_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('match_requests')
          .select('*')
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('match_requests')
          .select('*')
          .eq('status', 'accepted')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('responded_at', { ascending: false }),
      ]);

      const incomingData = (incomingRes.data as MatchRequest[]) ?? [];
      const outgoingData = (outgoingRes.data as MatchRequest[]) ?? [];
      const acceptedData = (acceptedRes.data as MatchRequest[]) ?? [];

      const counterpartId = (request: MatchRequest) =>
        request.sender_id === user.id ? request.receiver_id : request.sender_id;

      const ids = Array.from(
        new Set([
          ...incomingData.map((request) => request.sender_id),
          ...outgoingData.map((request) => request.receiver_id),
          ...acceptedData.map(counterpartId),
        ]),
      );
      const profiles = await fetchProfiles(ids);

      setIncoming(
        incomingData.map((request) => ({
          ...request,
          counterpart: profiles.get(request.sender_id) ?? null,
        })),
      );
      setOutgoing(
        outgoingData.map((request) => ({
          ...request,
          counterpart: profiles.get(request.receiver_id) ?? null,
        })),
      );
      setActive(
        acceptedData.map((request) => {
          const otherId = counterpartId(request);
          return {
            ...request,
            counterpart: profiles.get(otherId) ?? null,
          };
        }),
      );
    } catch (err) {
      console.error('Failed to load match requests', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const respond = useCallback(
    async (requestId: string, accept: boolean) => {
      const { error: rpcError } = await supabase.rpc('respond_to_match_request', {
        p_request_id: requestId,
        p_accept: accept,
      });
      if (rpcError) throw rpcError;
      if (accept) {
        track(EVENTS.matchAccepted);
        notifyEmail('match_accepted', requestId);
      }
      await load();
    },
    [load],
  );

  return { incoming, outgoing, active, loading, error, reload: load, respond };
}