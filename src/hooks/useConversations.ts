import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Conversation, Message, Profile } from '@/types/db';

export interface ConversationSummary {
  id: string;
  counterpart: Profile | null;
  lastMessage: string | null;
  lastAt: string;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order('last_message_at', { ascending: false });
      if (convError) throw convError;

      const convs = (data as Conversation[]) ?? [];
      const otherIds = convs.map((c) => (c.user_a === user.id ? c.user_b : c.user_a));
      const profileMap = new Map<string, Profile>();
      if (otherIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('*').in('id', otherIds);
        (profiles as Profile[] | null)?.forEach((p) => profileMap.set(p.id, p));
      }

      let lastMap = new Map<string, Message>();
      if (convs.length > 0) {
        const { data: msgs } = await supabase
          .from('messages')
          .select('*')
          .in(
            'conversation_id',
            convs.map((c) => c.id),
          )
          .order('created_at', { ascending: false })
          .limit(500);
        const list = (msgs as Message[]) ?? [];
        lastMap = list.reduce((acc, msg) => {
          if (!acc.has(msg.conversation_id)) acc.set(msg.conversation_id, msg);
          return acc;
        }, new Map<string, Message>());
      }

      setConversations(
        convs.map((conv) => {
          const otherId = conv.user_a === user.id ? conv.user_b : conv.user_a;
          const last = lastMap.get(conv.id);
          return {
            id: conv.id,
            counterpart: profileMap.get(otherId) ?? null,
            lastMessage: last?.content ?? null,
            lastAt: conv.last_message_at,
          };
        }),
      );
    } catch (err) {
      console.error('Failed to load conversations', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  return { conversations, loading, error, reload: load };
}

export function useMessages(conversationId: string | undefined) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (msgError) throw msgError;
      const list = (data as Message[]) ?? [];
      setMessages(list);
      if (user) {
        const unread = list.filter((message) => message.sender_id !== user.id && !message.read_at);
        if (unread.length > 0) {
          void supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .in(
              'id',
              unread.map((message) => message.id),
            );
        }
      }
    } catch (err) {
      console.error('Failed to load messages', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!conversationId) return undefined;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incoming = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming],
          );
          // If you are actively viewing this conversation, an arriving message
          // should not stay "unread" and keep the badge lit.
          if (user && incoming.sender_id !== user.id && !incoming.read_at) {
            void supabase
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .eq('id', incoming.id);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !user) return;
      const trimmed = content.trim();
      if (!trimmed) return;
      const { data: inserted, error: insertError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: trimmed,
        })
        .select('*')
        .single();
      if (insertError) throw insertError;
      if (inserted) {
        const row = inserted as Message;
        setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]));
      }
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);
    },
    [conversationId, user],
  );

  return { messages, loading, error, reload: load, sendMessage };
}