import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { pedroWerlangData } from '@/data/pedro-werlang';
import { loadAnalysisFromMarkdown, prettyNameFromSlug } from '@/lib/load-student-analysis';

interface PageProps {
  params: { aluno: string };
}

export default async function AlunoPage({ params }: PageProps) {
  const slug = params.aluno;
  const loaded = await loadAnalysisFromMarkdown(slug);
  const data = loaded ?? pedroWerlangData;
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
