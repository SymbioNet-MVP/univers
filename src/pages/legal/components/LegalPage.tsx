import { useTranslation } from 'react-i18next';
import SiteFooter from '@/components/feature/SiteFooter';
import LegalHeader from '@/pages/legal/components/LegalHeader';

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'mail'; label: string; email: string }
  | { type: 'rows'; rows: { label: string; value: string; placeholder?: boolean }[] };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}

function SectionBody({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'p') {
          return (
            <p key={index} className="mt-4 text-sm leading-relaxed text-foreground-700">
              {block.text}
            </p>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={index} className="mt-4 space-y-2.5">
              {block.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground-700">
                  <span className="mt-0.5 w-4 h-4 flex items-center justify-center shrink-0 text-primary-600">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'mail') {
          return (
            <div
              key={index}
              className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-md border border-background-200 bg-background-100/60 px-3.5 py-2.5"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-500">
                {block.label}
              </span>
              <a
                href={`mailto:${block.email}`}
                className="text-sm font-medium text-primary-700 hover:text-primary-800"
              >
                {block.email}
              </a>
            </div>
          );
        }

        return (
          <dl key={index} className="mt-4 overflow-hidden rounded-lg border border-background-200">
            {block.rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 border-b border-background-200 px-4 py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <dt className="w-full text-xs font-medium uppercase tracking-wide text-foreground-500 sm:w-48 sm:shrink-0">
                  {row.label}
                </dt>
                <dd className="text-sm text-foreground-800">
                  {row.placeholder ? (
                    <span className="inline-block rounded bg-accent-100 px-2 py-0.5 font-medium text-accent-900">
                      {row.value}
                    </span>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        );
      })}
    </>
  );
}

/** Shared shell for the legal pages: hero, sticky table of contents and sections. */
export default function LegalPage({ eyebrow, title, subtitle, updated, sections }: LegalPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background-50">
      <LegalHeader />

      <main className="container-page pt-10 md:pt-14 pb-16 md:pb-24">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            {eyebrow}
          </span>
          <h1 className="mt-3 font-heading text-3xl md:text-4xl font-semibold tracking-tight text-foreground-950">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground-700">{subtitle}</p>
          <p className="mt-3 text-xs text-foreground-500">{updated}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <nav aria-label={t('legal.tocTitle')} className="lg:col-span-3">
            <div className="rounded-lg border border-background-200 bg-background-100/60 p-4 lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-500">
                {t('legal.tocTitle')}
              </p>
              <ul className="mt-3 space-y-1.5">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-2 text-sm text-foreground-700 hover:text-primary-700 transition-colors"
                    >
                      <span className="text-foreground-400">{index + 1}.</span>
                      <span>{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="lg:col-span-9">
            <div className="space-y-6">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-lg border border-background-200 bg-background-50 p-5 md:p-7"
                >
                  <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground-950">
                    <span className="mr-2 text-primary-600">{index + 1}.</span>
                    {section.heading}
                  </h2>
                  <SectionBody blocks={section.blocks} />
                </section>
              ))}
            </div>

            <p className="mt-8 text-xs leading-relaxed text-foreground-500">{t('legal.disclaimer')}</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}