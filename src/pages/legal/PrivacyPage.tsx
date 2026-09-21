import { useTranslation } from 'react-i18next';
import LegalPage, { type LegalSection } from '@/pages/legal/components/LegalPage';
import { useSeo } from '@/hooks/useSeo';
import { siteBase } from '@/lib/seo';
import { webPageSchema } from '@/lib/schema';

export default function PrivacyPage() {
  const { t, i18n } = useTranslation();
  const sections = t('legal.privacy.sections', { returnObjects: true }) as unknown as LegalSection[];

  const title = t('legal.privacy.seo.title');
  const description = t('legal.privacy.seo.description');

  useSeo({
    title,
    description,
    path: '/privacy',
    keywords: 'UniverS privacy policy, data protection, GDPR, Swiss FADP, Datenschutz',
    jsonLd: [
      webPageSchema(siteBase(), {
        name: title,
        description,
        path: '/privacy',
        lang: i18n.language?.startsWith('de') ? 'de' : 'en',
      }),
    ],
  });

  return (
    <LegalPage
      eyebrow={t('legal.privacy.eyebrow')}
      title={t('legal.privacy.title')}
      subtitle={t('legal.privacy.subtitle')}
      updated={t('legal.updated', { date: t('legal.updatedDate') })}
      sections={sections}
    />
  );
}