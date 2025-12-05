'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Target, TrendingUp, BookOpen, Calendar, Lightbulb } from 'lucide-react';
import { DnaGenisAnalysis } from '@/lib/zod-student';
import { buildInsightsFromAnalysis } from '@/lib/insights';
import { InsightsTimeline } from '@/components/analysis/InsightsTimeline';

interface AnalysisDigestProps {
  data: DnaGenisAnalysis;
  userName?: string;
  analysisDate?: string;
}

export function AnalysisDigest({ data, userName, analysisDate }: AnalysisDigestProps) {
  const planoAcao = data.plano_acao;
  const evolucao = data.evolucao;
  const proximosPassos = data.proximos_passos;
  const materiais = data.materiais;
  const insights = data.insights || buildInsightsFromAnalysis(data);

  // Pegar top 3 indicadores (pontos fortes) e bottom 3 (gaps)
  const sortedIndicadores = [...data.indicadores].sort((a, b) => b.score - a.score);
  const topIndicadores = sortedIndicadores.slice(0, 3);
  const bottomIndicadores = sortedIndicadores.slice(-3).reverse();

  // Se não houver plano de ação, mostrar versão simplificada
  const hasPlanoAcao = planoAcao && planoAcao.trilhas && planoAcao.trilhas.length > 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Plano de Desenvolvimento</h2>
          <p className="text-sm text-gray-400">
            Trilha personalizada baseada na sua análise DNA Genis
          </p>
        </div>
        {analysisDate && (
          <div className="text-sm text-gray-400 flex gap-3 flex-wrap">
            <span>Data: {analysisDate}</span>
            <span>•</span>
            <span>Análise #{data.resumo.numero_analise}</span>
          </div>
        )}
      </div>

      {/* Indicadores Priorizados */}
      {hasPlanoAcao && planoAcao.indicadores_priorizados && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-genis-yellow" />
            <h3 className="text-lg font-semibold text-white">Foco do Desenvolvimento</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {planoAcao.indicadores_priorizados.map((ind, idx) => (
              <span
                key={ind}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  idx === 0
                    ? 'bg-genis-yellow/20 text-genis-yellow border border-genis-yellow/30'
                    : 'bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                {idx === 0 ? '🎯 ' : ''}{ind.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Trilhas de Desenvolvimento */}
      {hasPlanoAcao && planoAcao.trilhas && (
        <div className="glass-card rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-genis-yellow" />
            <h3 className="text-lg font-semibold text-white">
              Trilha de {planoAcao.duracao_semanas || 4} Semanas
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planoAcao.trilhas.map((trilha, idx) => (
              <motion.div
                key={trilha.semanas}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-genis-yellow uppercase tracking-wide">
                    Semana {trilha.semanas}
                  </span>
                  <span className="text-xs text-gray-500">
                    {trilha.foco?.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-white font-semibold mb-3">{trilha.objetivo}</p>

                {trilha.aula_nome && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{trilha.aula_nome}</span>
                  </div>
                )}

                {trilha.exercicios && trilha.exercicios.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-2">Exercícios:</p>
                    <ul className="space-y-1">
                      {trilha.exercicios.map((ex) => (
                        <li key={ex.nome} className="text-sm text-gray-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-genis-yellow/60" />
                          {ex.nome} ({ex.duracao_minutos}min, {ex.frequencia})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {trilha.criterios_sucesso && trilha.criterios_sucesso.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-2">Critérios de Sucesso:</p>
                    <ul className="space-y-1">
                      {trilha.criterios_sucesso.map((criterio) => (
                        <li key={criterio} className="text-sm text-green-400/80 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3" />
                          {criterio}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Desafio do Mês */}
      {hasPlanoAcao && planoAcao.desafio_mes && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-genis-yellow/30 bg-genis-yellow/5 p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-genis-yellow" />
            <h3 className="text-lg font-semibold text-white">Desafio do Mês</h3>
          </div>
          <p className="text-xl font-bold text-genis-yellow mb-2">
            {planoAcao.desafio_mes.nome}
          </p>
          <p className="text-gray-300">{planoAcao.desafio_mes.descricao}</p>
        </motion.div>
      )}

      {/* Projeção e Próximos Passos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Projeção */}
        {evolucao && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl border border-white/10 p-4"
          >
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Projeção de Evolução
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Atual</span>
                <span className="font-bold text-white">{data.resumo.score_geral}</span>
              </div>
              {evolucao.projecao_30_dias && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">30 dias</span>
                  <span className="font-bold text-green-400">{evolucao.projecao_30_dias}</span>
                </div>
              )}
              {evolucao.projecao_90_dias && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">90 dias</span>
                  <span className="font-bold text-genis-yellow">{evolucao.projecao_90_dias}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Próximos Passos */}
        {proximosPassos && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl border border-white/10 p-4 md:col-span-2"
          >
            <h4 className="text-sm font-semibold text-white mb-3">Próximos Passos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {proximosPassos.imediatos && proximosPassos.imediatos.length > 0 && (
                <div>
                  <p className="text-xs text-genis-yellow uppercase tracking-wide mb-2">Imediato</p>
                  <ul className="space-y-1">
                    {proximosPassos.imediatos.map((p) => (
                      <li key={p} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-genis-yellow mt-1">→</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {proximosPassos.curto_prazo && proximosPassos.curto_prazo.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">30 dias</p>
                  <ul className="space-y-1">
                    {proximosPassos.curto_prazo.map((p) => (
                      <li key={p} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-gray-500 mt-1">→</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {proximosPassos.proxima_avaliacao && (
              <div className="mt-4 pt-3 border-t border-white/10 text-sm text-gray-400">
                Próxima avaliação: <span className="text-white">{proximosPassos.proxima_avaliacao}</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Materiais Recomendados */}
      {materiais && materiais.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-genis-yellow" />
            <h3 className="text-lg font-semibold text-white">Materiais Recomendados</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {materiais.filter(m => m.prioridade === 'alta').map((material) => (
              <div
                key={material.nome}
                className="rounded-xl border border-white/10 bg-white/5 p-3 hover:border-genis-yellow/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wide text-genis-yellow">
                    {material.tipo}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-genis-yellow/20 text-genis-yellow">
                    Alta
                  </span>
                </div>
                <p className="text-sm font-medium text-white">{material.nome}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {material.indicador_relacionado?.replace(/_/g, ' ')}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Linha do Tempo - Insights do Sensor Audiovisual */}
      {insights.timeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <InsightsTimeline events={insights.timeline.slice(0, 12)} />
        </motion.div>
      )}
    </section>
  );
}
