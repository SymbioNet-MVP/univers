import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { MatchRequest, Message, Profile } from '@/types/db';

export interface ActivityItem {
  id: string;
  kind: 'request' | 'message';
  userId: string;
  name: string;
  avatarUrl: string | null;
  text: string | null;
  at: string;
}

/**
 * Lightweight in-app retention loop: pending match requests plus unread
 * messages from others. No new tables — derived from existing data.
 */
export function useActivity() {
  const { user } = useAuth();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [requestCount, setRequestCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [requestRes, conversationRes] = await Promise.all([
        supabase
          .from('match_requests')
          .select('*')
          .eq('receiver_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(15),
        supabase.from('conversations').select('id').or(`user_a.eq.${user.id},user_b.eq.${user.id}`),
      ]);

      const requests = (requestRes.data as MatchRequest[]) ?? [];
      const conversationIds = ((conversationRes.data as { id: string }[]) ?? []).map((c) => c.id);

      let messages: Message[] = [];
      if (conversationIds.length > 0) {
        const { data } = await supabase
          .from('messages')
          .select('*')
          .in('conversation_id', conversationIds)
          .neq('sender_id', user.id)
          .is('read_at', null)
          .order('created_at', { ascending: false })
          .limit(15);
        messages = (data as Message[]) ?? [];
      }

      const ids = Array.from(
        new Set([...requests.map((r) => r.sender_id), ...messages.map((m) => m.sender_id)]),
      );
      const profileMap = new Map<string, Profile>();
      if (ids.length > 0) {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', ids);
        (data as Profile[] | null)?.forEach((p) => profileMap.set(p.id, p));
      }

      const merged: ActivityItem[] = [
        ...requests.map((r) => ({
          id: `req-${r.id}`,
          kind: 'request' as const,
          userId: r.sender_id,
          name: profileMap.get(r.sender_id)?.full_name || '',
          avatarUrl: profileMap.get(r.sender_id)?.avatar_url ?? null,
          text: r.message,
          at: r.created_at,
        })),
        ...messages.map((m) => ({
          id: `msg-${m.id}`,
          kind: 'message' as const,
          userId: m.sender_id,
          name: profileMap.get(m.sender_id)?.full_name || '',
          avatarUrl: profileMap.get(m.sender_id)?.avatar_url ?? null,
          text: m.content,
          at: m.created_at,
        })),
      ]
        .sort((a, b) => (a.at < b.at ? 1 : -1))
        .slice(0, 8);

      setItems(merged);
      setRequestCount(requests.length);
      setMessageCount(messages.length);
    } catch (err) {
      console.error('Failed to load activity', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * Keep the notification badge live: new match requests and incoming messages
   * should light up the bell without a page reload. Events are debounced so a
   * burst of activity triggers a single refresh.
   */
  useEffect(() => {
    if (!user) return undefined;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void load();
      }, 400);
    };

    const channel = supabase
      .channel(`activity-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        schedule,
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'match_requests' },
        schedule,
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'match_requests' },
        schedule,
      )
      .subscribe();

    return () => {
      if (timer) clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [user, load]);

  return {
    items,
    requestCount,
    messageCount,
    count: requestCount + messageCount,
    loading,
    error,
    reload: load,
  };
}