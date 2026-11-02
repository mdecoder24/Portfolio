import type { NextConfig } from 'next';

// Report-only for the first week, then switch the header name to enforce (Architecture "Security & privacy").
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy-Report-Only', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(), payment=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return [
      // Sample projects replaced by the résumé's; their slugs were public, so they land on the work list
      ...['documind', 'pulse', 'orbit', 'codelens'].map((slug) => ({
        source: `/projects/${slug}`,
        destination: '/#work',
        permanent: true,
      })),
      // The freelance section and its sample case studies were removed
      { source: '/freelance/:slug', destination: '/#work', permanent: true },
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
