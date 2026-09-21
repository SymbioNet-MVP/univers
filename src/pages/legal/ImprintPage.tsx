import { useTranslation } from 'react-i18next';
import LegalPage, { type LegalSection } from '@/pages/legal/components/LegalPage';
import { useSeo } from '@/hooks/useSeo';
import { siteBase } from '@/lib/seo';
import { webPageSchema } from '@/lib/schema';

export default function ImprintPage() {
  const { t, i18n } = useTranslation();
  const sections = t('legal.imprint.sections', { returnObjects: true }) as unknown as LegalSection[];

  const title = t('legal.imprint.seo.title');
  const description = t('legal.imprint.seo.description');

  useSeo({
    title,
    description,
    path: '/imprint',
    keywords: 'UniverS imprint, legal notice, provider information, Impressum',
    jsonLd: [
      webPageSchema(siteBase(), {
        name: title,
        description,
        path: '/imprint',
        lang: i18n.language?.startsWith('de') ? 'de' : 'en',
      }),
    ],
  });

  return (
    <LegalPage
      eyebrow={t('legal.imprint.eyebrow')}
      title={t('legal.imprint.title')}
      subtitle={t('legal.imprint.subtitle')}
      updated={t('legal.updated', { date: t('legal.updatedDate') })}
      sections={sections}
    />
  );
}