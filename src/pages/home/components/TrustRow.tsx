import { useTranslation } from 'react-i18next';

const ICONS = ['ri-user-heart-line', 'ri-lock-2-line', 'ri-chat-smile-2-line', 'ri-shield-check-line'];

export default function TrustRow() {
  const { t } = useTranslation();
  const items = t('landing.trust.items', { returnObjects: true }) as unknown as string[];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-100/70">
        {t('landing.trust.label')}
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-2 text-sm text-primary-100/95">
            <span className="flex h-5 w-5 items-center justify-center text-primary-300">
              <i className={ICONS[index] ?? 'ri-check-line'}></i>
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}