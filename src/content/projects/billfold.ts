import { CaseStudy } from '../schema.ts';

// From billifold.netlify.app and the BillFold repository's README and package.json (31 Oct 2026)
export const billfold = CaseStudy.parse({
  slug: 'billfold',
  kind: 'personal',
  title: 'Billfold, GST invoice maker',
  context: 'Web app',
  outcome:
    'A free GST invoice generator that runs in the browser: 10 document types and 5 PDF templates, with no account or server.',
  role: 'Developer',
  stack: ['Next.js', 'React', 'TypeScript', 'jsPDF', 'three.js'],
  categories: ['full-stack', 'tools'],
  links: [
    { label: 'GitHub', href: 'https://github.com/mdecoder24/BillFold' },
    { label: 'Live', href: 'https://billifold.netlify.app/' },
  ],
  // Shown under "View more projects" rather than in the main grid
  featured: false,
  media: {
    src: '/media/billfold/screen.jpg',
    screen: '/media/billfold/phone.jpg',
    alt: 'The Billfold home page: the headline "GST invoices, ready in minutes, right in your browser" beside a fan of sample tax invoices',
  },
  body: {
    problem:
      "Making a GST invoice shouldn't need an account or a subscription, or mean sending your business's data to someone else's server.",
    built:
      'A static Next.js app that makes invoices, quotations, receipts, credit notes and purchase orders as PDFs, with GST worked out for you. It also tracks what has been billed, paid and is overdue, and everything stays in the browser.',
    decisions: [
      {
        title: 'Everything in the browser',
        detail:
          'Built as a static export with no backend: PDFs are made on the device with jsPDF, and data lives in browser storage.',
      },
      {
        title: 'GST worked out for you',
        detail:
          'CGST and SGST, or IGST, are chosen from the two GSTINs and the place of supply, with an HSN summary on the PDF.',
      },
      {
        title: 'A live PDF preview',
        detail:
          'Every change redraws the real PDF beside the form with pdf.js, so what you see is what you send.',
      },
    ],
    results: ['Live on Netlify', '10 document types, 5 PDF templates and 5 business calculators'],
  },
  readme: {
    overview:
      'A GST invoice generator that runs entirely in the browser. It makes invoices, quotations, receipts and more as PDFs, with no account, no server and no watermark.',
    features: [
      '10 document types and 5 PDF templates, in any colour',
      'GST worked out from the GSTINs and place of supply',
      'A live PDF preview beside the form',
      'Billed, paid and overdue totals, with a CSV sales register',
      'Data stays in the browser, with backup and restore',
    ],
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'jsPDF', 'pdf.js', 'three.js', 'Netlify'],
    run: ['cd invoice-app', 'npm install', 'npm run dev'],
    needs: 'Node.js 20.9 or newer',
  },
});
