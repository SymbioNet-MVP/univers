import { useTranslation } from 'react-i18next';
import type { VerificationStatus } from '@/types/db';

const CONFIG: Record<VerificationStatus, { icon: string; tone: string }> = {
  verified: { icon: 'ri-verified-badge-fill', tone: 'text-primary-600' },
  pending: { icon: 'ri-time-line', tone: 'text-accent-600' },
  unverified: { icon: 'ri-shield-line', tone: 'text-foreground-500' },
  rejected: { icon: 'ri-close-circle-line', tone: 'text-foreground-500' },
};

export default function VerificationBadge({ status }: { status: VerificationStatus }) {
  const { t } = useTranslation();
  const conf = CONFIG[status];
  const label =
    status === 'verified'
      ? t('dashboard.verified')
      : status === 'pending'
        ? t('dashboard.pending')
        : t('dashboard.unverified');

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${conf.tone}`}>
      <span className="w-3.5 h-3.5 flex items-center justify-center">
        <i className={`${conf.icon} text-sm`}></i>
      </span>
      {label}
    </span>
  );
}