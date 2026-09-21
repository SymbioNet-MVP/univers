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
    <div className="mx-auto max-w-2xl space-y-5 sm:space-y-6">
      <header className="flex items-center justify-between gap-3 px-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground-950">
            {t('community.title')}
          </h1>
          <p className="mt-1 hidden max-w-xl text-sm text-foreground-600 sm:block">{t('community.subtitle')}</p>
        </div>
        {!composing && (
          <button
            type="button"
            onClick={() => setComposing(true)}
            aria-label={t('community.newPost')}
            className="ui-primary-button h-10 shrink-0 cursor-pointer gap-2 whitespace-nowrap px-4 text-sm"
          >
            <i className="ri-add-line"></i>
            <span className="hidden sm:inline">{t('community.newPost')}</span>
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
        <div className="ui-card py-12 text-center">
          <p className="text-sm text-foreground-600">{t('common.error')}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="ui-primary-button mt-3 cursor-pointer gap-2 whitespace-nowrap px-4 py-2 text-sm"
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
        <div className="space-y-4 sm:space-y-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
