import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { track } from '@/lib/analytics';

interface InviteShareChannelsProps {
  link: string;
  disabled?: boolean;
}

type Channel = 'whatsapp' | 'telegram' | 'email';

/**
 * One-tap share channels for the invite link. Renders real anchors so the
 * links stay accessible, keyboard operable and work without JS popups.
 */
export default function InviteShareChannels({ link, disabled = false }: InviteShareChannelsProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const text = `${t('invite.shareText')} ${link}`;

  const hrefs: Record<Channel, string> = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(t('invite.shareText'))}`,
    email: `mailto:?subject=${encodeURIComponent(t('invite.emailSubject'))}&body=${encodeURIComponent(text)}`,
  };

  const channels: { key: Channel; label: string; icon: string; tone: string }[] = [
    { key: 'whatsapp', label: t('invite.shareWhatsapp'), icon: 'ri-whatsapp-line', tone: 'text-primary-700 border-primary-200 bg-primary-50' },
    { key: 'telegram', label: t('invite.shareTelegram'), icon: 'ri-telegram-line', tone: 'text-secondary-900 border-secondary-200 bg-secondary-50' },
    { key: 'email', label: t('invite.shareEmail'), icon: 'ri-mail-line', tone: 'text-accent-800 border-accent-200 bg-accent-50' },
  ];

  const handleClick = (channel: Channel) => {
    track('invite_share', { channel });
  };

  const handleCopy = async () => {
    if (!link) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      track('invite_copied', { source: 'share_panel' });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the plain copy button below still works */
    }
  };

  return (
    <div>
      <p className="text-xs font-medium text-foreground-700">{t('invite.shareVia')}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {channels.map((channel) => (
          <a
            key={channel.key}
            href={disabled ? undefined : hrefs[channel.key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={disabled}
            onClick={() => !disabled && handleClick(channel.key)}
            className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:brightness-[0.97] ${channel.tone} ${
              disabled ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <i className={channel.icon}></i>
            {channel.label}
          </a>
        ))}
        <button
          type="button"
          onClick={() => void handleCopy()}
          disabled={disabled || !link}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-3 py-2 text-sm font-medium text-foreground-800 hover:bg-background-100 disabled:opacity-50"
        >
          <i className={copied ? 'ri-check-line' : 'ri-file-copy-line'}></i>
          {copied ? t('invite.copied') : t('invite.copyMessage')}
        </button>
      </div>
    </div>
  );
}