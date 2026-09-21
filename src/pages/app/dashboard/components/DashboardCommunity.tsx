import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/base/Avatar';
import Spinner from '@/components/base/Spinner';
import { useCommunity } from '@/hooks/useCommunity';

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

export default function DashboardCommunity() {
  const { t } = useTranslation();
  const { posts, loading, error, reload } = useCommunity();
  const recent = posts.slice(0, 3);

  return (
    <section className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground-950">
          {t('dashboard.communityTitle')}
        </h2>
        <Link
          to="/app/community"
          className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {t('dashboard.seeAll')}
          <i className="ri-arrow-right-line"></i>
        </Link>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-6 text-sm text-foreground-500">
          <Spinner />
          {t('common.loading')}
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 py-4">
          <p className="text-sm text-foreground-600">{t('common.error')}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-background-300 px-3 py-1.5 text-xs font-medium text-foreground-800 hover:bg-background-100"
          >
            <i className="ri-refresh-line"></i>
            {t('common.retry')}
          </button>
        </div>
      )}

      {!loading && !error && recent.length > 0 && (
        <ul className="space-y-3">
          {recent.map((post) => (
            <li key={post.id}>
              <Link
                to="/app/community"
                className="flex items-start gap-3 rounded-lg border border-background-200 bg-background-50 p-3.5 transition-colors hover:bg-background-100"
              >
                <Avatar name={post.author?.full_name} url={post.author?.avatar_url} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground-950">
                      {post.author?.full_name || t('common.none')}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        TYPE_STYLE[post.type] || 'bg-background-200 text-foreground-700'
                      }`}
                    >
                      {t(`community.types.${TYPE_KEY[post.type]}`)}
                    </span>
                  </div>
                  <p className="mt-1 truncate font-heading text-sm font-semibold text-foreground-950">
                    {post.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-foreground-600">{post.body}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && recent.length === 0 && (
        <div className="rounded-lg border border-dashed border-background-300 bg-background-100/50 p-5">
          <p className="text-sm text-foreground-700">{t('community.empty')}</p>
          <Link
            to="/app/community"
            className="mt-3 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-background-50 hover:bg-primary-600"
          >
            <i className="ri-add-line"></i>
            {t('community.newPost')}
          </Link>
        </div>
      )}
    </section>
  );
}