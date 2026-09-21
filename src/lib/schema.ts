/**
 * Schema.org (JSON-LD) builders for UniverS.
 * Every value must match visible page content — no invented facts.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export interface CrumbItem {
  name: string;
  path: string;
}

const CONTACT_EMAIL = 'hello@oloai.ch';

/**
 * Brand mark used as the Organization logo.
 * NOTE: replace with a stable asset on the production domain (e.g. https://getunivers.readdy.co/logo.png)
 * once available; until then this is the same mark used as the site icon.
 */
const LOGO_URL =
  'https://readdy.ai/api/search-image?query=minimal%20flat%20app%20icon%20of%20a%20graduation%20cap%20in%20deep%20forest%20green%20on%20a%20warm%20cream%20rounded%20square%20background%2C%20simple%20geometric%20vector%20style%2C%20high%20contrast%2C%20centered&width=512&height=512&seq=univers-mark-01&orientation=squarish';

export function websiteSchema(
  base: string,
  name: string,
  description: string,
  lang: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: `${base}/`,
    inLanguage: lang,
    description,
    publisher: { '@type': 'Organization', name },
  };
}

export function organizationSchema(base: string, lang: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UniverS',
    url: `${base}/`,
    logo: LOGO_URL,
    email: CONTACT_EMAIL,
    description:
      lang === 'de'
        ? 'UniverS ist die internationale Plattform, die Lernende — Schüler:innen, Studierende, Austauschstudierende, Alumni und Mentor:innen — in unter 3 Minuten mit dem passenden Lernpartner verbindet.'
        : 'UniverS is the international platform that matches learners — school students, university students, exchange students, alumni and mentors — with the right study partner in under 3 minutes.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CH',
      addressLocality: 'Oftringen',
      streetAddress: 'Baslerstrasse 39',
      postalCode: '4665',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: CONTACT_EMAIL,
      availableLanguage: ['English', 'German'],
    },
  };
}

export function educationalOrganizationSchema(base: string, lang: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'UniverS',
    url: `${base}/`,
    logo: LOGO_URL,
    description:
      lang === 'de'
        ? 'UniverS ist ein Lernnetzwerk für Lernende auf jeder Stufe: Lernpartner, Studienkolleg:innen und Projektpartner nach Fachbereich, Niveau, Sprache und Zeitzone finden.'
        : 'UniverS is a learning network for learners at every stage: find study partners, classmates and project partners by subject, level, language and timezone.',
    areaServed: 'Worldwide',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
  };
}

export function faqPageSchema(items: FaqItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function breadcrumbSchema(base: string, items: CrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${base}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

export interface WebPageInput {
  name: string;
  description: string;
  path: string;
  lang: string;
}

/**
 * Generic WebPage schema for indexable secondary pages (login, signup, legal).
 * Values are taken directly from the page's own visible title/description copy.
 */
export function webPageSchema(base: string, input: WebPageInput): Record<string, unknown> {
  const url = `${base}${input.path === '/' ? '' : input.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    description: input.description,
    url,
    inLanguage: input.lang,
    isPartOf: {
      '@type': 'WebSite',
      name: 'UniverS',
      url: `${base}/`,
    },
  };
}