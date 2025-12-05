'use client';

import { motion } from 'framer-motion';
import { TrendPill } from './TrendPill';
import type { EvolucaoCompleta } from '@/lib/evolucao-loader';

interface EvolutionSummaryProps {
  data: EvolucaoCompleta;
}

export function EvolutionSummary({ data }: EvolutionSummaryProps) {
  const { deltas, video1, video2 } = data;

  // Generate insights based on data
  const melhorias: string[] = [];
  const proximos: string[] = [];

  // Score geral
  if (deltas.scoreGeral !== null) {
    if (deltas.scoreGeral > 0) {
      const pilarDestaque = Object.entries(deltas.pilares)
        .filter(([, v]) => v !== null)
        .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))[0];

      melhorias.push(
        `Score geral ${deltas.scoreGeral > 0 ? '+' : ''}${deltas.scoreGeral} pontos (${video1.scoreGeral} → ${video2.scoreGeral})${
          pilarDestaque ? `, destaque para ${capitalize(pilarDestaque[0])} (+${pilarDestaque[1]})` : ''
        }`
      );
    } else if (deltas.scoreGeral < 0) {
      proximos.push(
        `Score geral caiu ${Math.abs(deltas.scoreGeral)} pontos - análise necessária para identificar causa`
      );
    }
  }

  // Top evolutions
  deltas.maioresEvolucoes.forEach(ind => {
    if (ind.delta !== null && ind.delta > 5) {
      melhorias.push(
        `${ind.nome} subiu de ${ind.v1} → ${ind.v2} (+${ind.delta})`
      );
    }
  });

  // Top drops / areas needing attention
  deltas.maioresQuedas.forEach(ind => {
    if (ind.delta !== null && ind.delta < 0) {
      proximos.push(
        `${ind.nome} caiu de ${ind.v1} → ${ind.v2} (${ind.delta}), atenção necessária`
      );
    } else if (ind.v2 !== null && ind.v2 < 60) {
      proximos.push(
        `${ind.nome} ainda é um gap (${ind.v2}), manter no foco`
      );
    }
  });

  // If no drops, suggest maintenance
  if (proximos.length === 0) {
    proximos.push('Manter consistência nos indicadores fortes');
    proximos.push('Continuar praticando técnicas do curso DNA Genis');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-2xl border border-white/10 p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-genis-yellow">Resumo</p>
          <h2 className="text-lg font-semibold text-white">Análise da Evolução</h2>
        </div>
        {deltas.scoreGeral !== null && (
          <TrendPill value={deltas.scoreGeral} size="lg" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {/* Melhorias */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-white font-semibold">Melhorias Nítidas</p>
          </div>
          {melhorias.length > 0 ? (
            <ul className="space-y-2 text-gray-300">
              {melhorias.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Análise em andamento...</p>
          )}
        </div>

        {/* Próximo ciclo */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <p className="text-white font-semibold">Próximo Ciclo</p>
          </div>
          {proximos.length > 0 ? (
            <ul className="space-y-2 text-gray-300">
              {proximos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Análise em andamento...</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
