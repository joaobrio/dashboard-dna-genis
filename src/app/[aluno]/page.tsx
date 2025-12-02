import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { prettyNameFromSlug, loadStudentJson, getAllStudentSlugs } from '@/lib/load-student-analysis';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { aluno: string };
}

export default async function AlunoPage({ params }: PageProps) {
  const slug = params?.aluno;
  if (!slug) return notFound();

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
  return slugs.map((slug) => ({ aluno: slug }));
}
