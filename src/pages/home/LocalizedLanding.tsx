import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './page';
import NotFound from '@/pages/NotFound';
import { applyLang, isLang, type Lang } from '@/lib/lang';
import { useSeo } from '@/hooks/useSeo';
import { siteBase, DEFAULT_OG_IMAGE } from '@/lib/seo';
import {
  websiteSchema,
  organizationSchema,
  educationalOrganizationSchema,
} from '@/lib/schema';

const KEYWORDS =
  'study partner, study buddy, learning community, learner networking, study groups, find study partner online';

/**
 * Renders the landing page for a localized route (/en, /de).
 * Keeps i18n, <html lang>, persisted preference and SEO head in sync with the URL.
 */
export default function LocalizedLanding() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n, t } = useTranslation();
  const valid = isLang(lang);
  const active: Lang = valid ? (lang as Lang) : 'en';

  useEffect(() => {
    if (!valid) return;
    applyLang(active);
    if (i18n.language !== active) {
      void i18n.changeLanguage(active);
    }
  }, [active, valid, i18n]);

  const description = t('landing.seo.description');
  const base = siteBase();

  useSeo({
    title: t('landing.seo.title'),
    description,
    path: `/${active}`,
    ogImage: DEFAULT_OG_IMAGE,
    keywords: KEYWORDS,
    alternates: [
      { hreflang: 'en', path: '/en' },
      { hreflang: 'de', path: '/de' },
      { hreflang: 'x-default', path: '/en' },
    ],
    jsonLd: valid
      ? [
          websiteSchema(base, 'UniverS', description, active),
          organizationSchema(base, active),
          educationalOrganizationSchema(base, active),
        ]
      : [],
  });

  if (!valid) {
    return <NotFound />;
  }

  return <Home />;
}