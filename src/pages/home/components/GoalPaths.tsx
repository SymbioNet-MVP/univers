import { useTranslation } from 'react-i18next';

interface PathOption {
  key: string;
  title: string;
}

const META = [
  { key: 'exam', icon: 'ri-book-open-line', tone: 'bg-primary-100 text-primary-700' },
  { key: 'language', icon: 'ri-translate-2', tone: 'bg-accent-100 text-accent-800' },
  { key: 'study', icon: 'ri-graduation-cap-line', tone: 'bg-secondary-100 text-secondary-800' },
  { key: 'mentor', icon: 'ri-user-search-line', tone: 'bg-primary-100 text-primary-700' },
];

interface GoalPathsProps {
  selected: string | null;
  onSelect: (goal: string) => void;
  /** Hide the small inline label when the section already provides a heading. */
  hideLabel?: boolean;
}

export default function GoalPaths({ selected, onSelect, hideLabel = false }: GoalPathsProps) {
  const { t } = useTranslation();
  const options = t('landing.paths.options', { returnObjects: true }) as unknown as PathOption[];

  return (
    <div>
      {!hideLabel && (
        <p className="text-sm font-medium text-foreground-700">{t('landing.paths.label')}</p>
      )}
      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${hideLabel ? '' : 'mt-3'}`}>
        {options.map((option, index) => {
          const meta = META[index] ?? META[0];
          const active = selected === option.key;
          return (
            <button
              key={option.key}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(option.key)}
              className={`group flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors cursor-pointer ${
                active
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-background-200 bg-background-50 hover:border-primary-300 hover:bg-primary-50/40'
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-md ${meta.tone}`}>
                <i className={`${meta.icon} text-lg`}></i>
              </span>
              <span className="text-sm font-medium text-foreground-900">{option.title}</span>
              <i
                className={`ml-auto ${
                  active ? 'ri-check-line text-primary-600' : 'ri-arrow-right-line text-foreground-400 group-hover:text-primary-500'
                }`}
              ></i>
            </button>
          );
        })}
      </div>
    </div>
  );
}