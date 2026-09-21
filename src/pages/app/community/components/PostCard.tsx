import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/base/Avatar';
import PostComments from '@/pages/app/community/components/PostComments';
import type { PostWithAuthor } from '@/hooks/useCommunity';

const TYPE_STYLE: Record<string, string> = {
  Question: 'bg-secondary-100 text-secondary-900',
  'Study Goal': 'bg-primary-100 text-primary-700',
  'Looking for Buddy': 'bg-accent-100 text-accent-900',
  'Resource Share': 'bg-background-200 text-foreground-700',
};

const TYPE_KEY: Record<string, string> = {
  Question: 'question',
  'Study Goal': 'studyGoal',
  'Looking for Buddy': 'lookingForBuddy',
  'Resource Share': 'resourceShare',
};

export default function PostCard({ post }: { post: PostWithAuthor }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="ui-card -mx-3 overflow-hidden sm:mx-0">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
        <Avatar name={post.author?.full_name} url={post.author?.avatar_url} size={42} className="ring-2 ring-background-100" />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground-950">
              {post.author?.full_name || t('common.none')}
            </span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                TYPE_STYLE[post.type] || 'bg-background-200 text-foreground-700'
              }`}
            >
              {t(`community.types.${TYPE_KEY[post.type]}`)}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-foreground-500">
            {post.field && <span>{post.field} · </span>}
            {new Date(post.created_at).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="border-y border-background-200 bg-background-50 px-4 py-5 sm:px-5 sm:py-6">
        <h3 className="text-[17px] font-bold leading-snug tracking-tight text-foreground-950">{post.title}</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground-700">{post.body}</p>
      </div>

      <div className="px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-2 text-sm font-semibold text-foreground-800 transition-colors hover:bg-background-100 hover:text-foreground-950"
        >
          <i className={`${expanded ? 'ri-chat-3-fill text-primary-500' : 'ri-chat-3-line'} text-xl`}></i>
          {t('community.comments')}
          <i className={expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
        </button>
      </div>

      {expanded && <PostComments postId={post.id} />}
    </article>
  );
}
