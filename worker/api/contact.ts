// POST /api/contact - receives the contact form and emails it to you via Amazon SES.
//
// rahulrahul.com.au is already a verified identity in SES (us-east-1), so no extra DNS is
// needed. To enable, create an IAM user that can only call ses:SendEmail (see README) and set
// these in Cloudflare dashboard -> your Worker -> Settings -> Variables and Secrets
// (or .dev.vars locally):
//   AWS_ACCESS_KEY_ID      (secret)
//   AWS_SECRET_ACCESS_KEY  (secret)
// AWS_REGION, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL have defaults in wrangler.jsonc.
// Until the keys are set, the endpoint returns 503 and the form falls back to mailto.

import { AwsClient } from 'aws4fetch';
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

  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return json({ error: 'Email delivery is not configured yet.' }, 503);
  }

  const region = env.AWS_REGION || 'us-east-1';
  const aws = new AwsClient({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region,
    service: 'ses',
  });

  // SES v2 SendEmail: https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_SendEmail.html
  const res = await aws.fetch(`https://email.${region}.amazonaws.com/v2/email/outbound-emails`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      FromEmailAddress: env.CONTACT_FROM_EMAIL,
      Destination: { ToAddresses: [env.CONTACT_TO_EMAIL] },
      ReplyToAddresses: [email],
      Content: {
        Simple: {
          Subject: { Data: `Website enquiry from ${name}`, Charset: 'UTF-8' },
          Body: { Text: { Data: `Name: ${name}\nEmail: ${email}\n\n${message}`, Charset: 'UTF-8' } },
        },
      },
    }),
  });

  if (!res.ok) {
    console.error('SES error', res.status, await res.text());
    return json({ error: 'Could not send your message. Please email me directly.' }, 502);
  }
  return json({ ok: true });
};
