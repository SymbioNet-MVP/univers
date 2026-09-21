import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Cold-start safeguard: when a cohort is still small, we always render a
 * useful card instead of leaving the match grid looking empty.
 */
export default function FoundingFill() {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col rounded-lg border border-dashed border-background-300 bg-background-100 p-4 md:p-5">
      <span className="w-10 h-10 flex items-center justify-center rounded-md bg-accent-100 text-accent-700">
        <i className="ri-seedling-line text-lg"></i>
      </span>
      <h3 className="mt-3 font-heading text-sm font-semibold text-foreground-950">
        {t('coldStart.title')}
      </h3>
      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-foreground-600">
        {t('coldStart.body')}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <Link
          to="/app/community"
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
        >
          <i className="ri-community-line"></i>
          {t('coldStart.community')}
        </Link>
        <a
          href="#invite-module"
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-medium text-foreground-800 hover:bg-background-50"
        >
          <i className="ri-user-add-line"></i>
          {t('coldStart.invite')}
        </a>
      </div>
    </article>
  );
}