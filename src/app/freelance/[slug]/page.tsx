import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

export default async function Page({ params }: PageProps<'/freelance/[slug]'>) {
  const { slug } = await params;
  const study = freelance.find((s) => s.slug === slug);
  if (!study) notFound();
  return <CaseStudyPage study={study} list={freelance} />;
}
