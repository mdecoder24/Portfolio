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
