import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/base/Avatar';
import Spinner from '@/components/base/Spinner';
import { useActivity } from '@/hooks/useActivity';

function shortTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function ActivityCenter() {
  const { t } = useTranslation();
  const { items, count, loading, error, reload } = useActivity();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t('activity.title')}
        aria-expanded={open}
        className="relative w-9 h-9 flex items-center justify-center rounded-md text-foreground-600 hover:bg-background-100 cursor-pointer"
      >
        <i className="ri-notification-3-line text-lg"></i>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-accent-500 text-[10px] font-semibold text-background-50">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-background-200 bg-background-50">
          <div className="flex items-center justify-between border-b border-background-200 px-4 py-3">
            <h3 className="font-heading text-sm font-semibold text-foreground-950">
              {t('activity.title')}
            </h3>
            <button
              type="button"
              onClick={() => void reload()}
              aria-label={t('common.retry')}
              className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100"
            >
              <i className="ri-refresh-line"></i>
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-foreground-500">
                <Spinner />
                {t('common.loading')}
              </div>
            )}

            {!loading && error && (
              <div className="py-6 text-center text-sm text-foreground-600">{t('common.error')}</div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="px-4 py-8 text-center">
                <span className="mx-auto w-10 h-10 flex items-center justify-center rounded-full bg-background-100 text-foreground-500">
                  <i className="ri-notification-off-line"></i>
                </span>
                <p className="mt-2 text-sm text-foreground-600">{t('activity.empty')}</p>
                <p className="mt-1 text-xs text-foreground-500">{t('activity.emptyHint')}</p>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <ul className="divide-y divide-background-200">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.kind === 'request' ? '/app/matches' : '/app/chat'}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-background-100"
                    >
                      <Avatar name={item.name} url={item.avatarUrl} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-foreground-500">
                          {item.kind === 'request' ? t('activity.requests') : t('activity.messages')}
                        </p>
                        <p className="truncate text-sm font-semibold text-foreground-950">
                          {item.name || t('common.none')}
                        </p>
                        {item.text && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-foreground-600">{item.text}</p>
                        )}
                      </div>
                      <span className="shrink-0 text-[11px] text-foreground-400">
                        {shortTime(item.at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}