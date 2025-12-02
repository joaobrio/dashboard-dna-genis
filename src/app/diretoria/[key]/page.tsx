import { loadAllStudentsData } from '@/lib/load-all-students';
import { validateAccessKey, getAccessKey } from '@/lib/access-keys';
import { MetricsCards } from '@/components/diretoria/MetricsCards';
import { StudentsTable } from '@/components/diretoria/StudentsTable';
import { ChartsSection } from '@/components/diretoria/ChartsSection';
import { ExportButton } from '@/components/diretoria/ExportButton';
import { BarChart3 } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ key: string }>;
}

export const metadata = {
  title: 'Dashboard Diretoria - Grupo Genis',
  description: 'Visao consolidada de todos os alunos avaliados no DNA Genis',
};

export default async function DiretoriaPage({ params }: PageProps) {
  const { key } = await params;

  // Validate access key - return 404 to not expose that the key is wrong
  if (!key || !validateAccessKey('diretoria', key)) {
    return notFound();
  }

  const { students, metrics } = await loadAllStudentsData();

  return (
    <main className="min-h-screen bg-genis-black text-white">
      {/* Header */}
      <div className="bg-hero-glow border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-genis-yellow/10 border border-genis-yellow/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-genis-yellow" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display">Dashboard Diretoria</h1>
                <p className="text-sm text-gray-400 mt-1">Visao consolidada - Grupo Genis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Ultima atualizacao</p>
                <p className="text-sm font-semibold">
                  {new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Metrics Cards */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Metricas Gerais</h2>
          <MetricsCards metrics={metrics} />
        </section>

        {/* Charts */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Analises Visuais</h2>
          <ChartsSection students={students} metrics={metrics} />
        </section>

        {/* Students Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Todos os Alunos ({students.length})</h2>
            <ExportButton students={students} />
          </div>
          <StudentsTable students={students} />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-6 border-t border-white/10">
          <p>Dashboard DNA Genis - Grupo Genis</p>
          <p className="mt-1">Desenvolvido com tecnologia de ponta para analise de comunicacao</p>
        </footer>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const key = getAccessKey('diretoria');
  if (!key) return [];
  return [{ key }];
}
