import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GoalPaths from './GoalPaths';
import RegistrationPanel from './RegistrationPanel';

/**
 * The single signup zone: pick what you want to learn on the left, create your
 * account on the right. This is the only signup action on the page.
 */
export default function RegisterSection() {
  const { t } = useTranslation();
  const [goal, setGoal] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSelect = (selected: string) => {
    setGoal(selected);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="register" className="container-page scroll-mt-20 py-14 md:py-20">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="animate-fade-up">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground-950 md:text-3xl">
            {t('landing.paths.label')}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground-600 md:text-base">
            {t('landing.paths.hint')}
          </p>
          <div className="mt-6">
            <GoalPaths selected={goal} onSelect={handleSelect} hideLabel />
          </div>
        </div>

        <div ref={formRef} className="animate-fade-up delay-200">
          <RegistrationPanel goal={goal} />
        </div>
      </div>
    </section>
  );
}