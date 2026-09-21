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
      <div className="space-y-2 p-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-md bg-background-100"></div>
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
    <ul className="space-y-1 p-2">
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <NavLink
            to={`/app/chat/${conversation.id}`}
            className={({ isActive }) =>
              `flex cursor-pointer items-center gap-3 rounded-md p-3 transition-colors ${
                isActive ? 'bg-primary-500/10' : 'hover:bg-background-100'
              }`
            }
          >
            <Avatar
              name={conversation.counterpart?.full_name}
              url={conversation.counterpart?.avatar_url}
              size={40}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground-950">
                {conversation.counterpart?.full_name || t('common.none')}
              </p>
              <p className="truncate text-xs text-foreground-500">
                {conversation.lastMessage || t('chat.startWith')}
              </p>
            </div>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}