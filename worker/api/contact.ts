// POST /api/contact - receives the contact form and emails it to you.
//
// Uses Resend (https://resend.com, free tier: 3,000 emails/month). To enable, set these
// in Cloudflare dashboard -> your Worker -> Settings -> Variables and Secrets (or .dev.vars locally):
//   RESEND_API_KEY   = re_xxx               (secret)
//   CONTACT_TO_EMAIL = rahul@rahulrahul.com.au
//   CONTACT_FROM_EMAIL = "Website <contact@rahulrahul.com.au>"  (a domain verified in Resend)
// Until it is configured, the endpoint returns 503 and the form falls back to mailto.

import { json, type Handler } from '../lib';

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  company?: string; // honeypot
}

export const POST: Handler = async (request, env) => {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  // Bots fill every field; silently accept so they don't retry.
  if (body.company) return json({ ok: true });

  const name = (body.name ?? '').trim().slice(0, 120);
  const email = (body.email ?? '').trim().slice(0, 200);
  const message = (body.message ?? '').trim().slice(0, 5000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please provide your name, a valid email and a message.' }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    return json({ error: 'Email delivery is not configured yet.' }, 503);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || 'Website <onboarding@resend.dev>',
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return json({ error: 'Could not send your message. Please email me directly.' }, 502);
  }
  return json({ ok: true });
};
