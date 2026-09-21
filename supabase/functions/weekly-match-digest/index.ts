import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const RESEND_FROM_DOMAIN = Deno.env.get('RESEND_FROM_DOMAIN') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

/**
 * Canonical production origin for every link inside an email.
 * Pinned so a preview/sandbox host can never leak into a real inbox.
 * Override with PUBLIC_SITE_URL only if the production host ever changes.
 */
const SITE_ORIGIN = (Deno.env.get('PUBLIC_SITE_URL') ?? 'https://getunivers.readdy.co').replace(/\/+$/, '');

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/* UniverS design system tokens (in sync with the app palette). */
const C = {
  canvas: '#F7F6F1',
  card: '#FFFFFF',
  border: '#E4E0D6',
  panel: '#F1EFE8',
  spruce: '#2F6B57',
  spruceDark: '#1E4A3B',
  honey: '#D69A4C',
  ink: '#24201A',
  body: '#4A4438',
  muted: '#8A8375',
  onDark: '#F4F3EE',
};

const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "Helvetica,Arial,sans-serif";

interface DigestRow {
  user_id: string;
  email: string | null;
  full_name: string | null;
  match_count: number;
  sample_names: string[] | null;
}

function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(
  preheader: string,
  eyebrow: string,
  heading: string,
  intro: string,
  counter: { value: string; label: string },
  cta: string,
  link: string,
  footerReason: string,
  appTagline: string,
  langNote: string,
): string {
  return `<!doctype html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>UniverS</title>
</head>
<body style="margin:0;padding:0;background:${C.canvas};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.canvas};padding:32px 14px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:${C.card};border:1px solid ${C.border};border-radius:14px;overflow:hidden;">

        <tr><td style="background:${C.spruceDark};padding:24px 30px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-family:${SERIF};font-size:20px;font-weight:700;letter-spacing:0.04em;color:${C.onDark};">UniverS</td>
            <td align="right" style="font-family:${SANS};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.honey};">${escapeHtml(appTagline)}</td>
          </tr></table>
        </td></tr>
        <tr><td style="height:4px;background:${C.honey};line-height:4px;font-size:0;">&nbsp;</td></tr>

        <tr><td style="padding:30px 30px 10px;">
          <p style="margin:0 0 8px;font-family:${SANS};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${C.spruce};">${escapeHtml(eyebrow)}</p>
          <h1 style="margin:0 0 14px;font-family:${SERIF};font-size:23px;line-height:1.3;color:${C.ink};">${escapeHtml(heading)}</h1>
          <p style="margin:0 0 22px;font-family:${SANS};font-size:14px;line-height:1.7;color:${C.body};">${intro}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;background:${C.panel};border-left:3px solid ${C.honey};border-radius:6px;">
            <tr><td style="padding:18px;font-family:${SERIF};font-size:30px;font-weight:700;color:${C.spruceDark};">${escapeHtml(counter.value)}</td></tr>
            <tr><td style="padding:0 18px 16px;font-family:${SANS};font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:${C.muted};">${escapeHtml(counter.label)}</td></tr>
          </table>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px;"><tr>
            <td style="background:${C.spruce};border-radius:8px;">
              <a href="${link}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:14px;font-weight:700;color:${C.onDark};text-decoration:none;">${escapeHtml(cta)} &rarr;</a>
            </td>
          </tr></table>
        </td></tr>

        <tr><td style="padding:20px 30px 26px;border-top:1px solid ${C.border};">
          <p style="margin:0 0 6px;font-family:${SERIF};font-size:14px;font-weight:700;color:${C.spruceDark};">UniverS</p>
          <p style="margin:0 0 10px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.body};">${escapeHtml(appTagline)}</p>
          <p style="margin:0 0 8px;font-family:${SANS};font-size:11px;line-height:1.6;color:${C.muted};">${escapeHtml(footerReason)}</p>
          <p style="margin:0;font-family:${SANS};font-size:11px;line-height:1.6;color:${C.muted};">${escapeHtml(langNote)}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  if (!RESEND_API_KEY || !RESEND_FROM_DOMAIN) {
    return json({ ok: false, reason: 'email_not_configured' });
  }

  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (!token) return json({ ok: false, reason: 'unauthenticated' }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const isSystem = token === SERVICE_ROLE;
  if (!isSystem) {
    const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) return json({ ok: false, reason: 'unauthenticated' }, 401);
    const { data: prof } = await admin
      .from('profiles')
      .select('is_founder')
      .eq('id', userData.user.id)
      .maybeSingle();
    if (!prof?.is_founder) return json({ ok: false, reason: 'founder_only' }, 403);
  }

  let locale: string | null = null;
  try {
    const body = await req.json();
    if (body?.locale === 'de') locale = 'de';
  } catch {
    /* no body is fine */
  }

  const { data: rows, error } = await admin.rpc('get_weekly_digest');
  if (error) return json({ ok: false, reason: 'digest_failed' }, 400);

  const weekKey = isoWeekKey(new Date());
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of (rows as DigestRow[]) ?? []) {
    if (!row.email || !row.match_count || row.match_count <= 0 || !row.user_id) {
      skipped += 1;
      continue;
    }

    const refId = `digest:${weekKey}`;
    const { data: existing } = await admin
      .from('email_log')
      .select('id')
      .eq('user_id', row.user_id)
      .eq('email_type', 'weekly_match_digest')
      .eq('ref_id', refId)
      .maybeSingle();
    if (existing) {
      skipped += 1;
      continue;
    }

    const rowLocale = locale ?? 'en';
    const de = rowLocale === 'de';
    const name = (row.full_name || '').split(' ')[0] || (de ? 'dort' : 'there');
    const names = (row.sample_names ?? []).filter(Boolean).slice(0, 3).join(', ');
    const link = `${SITE_ORIGIN}/app/matches`;

    const eyebrow = de ? 'Wöchentliche Empfehlung' : 'Weekly recommendation';
    const heading = de ? 'Deine Woche bei UniverS' : 'Your week on UniverS';
    const intro = de
      ? `Hi ${escapeHtml(name)}, aktuell passen <strong>${row.match_count} Lernende</strong> zu deinem Profil${names ? `. Zum Beispiel: ${escapeHtml(names)}` : ''}. Schau vorbei und sende deine erste Anfrage.`
      : `Hi ${escapeHtml(name)}, <strong>${row.match_count} learners</strong> currently match your profile${names ? `. For example: ${escapeHtml(names)}` : ''}. Take a look and send your first request.`;
    const counter = {
      value: String(row.match_count),
      label: de ? 'passende Lernende' : 'matching learners',
    };
    const cta = de ? 'Meine Matches ansehen' : 'See my matches';
    const subject = de
      ? `${row.match_count} neue Match-Vorschläge für dich`
      : `${row.match_count} new match suggestions for you`;
    const preheader = de
      ? `${row.match_count} Lernende passen diese Woche zu deinem Profil.`
      : `${row.match_count} learners match your profile this week.`;
    const footerReason = de
      ? 'Du erhältst diese E-Mail, weil du ein Konto bei UniverS hast.'
      : 'You are receiving this email because you have a UniverS account.';
    const appTagline = de ? 'Lernpartner in 3 Minuten' : 'Study partner in 3 minutes';
    const langNote = de
      ? 'UniverS — eine internationale Plattform für Lernende weltweit.'
      : 'UniverS — an international platform for learners worldwide.';

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `UniverS <hello@${RESEND_FROM_DOMAIN}>`,
          to: [row.email],
          subject,
          html: layout(preheader, eyebrow, heading, intro, counter, cta, link, footerReason, appTagline, langNote),
        }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        failed += 1;
        await admin.from('email_log').insert({
          user_id: row.user_id,
          email_type: 'weekly_match_digest',
          ref_id: refId,
          locale: rowLocale,
          status: 'failed',
          error: (result as { message?: string } | null)?.message ?? `http_${res.status}`,
        });
        continue;
      }
      sent += 1;
      await admin.from('email_log').insert({
        user_id: row.user_id,
        email_type: 'weekly_match_digest',
        ref_id: refId,
        locale: rowLocale,
        resend_id: (result as { id?: string } | null)?.id ?? null,
        status: 'sent',
      });
    } catch {
      failed += 1;
    }
  }

  return json({ ok: true, week: weekKey, sent, skipped, failed });
});
