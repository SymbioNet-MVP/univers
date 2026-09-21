import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '@/components/base/Spinner';
import EmptyState from '@/components/base/EmptyState';
import PostComposer from '@/pages/app/community/components/PostComposer';
import PostCard from '@/pages/app/community/components/PostCard';
import { useCommunity } from '@/hooks/useCommunity';

export default function CommunityPage() {
  const { t } = useTranslation();
  const { posts, loading, error, reload, createPost } = useCommunity();
  const [composing, setComposing] = useState(false);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground-950">
            {t('community.title')}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-foreground-600">{t('community.subtitle')}</p>
        </div>
        {!composing && (
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
          >
            <i className="ri-add-line"></i>
            {t('community.newPost')}
          </button>
        )}
      </header>

      {composing && (
        <PostComposer onSubmit={createPost} onClose={() => setComposing(false)} />
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-foreground-500">
          <span className="w-8 h-8 flex items-center justify-center">
            <Spinner className="text-2xl" />
          </span>
        </div>
      )}

      {!loading && error && (
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
      )}

      {!loading && !error && posts.length === 0 && (
        <EmptyState icon="ri-community-line" title={t('community.empty')} />
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}