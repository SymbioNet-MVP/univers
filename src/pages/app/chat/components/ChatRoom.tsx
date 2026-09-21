import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/base/Avatar';
import Spinner from '@/components/base/Spinner';
import { useMessages } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import { useIcebreakers } from '@/hooks/useIcebreakers';
import { track, trackOnce, EVENTS } from '@/lib/analytics';
import { notifyEmail } from '@/lib/notifications';
import type { ConversationSummary } from '@/hooks/useConversations';

interface ChatRoomProps {
  conversation: ConversationSummary;
}

export default function ChatRoom({ conversation }: ChatRoomProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { messages, loading, error, reload, sendMessage } = useMessages(conversation.id);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const starters = useIcebreakers({ field: conversation.counterpart?.field_of_study });

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    track(EVENTS.conversationOpened);
  }, [conversation.id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setSending(true);
    try {
      await sendMessage(content);
      notifyEmail('new_message', conversation.id);
      trackOnce(EVENTS.firstMessageSent);
      setDraft('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background-50">
      <div className="flex min-h-[68px] items-center gap-3 border-b border-background-200 bg-background-50/95 px-4 py-3 backdrop-blur-xl sm:px-5">
        <Avatar name={conversation.counterpart?.full_name} url={conversation.counterpart?.avatar_url} size={44} className="ring-2 ring-background-100" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground-950">
            {conversation.counterpart?.full_name || t('common.none')}
          </p>
          <p className="truncate text-xs text-foreground-500">
            {conversation.counterpart?.field_of_study || conversation.counterpart?.country || ''}
          </p>
        </div>
      </div>

      <div ref={messagesRef} className="flex-1 space-y-2.5 overflow-y-auto bg-background-50 px-3 py-5 sm:px-5">
        {loading && (
          <div className="flex justify-center py-6 text-foreground-500">
            <span className="w-6 h-6 flex items-center justify-center">
              <Spinner />
            </span>
          </div>
        )}

        {!loading && error && (
          <div className="py-6 text-center">
            <p className="text-sm text-foreground-600">{t('common.error')}</p>
            <button
              type="button"
              onClick={() => void reload()}
              className="mt-2 cursor-pointer text-sm font-medium text-primary-600"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="mx-auto max-w-lg py-8 text-center">
            <Avatar name={conversation.counterpart?.full_name} url={conversation.counterpart?.avatar_url} size={72} className="mx-auto ring-4 ring-background-100" />
            <p className="mt-4 text-sm text-foreground-500">{t('chat.startWith')}</p>
            <div className="mt-5">
              <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-foreground-700">
                <i className="ri-magic-line text-accent-600"></i>
                {t('conversation.startersTitle')}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {starters.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => {
                      setDraft(text);
                      track(EVENTS.icebreakerUsed, { surface: 'chat' });
                    }}
                    className="cursor-pointer rounded-full border border-background-300 bg-background-50 px-3.5 py-2 text-xs font-medium text-foreground-700 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => {
          const mine = message.sender_id === user?.id;
          return (
            <div key={message.id} className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
              {!mine && (
                <Avatar
                  name={conversation.counterpart?.full_name}
                  url={conversation.counterpart?.avatar_url}
                  size={28}
                />
              )}
              <div
                className={`max-w-[82%] rounded-[22px] px-4 py-2.5 text-sm leading-5 sm:max-w-[70%] ${
                  mine
                    ? 'rounded-br-md bg-primary-500 text-white'
                    : 'rounded-bl-md bg-background-100 text-foreground-900'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p className={`mt-1 text-[11px] font-medium ${mine ? 'text-white' : 'text-foreground-600'}`}>
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-background-200 bg-background-50 px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2 rounded-full border border-background-300 bg-background-50 p-1.5 pl-4 transition-shadow focus-within:border-primary-300 focus-within:shadow-[0_0_0_3px_oklch(var(--primary-100)/0.7)]">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t('chat.placeholder')}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground-950 outline-none placeholder:text-foreground-400"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            aria-label={t('chat.send')}
            className="ui-primary-button h-10 w-10 shrink-0 cursor-pointer"
          >
            {sending ? <Spinner /> : <i className="ri-send-plane-fill"></i>}
          </button>
        </div>
      </form>
    </div>
  );
}
