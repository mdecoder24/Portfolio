import 'server-only';
import { createHash } from 'node:crypto';

// In-memory sliding window, per server instance. Swap for @upstash/ratelimit before launch (Architecture ADR-08)
// so the limit holds across serverless instances.
const hits = new Map<string, number[]>();

export function hashIp(ip: string): string {
  const day = new Date().toISOString().slice(0, 10); // daily salt: raw IPs are never stored
  return createHash('sha256').update(`${ip}:${day}:${process.env.IP_HASH_SALT ?? ''}`).digest('hex').slice(0, 32);
}

export function limit(key: string, max: number, windowMs: number): { ok: boolean } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return { ok: false };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) hits.clear(); // bound memory under abuse
  return { ok: true };
}
