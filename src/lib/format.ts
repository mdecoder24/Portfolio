const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-07" → "Jul 2026" */
export function formatMonth(iso: string): string {
  const [y, m] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** Nacre date ranges: "Jan – Jun 2026", "Jul 2026 – present", "Nov 2025 – Feb 2026" */
export function formatRange(start: string, end?: string): string {
  if (!end) return `${formatMonth(start)} – present`;
  const [sy, sm] = start.split('-');
  const [ey, em] = end.split('-');
  if (sy === ey && sm === em) return formatMonth(start);
  if (sy === ey) return `${MONTHS[Number(sm) - 1]} – ${MONTHS[Number(em) - 1]} ${ey}`;
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

/** Indian digit grouping: 150000 → "₹1,50,000" */
export function formatRupees(n: number): string {
  return `₹${new Intl.NumberFormat('en-IN').format(n)}`;
}

export const showSampleRibbon = process.env.NEXT_PUBLIC_SITE_ENV !== 'production';

/**
 * Splits a fact around its first count, for counting it up: "14+ projects shipped" → "", 14, "+ projects shipped".
 * Years (1900–2100) are labels rather than counts, so "B.Tech, 2026" has nothing to count.
 */
export function splitCount(
  text: string,
): { before: string; value: number; decimals: number; grouped: boolean; after: string } | null {
  for (const m of text.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
    const raw = m[0];
    const value = Number(raw.replace(/,/g, ''));
    if (/^\d{4}$/.test(raw) && value >= 1900 && value <= 2100) continue;
    const decimals = raw.includes('.') ? raw.length - raw.indexOf('.') - 1 : 0;
    const grouped = raw.includes(',');
    return { before: text.slice(0, m.index), value, decimals, grouped, after: text.slice(m.index + raw.length) };
  }
  return null;
}

/** Writes a count the way the fact wrote it: same decimal places, Indian grouping if it had commas */
export function formatCount(n: number, { decimals, grouped }: { decimals: number; grouped: boolean }): string {
  return grouped
    ? n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : n.toFixed(decimals);
}
