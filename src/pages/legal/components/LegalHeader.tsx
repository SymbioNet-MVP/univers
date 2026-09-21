import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BrandLogo from '@/components/feature/BrandLogo';
import LanguageSwitcher from '@/components/feature/LanguageSwitcher';

/** Slim sticky header used across the legal pages. */
export default function LegalHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-background-200/70 bg-background-50/95 backdrop-blur">
      <div className="container-page flex items-center justify-between h-16 md:h-20">
        <BrandLogo to="/" />

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/login"
            className="hidden sm:inline whitespace-nowrap text-sm font-medium text-foreground-700 hover:text-primary-600 transition-colors"
          >
            {t('legal.nav.login')}
          </Link>
          <Link
            to="/signup"
            className="whitespace-nowrap cursor-pointer rounded-md bg-primary-500 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600 transition-colors"
          >
            {t('legal.nav.start')}
          </Link>
        </div>
      </div>
    </header>
  );
}