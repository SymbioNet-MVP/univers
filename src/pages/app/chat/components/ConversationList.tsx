import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/base/Avatar';
import EmptyState from '@/components/base/EmptyState';
import type { ConversationSummary } from '@/hooks/useConversations';

interface ConversationListProps {
  conversations: ConversationSummary[];
  loading: boolean;
}

export default function ConversationList({ conversations, loading }: ConversationListProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-background-100"></div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-3">
        <EmptyState icon="ri-chat-3-line" title={t('chat.empty')} body={t('chat.emptyHint')} />
      </div>
    );
  }

  return (
    <ul className="space-y-1 p-2 sm:p-3">
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <NavLink
            to={`/app/chat/${conversation.id}`}
            className={({ isActive }) =>
              `group flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
                isActive ? 'bg-background-100' : 'hover:bg-background-100/70'
              }`
            }
          >
            <Avatar
              name={conversation.counterpart?.full_name}
              url={conversation.counterpart?.avatar_url}
              size={52}
              className="ring-2 ring-background-50"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground-950">
                {conversation.counterpart?.full_name || t('common.none')}
              </p>
              <p className="mt-0.5 truncate text-[13px] leading-5 text-foreground-500">
                {conversation.lastMessage || t('chat.startWith')}
              </p>
            </div>
            <i className="ri-arrow-right-s-line text-lg text-foreground-300 transition-transform group-hover:translate-x-0.5"></i>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
