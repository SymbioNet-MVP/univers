import { useCallback, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@/components/base/Avatar';
import Spinner from '@/components/base/Spinner';
import { track } from '@/lib/analytics';
import { useInvites } from '@/hooks/useInvites';
import InviteShareChannels from './InviteShareChannels';

interface BadgeDef {
  key: string;
  icon: string;
  tone: string;
}

const BADGES: BadgeDef[] = [
  { key: 'founding', icon: 'ri-seedling-line', tone: 'bg-primary-500 text-background-50' },
  { key: 'early', icon: 'ri-star-line', tone: 'bg-accent-500 text-background-50' },
  { key: 'ambassador', icon: 'ri-share-forward-line', tone: 'bg-secondary-500 text-background-50' },
];

export default function InviteModule() {
  const { t } = useTranslation();
  const {
    link,
    code,
    invitedCount,
    joinedCount,
    invites,
    loading,
    error,
    reload,
    addEmailInvite,
  } = useInvites();

  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [inviteError, setInviteError] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);

  const copyLink = useCallback(async () => {
    if (!link) return;
    setCopyError(false);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        linkRef.current?.select();
        document.execCommand('copy');
      }
      setCopied(true);
      track('invite_copied', { source: 'copy_button' });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        linkRef.current?.select();
        document.execCommand('copy');
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopyError(true);
      }
    }
  }, [link]);

  const shareLink = useCallback(async () => {
    if (!link) return;
    const nav = navigator as Navigator & {
      share?: (data: { title: string; text: string; url: string }) => Promise<void>;
    };
    if (typeof nav.share === 'function') {
      try {
        await nav.share({
          title: t('invite.shareTitle'),
          text: t('invite.shareText'),
          url: link,
        });
        track('invite_share', { channel: 'native' });
        return;
      } catch {
        // User dismissed the native sheet or it is unsupported — fall back to copy.
      }
    }
    track('invite_share', { channel: 'copy_fallback' });
    await copyLink();
  }, [link, t, copyLink]);

  const handleAddEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;
    setAdding(true);
    setAdded(false);
    setInviteError(false);
    const ok = await addEmailInvite(value);
    setAdding(false);
    if (ok) {
      setAdded(true);
      setEmail('');
      window.setTimeout(() => setAdded(false), 2500);
    } else {
      setInviteError(true);
    }
  };

  const badges = BADGES.map((badge, index) => ({
    ...badge,
    earned: index === 0 ? joinedCount >= 1 : index === 1 ? true : joinedCount >= 5,
    label: t(`invite.badge${index === 0 ? 'Founding' : index === 1 ? 'Early' : 'Ambassador'}`),
    hint: t(`invite.badge${index === 0 ? 'Founding' : index === 1 ? 'Early' : 'Ambassador'}Hint`),
  }));

  return (
    <section id="invite-module" className="scroll-mt-24 rounded-lg border border-background-200 bg-background-50 p-4 md:p-6">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 flex items-center justify-center rounded-md bg-accent-100 text-accent-800 shrink-0">
          <i className="ri-user-add-line text-lg"></i>
        </span>
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground-950">
            {t('invite.title')}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-foreground-600">{t('invite.subtitle')}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Personal link */}
          <div>
            <label htmlFor="invite-link" className="block text-xs font-medium text-foreground-700">
              {t('invite.yourLink')}
            </label>
            <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
              <input
                id="invite-link"
                ref={linkRef}
                type="text"
                readOnly
                value={link}
                onFocus={(event) => event.currentTarget.select()}
                className="w-full flex-1 truncate rounded-md border border-background-300 bg-background-100 px-3 py-2.5 text-sm text-foreground-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  disabled={!link}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600 disabled:opacity-60"
                >
                  <i className={copied ? 'ri-check-line' : 'ri-file-copy-line'}></i>
                  {copied ? t('invite.copied') : t('invite.copy')}
                </button>
                <button
                  type="button"
                  onClick={() => void shareLink()}
                  disabled={!link}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-medium text-foreground-800 hover:bg-background-100 disabled:opacity-60"
                >
                  <i className="ri-share-forward-line"></i>
                  {t('invite.share')}
                </button>
              </div>
            </div>
            {copyError && <p className="mt-2 text-xs text-accent-700">{t('common.error')}</p>}
            <p className="mt-2 text-xs text-foreground-500">{t('invite.linkHint')}</p>

            <div className="mt-4 border-t border-background-200 pt-4">
              <InviteShareChannels link={link} disabled={!link} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-background-200 bg-background-100/60 p-4">
              <div className="flex items-center gap-2 text-foreground-600">
                <i className="ri-mail-send-line"></i>
                <span className="text-xs font-medium">{t('invite.invited')}</span>
              </div>
              <p className="mt-2 font-heading text-2xl font-semibold text-foreground-950">
                {loading ? '—' : invitedCount}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-foreground-500">
                {t('invite.invitedHint')}
              </p>
            </div>
            <div className="rounded-lg border border-primary-200 bg-primary-50/60 p-4">
              <div className="flex items-center gap-2 text-primary-700">
                <i className="ri-user-follow-line"></i>
                <span className="text-xs font-medium">{t('invite.joined')}</span>
              </div>
              <p className="mt-2 font-heading text-2xl font-semibold text-primary-700">
                {loading ? '—' : joinedCount}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-foreground-500">
                {t('invite.joinedHint')}
              </p>
            </div>
          </div>

          {/* Pre-invite by email */}
          <form onSubmit={handleAddEmail} className="rounded-lg border border-background-200 bg-background-50 p-4">
            <h3 className="font-heading text-sm font-semibold text-foreground-950">
              {t('invite.preInviteTitle')}
            </h3>
            <p className="mt-1 text-xs text-foreground-500">{t('invite.preInviteHint')}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                name="inviteEmail"
                aria-label={t('invite.preInviteTitle')}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('invite.emailPlaceholder')}
                className="w-full flex-1 rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-950 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="submit"
                disabled={adding || !email.trim() || !code}
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-medium text-foreground-800 hover:bg-background-100 disabled:opacity-60"
              >
                {adding ? <Spinner /> : <i className="ri-add-line"></i>}
                {t('invite.addInvite')}
              </button>
            </div>
            {added && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary-700">
                <i className="ri-check-line"></i>
                {t('invite.added')}
              </p>
            )}
            {inviteError && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent-700">
                <i className="ri-error-warning-line"></i>
                {t('invite.error')}
              </p>
            )}
          </form>
        </div>

        {/* Badges */}
        <div className="rounded-lg border border-background-200 bg-background-100/60 p-4">
          <h3 className="font-heading text-sm font-semibold text-foreground-950">
            {t('invite.badgesTitle')}
          </h3>
          <ul className="mt-4 space-y-3">
            {badges.map((badge) => (
              <li
                key={badge.key}
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  badge.earned
                    ? 'border-background-200 bg-background-50'
                    : 'border-dashed border-background-300 bg-transparent'
                }`}
              >
                <span
                  className={`w-9 h-9 flex items-center justify-center rounded-md shrink-0 ${
                    badge.earned ? badge.tone : 'bg-background-200 text-foreground-500'
                  }`}
                >
                  <i className={`${badge.earned ? badge.icon : 'ri-lock-line'} text-base`}></i>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground-950">{badge.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-foreground-600">{badge.hint}</p>
                  <span
                    className={`mt-1.5 inline-block text-[11px] font-medium ${
                      badge.earned ? 'text-primary-700' : 'text-foreground-400'
                    }`}
                  >
                    {badge.earned ? t('invite.earned') : t('invite.locked')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Invite list */}
      <div className="mt-6 border-t border-background-200 pt-5">
        <h3 className="font-heading text-sm font-semibold text-foreground-950">
          {t('invite.listTitle')}
        </h3>

        {loading && (
          <div className="mt-3 flex items-center gap-2 text-sm text-foreground-500">
            <Spinner />
            {t('common.loading')}
          </div>
        )}

        {!loading && error && (
          <div className="mt-3 flex items-center gap-3">
            <p className="text-sm text-foreground-600">{t('common.error')}</p>
            <button
              type="button"
              onClick={() => void reload()}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-background-300 px-3 py-1.5 text-xs font-medium text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-refresh-line"></i>
              {t('common.retry')}
            </button>
          </div>
        )}

        {!loading && !error && invites.length === 0 && (
          <p className="mt-2 text-sm text-foreground-500">{t('invite.emptyStats')}</p>
        )}

        {!loading && !error && invites.length > 0 && (
          <ul className="mt-3 divide-y divide-background-200">
            {invites.slice(0, 6).map((invite) => (
              <li key={invite.id} className="flex items-center gap-3 py-2.5">
                <Avatar name={invite.invited_email || 'Guest'} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground-800">
                    {invite.invited_email || t('invite.noEmail')}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    invite.status === 'joined'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-background-200 text-foreground-600'
                  }`}
                >
                  <i className={invite.status === 'joined' ? 'ri-check-line' : 'ri-time-line'}></i>
                  {invite.status === 'joined'
                    ? t('invite.statusJoined')
                    : t('invite.statusPending')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}