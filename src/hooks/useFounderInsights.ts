import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface FunnelStage {
  key: string;
  count: number;
}

export interface EngagementStats {
  signups: number;
  profiles_completed: number;
  verified: number;
  first_match: number;
  first_conversation: number;
  match_requests: number;
  match_accepts: number;
  matches: number;
  conversations: number;
  conversations_with_message: number;
  messages: number;
}

export interface ReferralStats {
  invites: number;
  visits: number;
  emails: number;
  joined: number;
  referrers: number;
}

export interface EventStat {
  event_name: string;
  total: number;
  unique_actors: number;
  total_30d: number;
}

export interface CampusStat {
  name: string;
  learners: number;
  matches: number;
  conversations: number;
  active_learners: number;
}

export interface FounderInsights {
  authorized: boolean;
  generated_at?: string;
  funnel?: FunnelStage[];
  engagement?: EngagementStats;
  referrals?: ReferralStats;
  campus?: CampusStat[];
  events?: EventStat[];
}

/**
 * Reads the founder-only activation funnel through a security-definer RPC.
 * Raw analytics rows are never exposed to the client.
 */
export function useFounderInsights(enabled: boolean) {
  const [data, setData] = useState<FounderInsights | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const { data: result, error: rpcError } = await supabase.rpc('get_founder_insights');
      if (rpcError) throw rpcError;
      setData((result as FounderInsights) ?? { authorized: false });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load };
}