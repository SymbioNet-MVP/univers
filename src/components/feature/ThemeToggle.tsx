import { useTranslation } from 'react-i18next';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';

const OPTIONS: { key: ThemeMode; icon: string; labelKey: string }[] = [
  { key: 'light', icon: 'ri-sun-line', labelKey: 'theme.light' },
  { key: 'dark', icon: 'ri-moon-line', labelKey: 'theme.dark' },
  { key: 'system', icon: 'ri-computer-line', labelKey: 'theme.system' },
];

const CYCLE: ThemeMode[] = ['light', 'dark', 'system'];

export default function ThemeToggle({
  className = '',
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const { mode, setMode } = useTheme();

  if (compact) {
    const index = CYCLE.indexOf(mode);
    const next = CYCLE[(index + 1) % CYCLE.length];
    const option = OPTIONS.find((item) => item.key === mode) ?? OPTIONS[2];
    return (
      <button
        type="button"
        onClick={() => setMode(next)}
        title={t(option.labelKey)}
        aria-label={t(option.labelKey)}
        className={`w-9 h-9 flex items-center justify-center rounded-md text-foreground-600 hover:bg-background-100 cursor-pointer ${className}`}
      >
        <i className={`${option.icon} text-lg`}></i>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={t('theme.label')}
      className={`inline-flex items-center rounded-full border border-background-200 bg-background-100 px-1 py-1 ${className}`}
    >
      {OPTIONS.map((option) => {
        const active = mode === option.key;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => setMode(option.key)}
            title={t(option.labelKey)}
            aria-label={t(option.labelKey)}
            aria-pressed={active}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
              active
                ? 'bg-primary-500 text-background-50'
                : 'text-foreground-500 hover:text-foreground-800'
            }`}
          >
            <i className={`${option.icon} text-sm`}></i>
          </button>
        );
      })}
    </div>
  );
}