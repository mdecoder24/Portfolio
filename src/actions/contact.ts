'use server';

import 'server-only';
import { headers } from 'next/headers';
import { ContactInput, fieldErrors, formValues, type ContactState } from '@/lib/contact-schema';
import { notifyTelegram, sendContactEmail } from '@/lib/notify';
import { hashIp, limit } from '@/lib/ratelimit';

export async function contact(_prev: ContactState, data: FormData): Promise<ContactState> {
  const values = formValues(data);

  // A filled honeypot is a bot: pretend it worked and stop
  if (typeof data.get('website') === 'string' && data.get('website') !== '') return { status: 'sent' };

  const parsed = ContactInput.safeParse(values);
  if (!parsed.success) return { status: 'invalid', errors: fieldErrors(parsed.error), values };

  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  if (!limit(`contact:${hashIp(ip)}`, 5, 60 * 60 * 1000).ok) {
    console.info('contact: rate-limited');
    return { status: 'failed', values };
  }

  try {
    await sendContactEmail(parsed.data);
  } catch (e) {
    console.error('contact: send failed', e instanceof Error ? e.message : 'unknown');
    return { status: 'failed', values };
  }
  await notifyTelegram(parsed.data);
  console.info('contact: sent');
  return { status: 'sent' };
}
