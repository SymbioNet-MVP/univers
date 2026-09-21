import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { applySeo, type SeoConfig } from '@/lib/seo';
import type { Lang } from '@/lib/lang';

export type UseSeoConfig = Omit<SeoConfig, 'lang'>;

/**
 * Applies page-level SEO (title, description, canonical, hreflang, OG/Twitter,
 * JSON-LD) and keeps it in sync with the active UI language.
 */
export function useSeo(config: UseSeoConfig): void {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith('de') ? 'de' : 'en';
  const configRef = useRef<UseSeoConfig>(config);
  configRef.current = config;

  useEffect(() => {
    applySeo({ ...configRef.current, lang });
  }, [lang, config.title, config.description, config.path, config.robots]);
}