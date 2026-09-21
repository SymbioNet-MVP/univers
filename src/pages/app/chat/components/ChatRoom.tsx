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
  const bottomRef = useRef<HTMLDivElement>(null);
  const starters = useIcebreakers({ field: conversation.counterpart?.field_of_study });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-background-200 px-4 py-3">
        <Avatar name={conversation.counterpart?.full_name} url={conversation.counterpart?.avatar_url} size={40} />
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-foreground-950">
            {conversation.counterpart?.full_name || t('common.none')}
          </p>
          <p className="truncate text-xs text-foreground-500">
            {conversation.counterpart?.field_of_study || conversation.counterpart?.country || ''}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
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
          <div className="py-4 text-center">
            <p className="text-sm text-foreground-500">{t('chat.startWith')}</p>
            <div className="mt-4">
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
                    className="cursor-pointer rounded-full border border-background-300 bg-background-50 px-3 py-1.5 text-[11px] font-medium text-foreground-700 transition-colors hover:border-primary-300 hover:bg-primary-50"
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
            <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm ${
                  mine
                    ? 'bg-primary-500 text-background-50'
                    : 'bg-background-100 text-foreground-900'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p className={`mt-1 text-[10px] ${mine ? 'text-current opacity-70' : 'text-foreground-400'}`}>
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-background-200 px-3 py-3">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t('chat.placeholder')}
          className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600 disabled:opacity-50"
        >
          {sending ? <Spinner /> : <i className="ri-send-plane-fill"></i>}
          <span className="hidden sm:inline">{t('chat.send')}</span>
        </button>
      </form>
    </div>
  );
}