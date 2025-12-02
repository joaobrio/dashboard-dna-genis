'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { getScoreCategory, getScoreColor } from '@/lib/design-tokens';
import { Indicator, PILAR_LABELS, PILAR_COLORS, PilarType } from '@/types/dna-genis';
import { AlertCircle, TrendingUp, Target } from 'lucide-react';

interface IndicatorRankingProps {
  indicators: Indicator[];
  groupByPilar?: boolean;
  showPriorityFocus?: boolean;
}

// Single indicator bar component
function IndicatorBar({
  indicator,
  index,
  isPriorityFocus,
}: {
  indicator: Indicator;
  index: number;
  isPriorityFocus: boolean;
}) {
  const category = getScoreCategory(indicator.score);
  const color = getScoreColor(indicator.score);
  const pilarColor = PILAR_COLORS[indicator.pilar];

  return (
    <motion.div
      className={cn(
        'relative py-3 px-4 rounded-xl transition-all',
        isPriorityFocus && 'bg-orange-50 border border-orange-200'
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        {/* Indicator name and pilar */}
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: pilarColor }}
          />
          <span className="font-medium text-neutral-800">{indicator.nome}</span>
          {isPriorityFocus && (
            <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
              <Target className="w-3 h-3" />
              Foco
            </span>
          )}
        </div>

        {/* Score */}
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-bold"
            style={{ color }}
          >
            {indicator.score}
          </span>
          {indicator.delta !== null && indicator.delta !== 0 && (
            <span
              className={cn(
                'text-xs font-medium',
                indicator.delta > 0 ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              {indicator.delta > 0 ? '+' : ''}
              {indicator.delta}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${indicator.score}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.05, ease: 'easeOut' }}
        />
      </div>

      {/* Recomendação (se houver) */}
      {isPriorityFocus && indicator.aula_recomendada && (
        <motion.div
          className="mt-2 text-xs text-neutral-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.05 }}
        >
          Recomendação: {indicator.aula_recomendada}
        </motion.div>
      )}
    </motion.div>
  );
}

// Pilar group component
function PilarGroup({
  pilar,
  indicators,
  averageScore,
}: {
  pilar: PilarType;
  indicators: Indicator[];
  averageScore: number;
}) {
  const pilarLabel = PILAR_LABELS[pilar];
  const pilarColor = PILAR_COLORS[pilar];

  // Sort indicators by score descending
  const sortedIndicators = [...indicators].sort((a, b) => b.score - a.score);

  // Find priority focus (lowest score or prioridade_acao = 1)
  const priorityFocusCode = sortedIndicators.reduce((lowest, ind) => {
    if (ind.prioridade_acao === 1) return ind.codigo;
    if (!lowest) return ind.codigo;
    return ind.score < indicators.find((i) => i.codigo === lowest)!.score
      ? ind.codigo
      : lowest;
  }, null as string | null);

  return (
    <div className="mb-8">
      {/* Pilar header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: pilarColor }}
          />
          <h4 className="font-semibold text-neutral-900">{pilarLabel}</h4>
          <span className="text-sm text-neutral-400">
            ({indicators.length} indicadores)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Média:</span>
          <span className="font-bold text-neutral-800">{averageScore.toFixed(0)}</span>
        </div>
      </div>

      {/* Indicators */}
      <div className="space-y-2">
        {sortedIndicators.map((indicator, index) => (
          <IndicatorBar
            key={indicator.codigo}
            indicator={indicator}
            index={index}
            isPriorityFocus={indicator.codigo === priorityFocusCode}
          />
        ))}
      </div>
    </div>
  );
}

export function IndicatorRanking({
  indicators,
  groupByPilar = true,
}: IndicatorRankingProps) {
  // Group indicators by pilar
  const groupedIndicators = indicators.reduce(
    (acc, indicator) => {
      const pilar = indicator.pilar;
      if (!acc[pilar]) {
        acc[pilar] = [];
      }
      acc[pilar].push(indicator);
      return acc;
    },
    {} as Record<PilarType, Indicator[]>
  );

  // Calculate average per pilar
  const pilarAverages = Object.entries(groupedIndicators).reduce(
    (acc, [pilar, inds]) => {
      const avg = inds.reduce((sum, ind) => sum + ind.score, 0) / inds.length;
      acc[pilar as PilarType] = avg;
      return acc;
    },
    {} as Record<PilarType, number>
  );

  // Order of pilares
  const pilarOrder: PilarType[] = ['ORATORIA', 'INTERPESSOAL', 'INTRAPESSOAL', 'REPERTORIO'];

  if (!groupByPilar) {
    // Show all indicators sorted by score
    const sortedIndicators = [...indicators].sort((a, b) => b.score - a.score);
    const lowestScore = sortedIndicators[sortedIndicators.length - 1];

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Seus 19 Indicadores</CardTitle>
            <span className="text-sm text-neutral-500">
              Ordenado por score
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedIndicators.map((indicator, index) => (
              <IndicatorBar
                key={indicator.codigo}
                indicator={indicator}
                index={index}
                isPriorityFocus={indicator.codigo === lowestScore.codigo}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Seus Indicadores por Pilar</CardTitle>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <AlertCircle className="w-4 h-4" />
            <span>Indicadores com menor score destacados</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {pilarOrder
          .filter((pilar) => groupedIndicators[pilar]?.length > 0)
          .map((pilar) => (
            <PilarGroup
              key={pilar}
              pilar={pilar}
              indicators={groupedIndicators[pilar]}
              averageScore={pilarAverages[pilar]}
            />
          ))}
      </CardContent>
    </Card>
  );
}
