'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { getScoreCategory, getScoreColor } from '@/lib/design-tokens';
import { Indicator, PILAR_LABELS, PILAR_COLORS, PilarType } from '@/types/dna-genis';
import { AlertCircle, Target } from 'lucide-react';
import { motion, FadeUp, StaggerContainer, StaggerItem } from '@/components/motion';

interface IndicatorRankingProps {
  indicators: Indicator[];
  groupByPilar?: boolean;
  showPriorityFocus?: boolean;
}

// Get glow class based on score
function getScoreGlowClass(score: number): string {
  if (score >= 85) return 'glow-alta-performance';
  if (score >= 70) return 'glow-operacional';
  if (score >= 50) return 'glow-essencial';
  return 'glow-critico';
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
  const color = getScoreColor(indicator.score);
  const pilarColor = PILAR_COLORS[indicator.pilar];
  const glowClass = isPriorityFocus ? getScoreGlowClass(indicator.score) : '';

  return (
    <motion.div
      className={cn(
        'relative py-3 px-4 rounded-xl transition-all cursor-pointer',
        isPriorityFocus && 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200',
        !isPriorityFocus && 'hover:bg-neutral-50',
        isPriorityFocus && glowClass
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{
        scale: 1.01,
        transition: { type: 'spring', stiffness: 300 }
      }}
    >
      <div className="flex items-center justify-between mb-2">
        {/* Indicator name and pilar */}
        <div className="flex items-center gap-2">
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: pilarColor }}
            whileHover={{ scale: 1.5 }}
          />
          <span className="font-medium text-neutral-800">{indicator.nome}</span>
          {isPriorityFocus && (
            <motion.span
              className="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Target className="w-3 h-3" />
              Foco
            </motion.span>
          )}
        </div>

        {/* Score */}
        <div className="flex items-center gap-2">
          <motion.span
            className="text-lg font-bold score-display"
            style={{ color }}
            whileHover={{ scale: 1.1 }}
          >
            {indicator.score}
          </motion.span>
          {indicator.delta !== null && indicator.delta !== 0 && (
            <motion.span
              className={cn(
                'text-xs font-medium px-1.5 py-0.5 rounded-full',
                indicator.delta > 0
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-red-600 bg-red-50'
              )}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              {indicator.delta > 0 ? '+' : ''}
              {indicator.delta}
            </motion.span>
          )}
        </div>
      </div>

      {/* Progress bar with gradient */}
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${indicator.score}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.05, ease: 'easeOut' }}
        />
      </div>

      {/* Recomendação (se houver) */}
      {isPriorityFocus && indicator.aula_recomendada && (
        <motion.div
          className="mt-2 text-xs text-neutral-500 glass px-2 py-1 rounded-lg inline-block"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
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
  groupIndex,
}: {
  pilar: PilarType;
  indicators: Indicator[];
  averageScore: number;
  groupIndex: number;
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
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: groupIndex * 0.1 }}
    >
      {/* Pilar header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: pilarColor }}
            whileHover={{ scale: 1.3 }}
          />
          <h4 className="font-semibold text-neutral-900 headline-premium">{pilarLabel}</h4>
          <span className="text-sm text-neutral-400">
            ({indicators.length} indicadores)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Média:</span>
          <motion.span
            className="font-bold text-neutral-800 score-display"
            style={{ color: pilarColor }}
            whileHover={{ scale: 1.1 }}
          >
            {averageScore.toFixed(0)}
          </motion.span>
        </div>
      </div>

      {/* Indicators with stagger */}
      <StaggerContainer className="space-y-2">
        {sortedIndicators.map((indicator, index) => (
          <StaggerItem key={indicator.codigo}>
            <IndicatorBar
              indicator={indicator}
              index={index}
              isPriorityFocus={indicator.codigo === priorityFocusCode}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </motion.div>
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
      <FadeUp>
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Seus 19 Indicadores</CardTitle>
              <span className="text-sm text-neutral-500">
                Ordenado por score
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <StaggerContainer className="space-y-2">
              {sortedIndicators.map((indicator, index) => (
                <StaggerItem key={indicator.codigo}>
                  <IndicatorBar
                    indicator={indicator}
                    index={index}
                    isPriorityFocus={indicator.codigo === lowestScore.codigo}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </CardContent>
        </Card>
      </FadeUp>
    );
  }

  return (
    <FadeUp>
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Seus Indicadores por Pilar</CardTitle>
            <motion.div
              className="flex items-center gap-2 text-sm text-neutral-500 glass px-3 py-1.5 rounded-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Indicadores com menor score destacados</span>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          {pilarOrder
            .filter((pilar) => groupedIndicators[pilar]?.length > 0)
            .map((pilar, index) => (
              <PilarGroup
                key={pilar}
                pilar={pilar}
                indicators={groupedIndicators[pilar]}
                averageScore={pilarAverages[pilar]}
                groupIndex={index}
              />
            ))}
        </CardContent>
      </Card>
    </FadeUp>
  );
}
