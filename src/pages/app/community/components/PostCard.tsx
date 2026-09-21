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
    <article className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
      <div className="flex items-start gap-3">
        <Avatar name={post.author?.full_name} url={post.author?.avatar_url} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground-950">
              {post.author?.full_name || t('common.none')}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                TYPE_STYLE[post.type] || 'bg-background-200 text-foreground-700'
              }`}
            >
              {t(`community.types.${TYPE_KEY[post.type]}`)}
            </span>
            {post.field && (
              <span className="text-[11px] text-foreground-500">· {post.field}</span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-foreground-400">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h3 className="mt-3 font-heading text-base font-semibold text-foreground-950">{post.title}</h3>
      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground-700">{post.body}</p>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        <i className={expanded ? 'ri-chat-3-fill' : 'ri-chat-3-line'}></i>
        {t('community.comments')}
        <i className={expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
      </button>

      {expanded && <PostComments postId={post.id} />}
    </article>
  );
}