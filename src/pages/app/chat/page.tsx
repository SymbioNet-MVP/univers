import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Spinner from '@/components/base/Spinner';
import EmptyState from '@/components/base/EmptyState';
import ConversationList from '@/pages/app/chat/components/ConversationList';
import ChatRoom from '@/pages/app/chat/components/ChatRoom';
import { useConversations } from '@/hooks/useConversations';

export default function ChatPage() {
  const { t } = useTranslation();
  const { conversationId } = useParams();
  const { conversations, loading, error, reload } = useConversations();

  const active = conversations.find((conversation) => conversation.id === conversationId) ?? null;

  return (
    <div className="mx-auto max-w-5xl space-y-4 sm:space-y-5">
      <header className={conversationId ? 'hidden lg:block' : 'block'}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground-950">{t('chat.title')}</h1>
      </header>

      {error ? (
        <div className="rounded-lg border border-background-200 bg-background-50 py-12 text-center">
          <p className="text-sm text-foreground-600">{t('common.error')}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-3 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-background-50 hover:bg-primary-600"
          >
            <i className="ri-refresh-line"></i>
            {t('common.retry')}
          </button>
        </div>
      ) : (
        <div className="ui-card -mx-3 overflow-hidden sm:mx-0 lg:grid lg:grid-cols-[340px_1fr] lg:gap-0">
          <aside
            className={`border-background-200 lg:block lg:border-r ${
              conversationId ? 'hidden' : 'block'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center py-16 text-foreground-500">
                <span className="w-6 h-6 flex items-center justify-center">
                  <Spinner />
                </span>
              </div>
            ) : (
              <ConversationList conversations={conversations} loading={false} />
            )}
          </aside>

          <section className={`h-[calc(100dvh-9.25rem)] min-h-[480px] lg:h-[680px] ${conversationId ? 'block' : 'hidden lg:block'}`}>
            {active ? (
              <>
                <div className="border-b border-background-200 px-3 py-2 lg:hidden">
                  <Link
                    to="/app/chat"
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                  >
                    <i className="ri-arrow-left-line"></i>
                    {t('common.back')}
                  </Link>
                </div>
                <div className="h-[calc(100%-44px)] lg:h-full">
                  <ChatRoom conversation={active} />
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-4">
                <EmptyState icon="ri-chat-smile-2-line" title={t('chat.selectConversation')} />
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
