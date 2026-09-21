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

/* UniverS design system tokens (in sync with the app palette):
 * warm off-white canvas, deep spruce brand, honey accent, warm neutrals. */
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

type EmailType = 'welcome' | 'match_request' | 'match_accepted' | 'new_message';
const TYPES: EmailType[] = ['welcome', 'match_request', 'match_accepted', 'new_message'];

interface Detail {
  label: string;
  value: string;
}

interface Mail {
  subject: string;
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  note?: string;
  details: Detail[];
  cta: string;
  hint: string;
}

interface ActorCtx {
  name: string;
  field?: string;
  institution?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildMail(
  type: EmailType,
  locale: string,
  ctx: { name: string; actor: ActorCtx; note?: string },
): Mail {
  const de = locale === 'de';
  const name = ctx.name || (de ? 'dort' : 'there');
  const actorName = ctx.actor.name || (de ? 'Jemand' : 'Someone');

  const actorDetails = (): Detail[] => {
    const rows: Detail[] = [];
    if (ctx.actor.field) rows.push({ label: de ? 'Studienfach' : 'Field of study', value: ctx.actor.field });
    if (ctx.actor.institution) {
      rows.push({ label: de ? 'Institution' : 'Institution', value: ctx.actor.institution });
    }
    return rows;
  };

  if (type === 'welcome') {
    return de
      ? {
          subject: 'Willkommen bei UniverS — deine Matches warten',
          preheader: 'Dein Konto ist bereit. In unter 3 Minuten zu deinem ersten Match.',
          eyebrow: 'Willkommen',
          heading: 'Willkommen bei UniverS',
          intro: `Hi ${escapeHtml(name)}, dein Konto ist bereit. Vervollständige dein Profil und wir zeigen dir Lernende, die zu Fachbereich, Niveau und Sprache passen — die ersten Vorschläge kommen meist in unter 3 Minuten.`,
          details: [],
          cta: 'Meine Matches ansehen',
          hint: 'Tipp: Verifizierte Profile erscheinen weiter oben in den Vorschlägen.',
        }
      : {
          subject: 'Welcome to UniverS — your matches are ready',
          preheader: 'Your account is ready. Your first match is under 3 minutes away.',
          eyebrow: 'Welcome',
          heading: 'Welcome to UniverS',
          intro: `Hi ${escapeHtml(name)}, your account is ready. Complete your profile and we will show you learners who match your field, level and language — most people see their first suggestions in under 3 minutes.`,
          details: [],
          cta: 'See my matches',
          hint: 'Tip: verified profiles appear higher in match suggestions.',
        };
  }

  if (type === 'match_request') {
    return de
      ? {
          subject: `${actorName} möchte mit dir lernen`,
          preheader: `${actorName} hat dir eine Match-Anfrage gesendet.`,
          eyebrow: 'Neue Anfrage',
          heading: 'Neue Match-Anfrage',
          intro: `Hi ${escapeHtml(name)}, ${escapeHtml(actorName)} würde gerne mit dir lernen. Öffne UniverS, um die Anfrage anzunehmen oder abzulehnen.`,
          note: ctx.note,
          details: actorDetails(),
          cta: 'Anfrage ansehen',
          hint: 'Eine schnelle Antwort hält das Netzwerk in Bewegung.',
        }
      : {
          subject: `${actorName} sent you a match request`,
          preheader: `${actorName} would like to study with you.`,
          eyebrow: 'New request',
          heading: 'New match request',
          intro: `Hi ${escapeHtml(name)}, ${escapeHtml(actorName)} would like to study together. Open UniverS to accept or decline the request.`,
          note: ctx.note,
          details: actorDetails(),
          cta: 'View request',
          hint: 'A quick reply keeps the network moving.',
        };
  }

  if (type === 'match_accepted') {
    return de
      ? {
          subject: `${actorName} hat deine Anfrage angenommen`,
          preheader: `Du bist jetzt mit ${actorName} gematcht — starte das Gespräch.`,
          eyebrow: 'Ihr seid gematcht',
          heading: 'Ihr seid gematcht',
          intro: `Hi ${escapeHtml(name)}, du bist jetzt mit ${escapeHtml(actorName)} gematcht. Starte das Gespräch — eine einzelne Nachricht genügt.`,
          details: actorDetails(),
          cta: 'Chat öffnen',
          hint: 'Die erste Nachricht ist der schwerste Schritt — danach läuft es.',
        }
      : {
          subject: `${actorName} accepted your match request`,
          preheader: `You are now matched with ${actorName} — start the conversation.`,
          eyebrow: 'You are matched',
          heading: 'You are matched',
          intro: `Hi ${escapeHtml(name)}, you are now matched with ${escapeHtml(actorName)}. Start the conversation — a single message is all it takes.`,
          details: actorDetails(),
          cta: 'Open chat',
          hint: 'The first message is the hardest part — after that it flows.',
        };
  }

  return de
    ? {
        subject: `Neue Nachricht von ${actorName}`,
        preheader: `${actorName} hat dir auf UniverS geschrieben.`,
        eyebrow: 'Neue Nachricht',
        heading: 'Neue Nachricht',
        intro: `Hi ${escapeHtml(name)}, ${escapeHtml(actorName)} hat dir eine Nachricht geschickt. Antworte, um das Gespräch am Laufen zu halten.`,
        details: actorDetails(),
        cta: 'Antworten',
        hint: 'Du kannst direkt aus der E-Mail heraus in den Chat springen.',
      }
    : {
        subject: `New message from ${actorName}`,
        preheader: `${actorName} wrote to you on UniverS.`,
        eyebrow: 'New message',
        heading: 'New message',
        intro: `Hi ${escapeHtml(name)}, ${escapeHtml(actorName)} sent you a message. Reply to keep the conversation going.`,
        details: actorDetails(),
        cta: 'Reply',
        hint: 'You can jump straight into the chat from this email.',
      };
}

function detailRows(rows: Detail[]): string {
  if (!rows.length) return '';
  return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;background:${C.panel};border-left:3px solid ${C.honey};border-radius:6px;">
          ${rows
            .map(
              (r, i) => `
          <tr>
            <td style="padding:${i === 0 ? '14px 18px 4px' : '4px 18px'}${i === rows.length - 1 ? ' 14px' : ''};font-family:${SANS};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${C.muted};width:38%;vertical-align:top;">${escapeHtml(r.label)}</td>
            <td style="padding:${i === 0 ? '14px 18px 4px' : '4px 18px'}${i === rows.length - 1 ? ' 14px' : ''};font-family:${SANS};font-size:14px;color:${C.ink};vertical-align:top;">${escapeHtml(r.value)}</td>
          </tr>`,
            )
            .join('')}
        </table>`;
}

function noteBlock(note?: string): string {
  if (!note || !note.trim()) return '';
  return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;background:${C.card};border:1px solid ${C.border};border-radius:8px;">
            <tr><td style="padding:16px 18px;font-family:${SERIF};font-size:15px;font-style:italic;line-height:1.6;color:${C.body};">&ldquo;${escapeHtml(note.trim())}&rdquo;</td></tr>
          </table>`;
}

function layout(mail: Mail, link: string, footerReason: string, appTagline: string, langNote: string): string {
  return `<!doctype html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>UniverS</title>
</head>
<body style="margin:0;padding:0;background:${C.canvas};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(mail.preheader)}</div>
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
          <p style="margin:0 0 8px;font-family:${SANS};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${C.spruce};">${escapeHtml(mail.eyebrow)}</p>
          <h1 style="margin:0 0 14px;font-family:${SERIF};font-size:23px;line-height:1.3;color:${C.ink};">${escapeHtml(mail.heading)}</h1>
          <p style="margin:0 0 22px;font-family:${SANS};font-size:14px;line-height:1.7;color:${C.body};">${mail.intro}</p>
          ${noteBlock(mail.note)}
          ${detailRows(mail.details)}
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px;"><tr>
            <td style="background:${C.spruce};border-radius:8px;">
              <a href="${link}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:14px;font-weight:700;color:${C.onDark};text-decoration:none;">${escapeHtml(mail.cta)} &rarr;</a>
            </td>
          </tr></table>
          <p style="margin:0 0 24px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted};">${escapeHtml(mail.hint)}</p>
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
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  if (!RESEND_API_KEY || !RESEND_FROM_DOMAIN) {
    return json({ ok: false, reason: 'email_not_configured' });
  }

  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return json({ ok: false, reason: 'unauthenticated' }, 401);

  let payload: { type?: string; refId?: string | null; locale?: string } = {};
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, reason: 'invalid_body' }, 400);
  }

  const type = payload.type as EmailType;
  if (!TYPES.includes(type)) return json({ ok: false, reason: 'unknown_type' }, 400);
  const locale = payload.locale === 'de' ? 'de' : 'en';
  const refId = (payload.refId ?? '').toString();

  const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData?.user) return json({ ok: false, reason: 'unauthenticated' }, 401);
  const callerId = userData.user.id;

  let recipientId = callerId;
  let actorId: string | null = null;
  let note: string | undefined;
  let link = `${SITE_ORIGIN}/app`;
  let dedupeRef = refId;

  try {
    if (type === 'welcome') {
      recipientId = callerId;
      dedupeRef = 'welcome';
      link = `${SITE_ORIGIN}/app`;
    } else if (type === 'match_request') {
      const { data: row } = await userClient
        .from('match_requests')
        .select('id, sender_id, receiver_id, message')
        .eq('id', refId)
        .maybeSingle();
      if (!row || row.sender_id !== callerId) return json({ ok: false, reason: 'not_allowed' });
      recipientId = row.receiver_id;
      actorId = row.sender_id;
      note = (row.message ?? '') || undefined;
      dedupeRef = `request:${row.id}`;
      link = `${SITE_ORIGIN}/app/matches`;
    } else if (type === 'match_accepted') {
      const { data: row } = await userClient
        .from('match_requests')
        .select('id, sender_id, receiver_id, status')
        .eq('id', refId)
        .maybeSingle();
      if (!row || row.receiver_id !== callerId) return json({ ok: false, reason: 'not_allowed' });
      recipientId = row.sender_id;
      actorId = row.receiver_id;
      dedupeRef = `accept:${row.id}`;
      link = `${SITE_ORIGIN}/app/chat`;
    } else {
      const { data: row } = await userClient
        .from('conversations')
        .select('id, user_a, user_b')
        .eq('id', refId)
        .maybeSingle();
      if (!row || (row.user_a !== callerId && row.user_b !== callerId)) {
        return json({ ok: false, reason: 'not_allowed' });
      }
      recipientId = row.user_a === callerId ? row.user_b : row.user_a;
      actorId = callerId;
      const bucket = new Date().toISOString().slice(0, 13);
      dedupeRef = `msg:${row.id}:${bucket}`;
      link = `${SITE_ORIGIN}/app/chat`;
    }
  } catch {
    return json({ ok: false, reason: 'lookup_failed' }, 400);
  }

  if (recipientId === callerId && type !== 'welcome') {
    return json({ ok: false, reason: 'no_recipient' });
  }

  const { data: existing } = await admin
    .from('email_log')
    .select('id')
    .eq('user_id', recipientId)
    .eq('email_type', type)
    .eq('ref_id', dedupeRef)
    .maybeSingle();
  if (existing) return json({ ok: true, skipped: 'duplicate' });

  const ids = [recipientId, actorId].filter(Boolean) as string[];
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, field_of_study, institution_text')
    .in('id', ids);
  const byId = new Map<string, { name: string; field?: string; institution?: string }>();
  (profiles ?? []).forEach(
    (p: {
      id: string;
      full_name: string | null;
      field_of_study: string | null;
      institution_text: string | null;
    }) =>
      byId.set(p.id, {
        name: p.full_name ?? '',
        field: p.field_of_study ?? undefined,
        institution: p.institution_text ?? undefined,
      }),
  );

  const { data: recipientUser } = await admin.auth.admin.getUserById(recipientId);
  const to = recipientUser?.user?.email;
  if (!to) return json({ ok: false, reason: 'no_recipient_email' });

  const actor = actorId ? byId.get(actorId) ?? { name: '' } : { name: '' };
  const mail = buildMail(type, locale, {
    name: byId.get(recipientId)?.name ?? '',
    actor,
    note,
  });

  const de = locale === 'de';
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
        to: [to],
        subject: mail.subject,
        html: layout(mail, link, footerReason, appTagline, langNote),
      }),
    });

    const result = await res.json().catch(() => null);
    if (!res.ok) {
      await admin.from('email_log').insert({
        user_id: recipientId,
        email_type: type,
        ref_id: dedupeRef,
        locale,
        status: 'failed',
        error: (result as { message?: string } | null)?.message ?? `http_${res.status}`,
      });
      return json({ ok: false, reason: 'send_failed' });
    }

    await admin.from('email_log').insert({
      user_id: recipientId,
      email_type: type,
      ref_id: dedupeRef,
      locale,
      resend_id: (result as { id?: string } | null)?.id ?? null,
      status: 'sent',
    });

    return json({ ok: true });
  } catch (err) {
    console.error('Resend send failed', err);
    return json({ ok: false, reason: 'send_error' });
  }
});
