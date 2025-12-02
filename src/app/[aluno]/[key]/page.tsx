import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { prettyNameFromSlug, loadStudentJson, getAllStudentSlugs } from '@/lib/load-student-analysis';
import { validateAccessKey, getAccessKey } from '@/lib/access-keys';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ aluno: string; key: string }>;
}

export default async function AlunoPage({ params }: PageProps) {
  const { aluno: slug, key } = await params;

  // Validate slug exists
  if (!slug) return notFound();

  // Validate access key - return 404 to not expose that the key is wrong
  if (!key || !validateAccessKey(slug, key)) {
    return notFound();
  }

  const data = await loadStudentJson(slug);
  if (!data) return notFound();

  const userName = prettyNameFromSlug(slug);
  const analysisDate = new Date(data.meta.timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <DashboardShell
      data={data}
      userName={userName}
      analysisDate={analysisDate}
    />
  );
}

export async function generateStaticParams() {
  const slugs = getAllStudentSlugs();
  return slugs.map((slug) => {
    const key = getAccessKey(slug);
    return { aluno: slug, key: key || '' };
  }).filter(params => params.key !== '');
}
