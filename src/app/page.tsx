'use client';

import { UnifiedRadar } from '@/components/charts/UnifiedRadar';
// import { FeedbackSupremo } from '@/components/feedback/FeedbackSupremo';
import { pedroWerlangData } from '@/data/pedro-werlang';
// import { pedroWerlangFeedback } from '@/data/pedro-werlang-feedback';
import { PILAR_LABELS, PilarType } from '@/types/dna-genis';
import { Dna, TrendingUp, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const data = pedroWerlangData;

  // Prepare radar data com TODOS os indicadores
  const radarData = data.indicadores.map((ind) => ({
    subject: ind.nome,
    score: ind.score,
    fullMark: 100,
  }));

  // Format date
  const analysisDate = new Date(data.meta.timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Extract user name
  const userName = 'Pedro Werlang';

  // Get categoria color
  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'excelente':
      case 'altaPerformance':
        return 'text-green-400';
      case 'forte':
      case 'operacional':
        return 'text-yellow-400';
      case 'essencial':
        return 'text-orange-400';
      case 'critico':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      excelente: 'EXCELENTE',
      altaPerformance: 'ALTA PERFORMANCE',
      forte: 'FORTE',
      operacional: 'OPERACIONAL',
      essencial: 'ESSENCIAL',
      critico: 'CRÍTICO',
    };
    return labels[categoria] || categoria.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-genis-black">
      {/* Hero Gradient Background */}
      <div className="bg-hero-glow fixed top-0 left-0 right-0 h-[180px] opacity-20 pointer-events-none -z-10" />

      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-genis-yellow/20 backdrop-blur-sm border border-genis-yellow/30 flex items-center justify-center glow-yellow">
                <Dna className="w-6 h-6 text-genis-yellow" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DNA Genis</h1>
                <p className="text-xs text-genis-yellow/80">Feedback Supremo</p>
              </div>
            </motion.div>

            {/* User */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{userName}</p>
                <p className="text-xs text-white/60">{analysisDate}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-genis-yellow to-genis-gold flex items-center justify-center text-genis-black font-bold">
                {userName.split(' ').map((n) => n[0]).join('')}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 space-y-12">
        {/* Hero Score Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Score Card */}
          <div className="lg:col-span-1 glass-card p-8 relative overflow-hidden group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-genis-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-genis-yellow" />
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Score Geral
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-7xl font-black text-genis-yellow score-display glow-yellow">
                    {data.resumo.score_geral}
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    {getCategoriaLabel(data.resumo.categoria_geral)}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Autoconfiança</p>
                  <div className="text-3xl font-bold text-gray-900">
                    {data.resumo.score_autoconfianca}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pilares Resumo */}
          <div className="lg:col-span-2 glass-card p-8">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-genis-yellow" />
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Pilares DNA Genis
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.pilares).map(([key, pilar]) => {
                const pilarLabel = PILAR_LABELS[key.toUpperCase() as PilarType] || key;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:border-genis-yellow/50 transition-all duration-300"
                  >
                    <p className="text-sm text-gray-600 mb-2">{pilarLabel}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-genis-yellow">{pilar.score}</span>
                      <span className={`text-sm font-semibold ${getCategoriaColor(pilar.categoria)}`}>
                        {getCategoriaLabel(pilar.categoria)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Radar Chart Unificado */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Mapa de Competências
            </h2>
            <p className="text-gray-400">
              Visualização unificada de todos os seus indicadores DNA Genis
            </p>
          </div>

          <UnifiedRadar data={radarData} />
        </motion.section>

        {/* Top & Bottom Indicators */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Top 3 Indicators */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-bold text-gray-900">Pontos Fortes</h3>
            </div>

            <div className="space-y-4">
              {data.indicadores
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map((ind, index) => (
                  <div
                    key={ind.codigo}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200 hover:border-green-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{ind.nome}</p>
                        <p className="text-xs text-gray-600">{ind.pilar}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{ind.score}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Bottom 3 Indicators (Oportunidades) */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold text-gray-900">Oportunidades de Melhoria</h3>
            </div>

            <div className="space-y-4">
              {data.indicadores
                .sort((a, b) => a.score - b.score)
                .slice(0, 3)
                .map((ind, index) => (
                  <div
                    key={ind.codigo}
                    className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200 hover:border-orange-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{ind.nome}</p>
                        <p className="text-xs text-gray-600">{ind.pilar}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{ind.score}</div>
                  </div>
                ))}
            </div>
          </div>
        </motion.section>

        {/* Feedback Supremo Section - Comentado temporariamente para versão limpa */}
        {/*
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FeedbackSupremo
            analise_id={pedroWerlangFeedback.analise_id}
            data_analise={pedroWerlangFeedback.data_analise}
            contexto={pedroWerlangFeedback.contexto}
            feedback_items={pedroWerlangFeedback.feedback_items}
            mensagem_final={pedroWerlangFeedback.mensagem_final}
            planos_acao={pedroWerlangFeedback.planos_acao}
          />
        </motion.section>
        */}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              DNA Genis - Sistema de Feedback Supremo
            </p>
            <p className="text-sm text-white/40">
              Desenvolvido por GenisHub | {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
