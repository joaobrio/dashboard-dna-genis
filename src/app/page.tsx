'use client';

import { HeroScore } from '@/components/dashboard/HeroScore';
import { PillarRadar } from '@/components/charts/PillarRadar';
import { IndicatorRanking } from '@/components/dashboard/IndicatorRanking';
import { ActionPlanSection } from '@/components/dashboard/ActionPlan';
import { pedroWerlangData } from '@/data/pedro-werlang';
import { PILAR_LABELS, PilarType } from '@/types/dna-genis';
import { Dna, User } from 'lucide-react';

export default function DashboardPage() {
  const data = pedroWerlangData;

  // Prepare radar data
  const radarData = Object.entries(data.pilares).map(([key, pilar]) => ({
    pilar: PILAR_LABELS[key.toUpperCase() as PilarType] || key,
    score: pilar.score,
    fullMark: 100,
  }));

  // Format date
  const analysisDate = new Date(data.meta.timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Extract user name from analysis id
  const userName = 'Pedro';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Dna className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-neutral-900">DNA Genis</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#"
                className="text-sm font-medium text-purple-600 border-b-2 border-purple-600 pb-4 -mb-4"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Evolução
              </a>
              <a
                href="#"
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Biblioteca
              </a>
            </nav>

            {/* User */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-neutral-600">{userName}</span>
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Score Card - 2 columns */}
          <div className="lg:col-span-2">
            <HeroScore
              score={data.resumo.score_geral}
              userName={userName}
              analysisNumber={data.resumo.numero_analise}
              autoconfianca={data.resumo.score_autoconfianca}
              analysisDate={analysisDate}
            />
          </div>

          {/* Radar Chart - 3 columns */}
          <div className="lg:col-span-3">
            <PillarRadar data={radarData} />
          </div>
        </section>

        {/* Indicators Section */}
        <section className="mb-8">
          <IndicatorRanking indicators={data.indicadores} groupByPilar={true} />
        </section>

        {/* Action Plan Section */}
        <section>
          <ActionPlanSection
            actionPlan={data.plano_acao}
            nextSteps={data.proximos_passos}
            currentScore={data.resumo.score_geral}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">
              DNA Genis - Sistema de Feedback Supremo
            </p>
            <p className="text-sm text-neutral-400">
              Desenvolvido por GenisHub | {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
