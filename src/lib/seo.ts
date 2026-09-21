import { getBasePrefix, type Lang } from './lang';

export const SITE_NAME = 'UniverS';

/**
 * The single canonical production origin.
 * Read from the VITE_SITE_URL environment variable so the real site origin is
 * configured in exactly one place and never invented inside code. Falls back to
 * the established production host only when the variable is absent at build time.
 */
const ENV_SITE_URL = String(import.meta.env.VITE_SITE_URL ?? '').trim();

export const CANONICAL_ORIGIN = (ENV_SITE_URL || 'https://getunivers.readdy.co').replace(/\/+$/, '');

export const DEFAULT_OG_IMAGE =
  'https://readdy.ai/api/search-image?query=warm%20learning%20scene%20of%20diverse%20adult%20learners%20studying%20together%20at%20a%20wooden%20table%20with%20laptops%2C%20soft%20natural%20light%2C%20deep%20forest%20green%20and%20cream%20palette%2C%20minimal%20editorial%20photography%2C%20calm%20and%20trustworthy%2C%20wide%20composition&width=1200&height=630&seq=univers-og-01&orientation=landscape&nocache=true';

export const OG_IMAGE_ALT =
  'Learners studying together on UniverS — find a study partner and study buddy';

const META_MARK = 'data-seo-managed';
const JSONLD_MARK = 'data-seo-jsonld';

export interface AlternateLink {
  hreflang: string;
  path: string;
}

export interface SeoConfig {
  lang: Lang;
  title: string;
  description: string;
  /** Path relative to the site base, e.g. '/en' or '/login'. Omit on noindex pages. */
  path?: string;
  ogType?: string;
  ogImage?: string;
  robots?: string;
  keywords?: string;
  alternates?: AlternateLink[];
  jsonLd?: Record<string, unknown>[];
}

/** Absolute site base, e.g. https://getunivers.readdy.co (no trailing slash). */
export function siteBase(): string {
  return `${CANONICAL_ORIGIN}${getBasePrefix()}`;
}

/** Builds an absolute URL from a base-relative path. */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${siteBase()}${clean === '/' ? '' : clean}`;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string, managed: Set<Element>): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  el.setAttribute(META_MARK, '');
  managed.add(el);
}

function upsertLink(rel: string, href: string, managed: Set<Element>, hreflang?: string): void {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  el.setAttribute(META_MARK, '');
  managed.add(el);
}

/**
 * Applies localized document title, meta, canonical, hreflang, Open Graph,
 * Twitter Card and JSON-LD for the current page. Safe to call on every render.
 */
export function applySeo(config: SeoConfig): void {
  if (typeof document === 'undefined') return;
  try {
    const {
      lang,
      title,
      description,
      path,
      ogType = 'website',
      ogImage = DEFAULT_OG_IMAGE,
      robots = 'index,follow',
      keywords,
      alternates,
      jsonLd,
    } = config;

    const managed = new Set<Element>();

    document.title = title;

    upsertMeta('name', 'description', description, managed);
    if (keywords) upsertMeta('name', 'keywords', keywords, managed);
    upsertMeta('name', 'robots', robots, managed);

    upsertMeta('property', 'og:type', ogType, managed);
    upsertMeta('property', 'og:site_name', SITE_NAME, managed);
    upsertMeta('property', 'og:title', title, managed);
    upsertMeta('property', 'og:description', description, managed);
    upsertMeta('property', 'og:image', ogImage, managed);
    upsertMeta('property', 'og:image:secure_url', ogImage, managed);
    upsertMeta('property', 'og:image:width', '1200', managed);
    upsertMeta('property', 'og:image:height', '630', managed);
    upsertMeta('property', 'og:image:alt', OG_IMAGE_ALT, managed);
    upsertMeta('property', 'og:locale', lang === 'de' ? 'de_DE' : 'en_US', managed);
    upsertMeta('property', 'og:locale:alternate', lang === 'de' ? 'en_US' : 'de_DE', managed);

    upsertMeta('name', 'twitter:card', 'summary_large_image', managed);
    upsertMeta('name', 'twitter:title', title, managed);
    upsertMeta('name', 'twitter:description', description, managed);
    upsertMeta('name', 'twitter:image', ogImage, managed);
    upsertMeta('name', 'twitter:image:alt', OG_IMAGE_ALT, managed);

    if (path) {
      const url = absoluteUrl(path);
      upsertMeta('property', 'og:url', url, managed);
      upsertLink('canonical', url, managed);
    }

    if (alternates) {
      alternates.forEach((alternate) => {
        upsertLink('alternate', absoluteUrl(alternate.path), managed, alternate.hreflang);
      });
    }

    // Structured data: replace this page's JSON-LD block entirely.
    document.querySelectorAll(`script[${JSONLD_MARK}]`).forEach((el) => el.remove());
    (jsonLd || []).forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(JSONLD_MARK, '');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Drop managed tags left over from a previous route (e.g. stale hreflang).
    document.querySelectorAll(`[${META_MARK}]`).forEach((el) => {
      if (!managed.has(el)) el.remove();
    });
  } catch {
    /* head unavailable — ignore */
  }
}