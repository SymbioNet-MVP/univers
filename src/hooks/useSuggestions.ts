import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { MatchSuggestion } from '@/types/db';

export function useSuggestions(limit = 12) {
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('get_match_suggestions_v2', {
        p_limit: limit,
      });
      if (rpcError) throw rpcError;
      setSuggestions((data as MatchSuggestion[]) ?? []);
    } catch (err) {
      console.error('Failed to load suggestions', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void load();
  }, [load]);

  const removeSuggestion = useCallback((userId: string) => {
    setSuggestions((prev) => prev.filter((item) => item.user_id !== userId));
  }, []);

  return { suggestions, loading, error, reload: load, removeSuggestion };
}