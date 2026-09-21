import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { captureRefFromUrl, redeemPendingRef } from '@/lib/invites';

/**
 * Captures an incoming `?ref=CODE` referral link and converts it into a
 * "joined" invite once the visitor actually has a session.
 * Renders nothing — pure side-effect component mounted at app root.
 */
export default function ReferralSync() {
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    captureRefFromUrl();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    void (async () => {
      const redeemed = await redeemPendingRef();
      if (active && redeemed) {
        await refreshProfile();
      }
    })();
    return () => {
      active = false;
    };
  }, [user?.id, refreshProfile]);

  return null;
}