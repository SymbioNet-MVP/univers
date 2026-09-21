import { useTranslation } from 'react-i18next';
import TrustRow from './TrustRow';

/**
 * The message half of the hero. Sits on top of the full-bleed dark image that
 * page.tsx renders, so this component only owns the words, the CTA and trust.
 */
export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className="container-page pb-12 pt-4 md:pb-24 md:pt-12">
      <div className="max-w-2xl animate-fade-up">
        <h1 className="font-heading text-4xl font-semibold leading-[1.12] tracking-tight text-primary-50 md:text-5xl xl:text-6xl">
          <span className="block">{t('landing.hero.line1')}</span>
          <span className="block text-primary-300">{t('landing.hero.line2')}</span>
          <span className="block">{t('landing.hero.line3')}</span>
          <span className="block text-primary-300">{t('landing.hero.line4')}</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-100/90 md:text-lg">
          {t('landing.hero.description')}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#register"
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-6 py-3 text-sm font-medium text-primary-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-user-search-line text-base"></i>
            {t('landing.hero.cta')}
          </a>
        </div>

        <div className="mt-8 border-t border-white/15 pt-6 md:mt-10">
          <TrustRow />
        </div>
      </div>
    </div>
  );
}