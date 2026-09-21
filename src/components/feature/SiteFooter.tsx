import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BrandLogo from '@/components/feature/BrandLogo';

/** Minimal footer — a logo, one line, and the legal links. Nothing else. */
export default function SiteFooter() {
  const { t, i18n } = useTranslation();
  const home = i18n.language?.startsWith('de') ? '/de' : '/en';

  const links = [
    { label: t('landing.footer.findPartner'), to: home },
    { label: t('landing.footer.login'), to: '/login' },
    { label: t('landing.footer.privacy'), to: '/privacy' },
    { label: t('landing.footer.imprint'), to: '/imprint' },
  ];

  return (
    <footer className="border-t border-background-200 bg-background-100">
      <div className="container-page flex flex-col items-center gap-6 py-10 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <BrandLogo to={home} />
          <p className="max-w-sm text-sm leading-relaxed text-foreground-600">
            {t('landing.footer.tagline')}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="whitespace-nowrap cursor-pointer text-sm text-foreground-600 transition-colors hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-background-200">
        <div className="container-page py-4">
          <p className="text-center text-xs text-foreground-500">
            © {new Date().getFullYear()} {t('landing.footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}