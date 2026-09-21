import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { applyLang, LANGS, type Lang } from '@/lib/lang';

interface LanguageSwitcherProps {
  /** 'dark' renders a light-on-dark pill for use over the hero image. */
  tone?: 'light' | 'dark';
}

export default function LanguageSwitcher({ tone = 'light' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const current: Lang = i18n.language?.startsWith('de') ? 'de' : 'en';

  const handleChange = (lang: Lang) => {
    if (lang === current) return;
    applyLang(lang);
    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }
    // On a localized landing route, keep the URL in sync (/en <-> /de).
    if (/^\/(en|de)\/?$/.test(location.pathname)) {
      navigate(`/${lang}`);
    }
  };

  const wrap =
    tone === 'dark'
      ? 'border-white/25 bg-white/10'
      : 'border-background-200 bg-background-100';

  return (
    <div className={`inline-flex items-center rounded-full border px-1 py-1 ${wrap}`}>
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => handleChange(lang)}
          aria-label={lang.toUpperCase()}
          className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            current === lang
              ? tone === 'dark'
                ? 'bg-primary-50 text-primary-950'
                : 'bg-background-50 text-foreground-950'
              : tone === 'dark'
                ? 'text-primary-50/70 hover:text-primary-50'
                : 'text-foreground-500 hover:text-foreground-800'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}