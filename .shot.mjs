import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await p.goto('http://localhost:3000/?3d=off#about', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
await p.locator('#about header').screenshot({ path: '/private/tmp/claude-501/-Users-kush24-Projects-Portfolio/a172d588-bce6-47e9-8c7d-5c9dfb2e7f5d/scratchpad/label2.png' });
await b.close();
