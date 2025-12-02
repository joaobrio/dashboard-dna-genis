'use client';

import { Users, TrendingUp, Award, BarChart3 } from 'lucide-react';
import type { ConsolidatedMetrics } from '@/lib/load-all-students';
import { CATEGORIA_CONFIG } from '@/lib/categoria-utils';

interface MetricsCardsProps {
  metrics: ConsolidatedMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const categoriasOrdenadas = ['critico', 'a_desenvolver', 'adequado', 'forte', 'excelente'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Alunos */}
      <div className="glass-card p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Total de Alunos</span>
          <Users className="w-5 h-5 text-genis-yellow" />
        </div>
        <div className="text-3xl font-bold">{metrics.totalAlunos}</div>
        <p className="text-xs text-gray-500">Avaliados no DNA Genis</p>
      </div>

      {/* Media Score Geral */}
      <div className="glass-card p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Score Geral Médio</span>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <div className="text-3xl font-bold">
          {metrics.mediaScoreGeral.toFixed(1)}
          <span className="text-lg text-gray-400">/100</span>
        </div>
        <p className="text-xs text-gray-500">Média da turma</p>
      </div>

      {/* Media Autoconfianca */}
      <div className="glass-card p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Autoconfiança Média</span>
          <Award className="w-5 h-5 text-purple-400" />
        </div>
        <div className="text-3xl font-bold">
          {metrics.mediaAutoconfianca.toFixed(1)}
          <span className="text-lg text-gray-400">/100</span>
        </div>
        <p className="text-xs text-gray-500">Score de autoconfiança</p>
      </div>

      {/* Distribuicao */}
      <div className="glass-card p-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Distribuição</span>
          <BarChart3 className="w-5 h-5 text-blue-400" />
        </div>
        <div className="space-y-1.5 mt-3">
          {categoriasOrdenadas.map((cat) => {
            const count = metrics.distribuicaoCategorias[cat] || 0;
            const config = CATEGORIA_CONFIG[cat];
            if (count === 0) return null;
            return (
              <div key={cat} className="flex items-center justify-between text-xs">
                <span className={config.textColor}>{config.label}</span>
                <span className="font-semibold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
