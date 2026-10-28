import 'server-only';
import type { ContactInput } from './contact-schema';

const TOPIC_LABEL: Record<ContactInput['topic'], string> = {
  job: 'Job',
  freelance: 'Freelance',
  collaboration: 'Collaboration',
  hello: 'Hello',
};

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

/** Emails Kushwant through Resend's REST API. Throws when not configured or when Resend refuses. */
export async function sendContactEmail(input: ContactInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) throw new Error('contact email not configured');

  const lines: [string, string | undefined][] = [
    ['Name', input.name],
    ['Email', input.email],
    ['Topic', TOPIC_LABEL[input.topic]],
    ['Project type', input.projectType],
    ['Budget', input.budget],
    ['Timeline', input.timeline],
  ];
  const facts = lines.filter(([, v]) => v).map(([k, v]) => `<p><strong>${k}:</strong> ${escape(v!)}</p>`);
  const html = `${facts.join('')}<p style="white-space:pre-wrap">${escape(input.message)}</p>`;
  const subject = `[${TOPIC_LABEL[input.topic]}] ${input.name.replace(/[\r\n]/g, ' ')}: ${input.message.slice(0, 60).replace(/\s+/g, ' ')}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, reply_to: input.email, subject, html }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
}

/** Instant phone notification. Failures are logged and never fail the submission. */
export async function notifyTelegram(input: ContactInput): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  const budget = input.budget ? `, budget ${input.budget}` : '';
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: `New ${TOPIC_LABEL[input.topic].toLowerCase()} enquiry from ${input.name}${budget}` }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.warn('contact: telegram notify failed', res.status);
  } catch {
    console.warn('contact: telegram notify failed');
  }
}
