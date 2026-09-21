import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BrandLogo from '@/components/feature/BrandLogo';
import LanguageSwitcher from '@/components/feature/LanguageSwitcher';
import SiteFooter from '@/components/feature/SiteFooter';
import Hero from './components/Hero';
import RegisterSection from './components/RegisterSection';

const HERO_IMAGE =
  'https://public.readdy.ai/ai/img_res/edited_44cb4046040c68b8b0c892220f314fa7_afdf7237.jpg';

export default function Home() {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-background-50">
      <section className="relative overflow-hidden bg-primary-950">
        {/* Desktop: full-bleed background behind the message */}
        <div className="absolute inset-0 hidden md:block" aria-hidden="true">
          <img
            src={HERO_IMAGE}
            alt="Learners studying together with a laptop and notebooks, sharing knowledge on UniverS"
            title="Learn together — find a study partner on UniverS"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25"></div>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent"></div>
        </div>

        <div className="relative">
          <header className="container-page flex h-16 items-center justify-between md:h-20">
            <BrandLogo tone="dark" />
            <div className="flex items-center gap-3 md:gap-4">
              <LanguageSwitcher tone="dark" />
              <Link
                to="/login"
                className="whitespace-nowrap cursor-pointer text-sm font-medium text-background-50 transition-colors hover:text-primary-300"
              >
                {t('landing.header.login')}
              </Link>
            </div>
          </header>

          {/*
            Mobile: give the photo its own landscape-shaped band so the whole
            frame (both learners) stays in view instead of being zoom-cropped by
            a tall screen. Height is kept compact so the headline stays near the
            fold; it fades down into the dark headline area below.
          */}
          <div className="relative h-[165px] w-full sm:h-[210px] md:hidden" aria-hidden="true">
            <img
              src={HERO_IMAGE}
              alt="Learners studying together with a laptop and notebooks, sharing knowledge on UniverS"
              title="Learn together — find a study partner on UniverS"
              className="h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-950/55 via-transparent to-primary-950"></div>
          </div>

          <Hero />
        </div>
      </section>

      <main className="flex-1">
        <RegisterSection />
      </main>

      <SiteFooter />
    </div>
  );
}