import { supabase } from '@/lib/supabase';
import { getBasePrefix } from '@/lib/lang';

const REF_KEY = 'univers.ref';
const VISITOR_KEY = 'univers.visitor';

/** A stable, anonymous id used to attribute an invite visit to a later signup on the same device. */
export function getVisitorId(): string {
  try {
    let id = window.localStorage.getItem(VISITOR_KEY);
    if (!id) {
      const generated =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      id = generated;
      window.localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

export function getStoredRef(): string | null {
  try {
    const value = window.localStorage.getItem(REF_KEY);
    return value && value.trim() ? value.trim() : null;
  } catch {
    return null;
  }
}

export function setStoredRef(code: string): void {
  try {
    window.localStorage.setItem(REF_KEY, code.trim().toUpperCase());
  } catch {
    /* ignore */
  }
}

export function clearStoredRef(): void {
  try {
    window.localStorage.removeItem(REF_KEY);
  } catch {
    /* ignore */
  }
}

/** Reads `?ref=CODE`, persists it and registers the visit. Returns the code when present. */
export function captureRefFromUrl(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (!ref || !ref.trim()) return null;
    const code = ref.trim().toUpperCase();
    setStoredRef(code);
    void registerInviteVisit(code);
    return code;
  } catch {
    return null;
  }
}

export async function registerInviteVisit(code: string): Promise<void> {
  try {
    await supabase.rpc('register_invite_visit', { p_code: code, p_visitor: getVisitorId() });
  } catch {
    /* silent — tracking only */
  }
}

/** Called once a session exists; converts a pending invite into a joined one. */
export async function redeemPendingRef(): Promise<boolean> {
  const code = getStoredRef();
  if (!code) return false;
  try {
    const { data, error } = await supabase.rpc('redeem_invite', {
      p_code: code,
      p_visitor: getVisitorId(),
    });
    if (error) throw error;
    const result = (data ?? {}) as { ok?: boolean };
    if (result.ok) {
      clearStoredRef();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function buildReferralLink(code: string): string {
  const prefix = getBasePrefix();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${prefix}/signup?ref=${encodeURIComponent(code)}`;
}