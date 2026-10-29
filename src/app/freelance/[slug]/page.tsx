import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CaseStudyPage } from '@/components/case-study/CaseStudyPage';
import { freelance } from '@/content';

export function generateStaticParams() {
  return freelance.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<'/freelance/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const study = freelance.find((s) => s.slug === slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.outcome,
    alternates: { canonical: `/freelance/${study.slug}` },
    openGraph: { title: study.title, description: study.outcome, images: [study.media.src] },
  };
}

// Every slug is prerendered from generateStaticParams, so the boundary never shows its fallback; it keeps the URL
// read out of the App Shell, which instant navigation requires
export default function Page({ params }: PageProps<'/freelance/[slug]'>) {
  return (
    <Suspense fallback={null}>
      <Study params={params} />
    </Suspense>
  );
}

async function Study({ params }: Pick<PageProps<'/freelance/[slug]'>, 'params'>) {
  const { slug } = await params;
  const study = freelance.find((s) => s.slug === slug);
  if (!study) notFound();
  return <CaseStudyPage study={study} list={freelance} />;
}
