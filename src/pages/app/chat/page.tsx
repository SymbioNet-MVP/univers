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
    <div className="space-y-5">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-foreground-950">{t('chat.title')}</h1>
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
        <div className="overflow-hidden rounded-lg border border-background-200 bg-background-50 lg:grid lg:grid-cols-[320px_1fr] lg:gap-0">
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

          <section className={`h-[60vh] lg:h-[620px] ${conversationId ? 'block' : 'hidden lg:block'}`}>
            {active ? (
              <>
                <div className="border-b border-background-200 px-3 py-2 lg:hidden">
                  <Link
                    to="/app/chat"
                    className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-foreground-600"
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