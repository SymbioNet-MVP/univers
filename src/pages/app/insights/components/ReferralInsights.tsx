import { useTranslation } from 'react-i18next';
import type { ReferralStats } from '@/hooks/useFounderInsights';

function formatPct(value: number): string {
  return `${Math.round(value * 10) / 10}%`;
}

export default function ReferralInsights({ referrals }: { referrals: ReferralStats }) {
  const { t } = useTranslation();

  const items = [
    { key: 'invites', value: referrals.invites, icon: 'ri-link' },
    { key: 'visits', value: referrals.visits, icon: 'ri-eye-line' },
    { key: 'emails', value: referrals.emails, icon: 'ri-mail-send-line' },
    { key: 'joined', value: referrals.joined, icon: 'ri-user-follow-line' },
    { key: 'referrers', value: referrals.referrers, icon: 'ri-share-forward-line' },
  ] as const;

  const conversion = referrals.invites > 0 ? (referrals.joined / referrals.invites) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-accent-200 bg-accent-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-accent-800">
            <span className="w-8 h-8 flex items-center justify-center rounded-md bg-accent-100">
              <i className="ri-percent-line"></i>
            </span>
            <span className="text-xs font-medium">{t('insights.referral.conversion')}</span>
          </div>
          <span className="font-heading text-xl font-semibold text-accent-800">
            {formatPct(conversion)}
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-foreground-600">
          {referrals.joined} / {referrals.invites} {t('insights.referral.conversionHint')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.key} className="rounded-lg border border-background-200 bg-background-50 p-3.5">
            <div className="flex items-center gap-1.5 text-foreground-500">
              <i className={`${item.icon} text-sm`}></i>
            </div>
            <p className="mt-2 font-heading text-xl font-semibold text-foreground-950">{item.value}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-foreground-500">
              {t(`insights.referral.${item.key}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}