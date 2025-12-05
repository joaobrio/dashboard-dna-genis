import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { loadEvolucaoCompleta, getEvolucaoSlugs } from '@/lib/evolucao-loader';
import {
  EvolutionHero,
  PillarEvolution,
  ComparativeRadar,
  IndicatorRankingCard,
  EvolutionSummary,
} from '@/components/evolution';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = loadEvolucaoCompleta(slug);
  if (!data) return { title: 'Não encontrado' };

  return {
    title: `Evolução ${data.nome} - DNA Genis`,
    description: `Análise comparativa de evolução de ${data.nome} entre Vídeo 01 e Vídeo 02`,
  };
}

export async function generateStaticParams() {
  const slugs = getEvolucaoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function EvolucaoAlunoPage({ params }: PageProps) {
  const { slug } = await params;
  const data = loadEvolucaoCompleta(slug);

  if (!data) {
    notFound();
  }

  const hasCompleteData = data.video1.scoreGeral !== null && data.video2.scoreGeral !== null;

  return (
    <main className="min-h-screen bg-genis-black text-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <Link
            href="/evolucao"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-genis-yellow transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao índice
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-genis-yellow">Evolução</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{data.nome}</h1>
              <p className="text-gray-400 mt-1">
                Análise comparativa Vídeo 01 ({data.video1.date || '22/05/24'}) → Vídeo 02 ({data.video2.date || '04/12/25'})
              </p>
            </div>

            {/* Quick stats */}
            {hasCompleteData && (
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-400">{data.video1.scoreGeral}</p>
                  <p className="text-xs text-gray-500">V1</p>
                </div>
                <div className="text-genis-yellow text-xl">→</div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{data.video2.scoreGeral}</p>
                  <p className="text-xs text-gray-500">V2</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        {hasCompleteData ? (
          <>
            {/* Hero + Pilares */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EvolutionHero
                nome={data.nome}
                scoreV1={data.video1.scoreGeral}
                scoreV2={data.video2.scoreGeral}
                delta={data.deltas.scoreGeral}
                autoconfiancaV1={data.video1.autoconfianca}
                autoconfiancaV2={data.video2.autoconfianca}
                deltaAutoconfianca={data.deltas.autoconfianca}
                dateV1={data.video1.date}
                dateV2={data.video2.date}
              />
              <PillarEvolution
                video1={data.video1.pilares}
                video2={data.video2.pilares}
                deltas={data.deltas.pilares}
              />
            </section>

            {/* Radar Comparativo */}
            {data.deltas.indicadores.length > 0 && (
              <section>
                <ComparativeRadar indicadores={data.deltas.indicadores} />
              </section>
            )}

            {/* Maiores Evoluções e Quedas */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IndicatorRankingCard
                title="Maiores Evoluções"
                subtitle="Indicadores que mais cresceram"
                indicadores={data.deltas.maioresEvolucoes}
                type="up"
              />
              <IndicatorRankingCard
                title="Oportunidades de Melhoria"
                subtitle="Indicadores que precisam de atenção"
                indicadores={data.deltas.maioresQuedas}
                type="down"
              />
            </section>

            {/* Resumo */}
            <section>
              <EvolutionSummary data={data} />
            </section>
          </>
        ) : (
          /* Incomplete data warning */
          <div className="glass-card rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 text-center">
            <p className="text-orange-400 font-semibold mb-2">Dados Incompletos</p>
            <p className="text-gray-400">
              {data.video1.scoreGeral === null
                ? 'Este aluno não possui análise do Vídeo 01.'
                : 'Este aluno não possui análise do Vídeo 02.'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              A evolução comparativa requer ambas as análises.
            </p>
          </div>
        )}

        {/* Footer navigation */}
        <footer className="pt-8 border-t border-white/10">
          <Link
            href="/evolucao"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-genis-yellow transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver todos os alunos
          </Link>
        </footer>
      </div>
    </main>
  );
}
